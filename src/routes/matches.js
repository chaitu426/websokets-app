import { Router } from 'express';
import { createMatchSchema, listMatchesQuerySchema } from "../validation/matchs.js";
import db from '../db/connect.js';
import { matches } from '../db/schema.js';
import { getMatchStatus } from '../utils/match-status.js';
import { desc } from 'drizzle-orm';

const matchRouter = Router();
const MAX_LIMIT = 100;

matchRouter.get("/", async (req, res) => {
    const parsed = listMatchesQuerySchema.safeParse(req.query);
    if (!parsed.success) {
        return res.status(400).json({
            error: JSON.stringify(parsed.error)
        })
    }
    const limit = Math.min(parsed.data.limit ?? 50, MAX_LIMIT);
    
    try{
        const matches = await db.select().from(matches).orderBy(desc(matches.createdAt)).limit(limit);
        return res.status(200).json({
            message: "Matches fetched successfully",
            matches
        });
    }catch(err){
        res.status(500).json({
            error: "Internal server error"
        })
    }
});

matchRouter.post("/", async (req, res) => {
    const parsed = createMatchSchema.safeParse(req.body);
    if (!paresd.success) {
        return res.status(400).json({
            error: JSON.stringify(parsed.error)

        })
    }

    try {
        const [event] = await db.insert(matches).values(
            {
                ...parsed.data,
                startTime: new Date(parsed.data.startTime),
                endTime: new Date(parsed.data.endTime),
                homeScore: parsed.data.homeScore ?? 0,
                awayScore: parsed.data.awayScore ?? 0,
                status: getMatchStatus(parsed.data.startTime, parsed.data.endTime)
            }).returning();

        return res.status(201).json({
            message: "Match created successfully",
            match: event
        });
    } catch (err) {
        res.status(500).json({
            error: "Internal server error"
        })
    }
})

export default matchRouter;