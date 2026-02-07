import { Router } from 'express';
import db from '../db/connect.js';
import { commentary } from '../db/schema.js';
import { createCommentarySchema } from '../validation/commentary.js';
import { matchIdParamSchema } from '../validation/matchs.js';

const commentaryRouter = Router({ mergeParams: true });

import { eq, desc } from 'drizzle-orm';
import { listCommentaryQuerySchema } from '../validation/commentary.js';

const MAX_LIMIT = 100;

commentaryRouter.get('/', async (req, res) => {
    const paramsResult = matchIdParamSchema.safeParse({ id: req.params.matchId });
    if (!paramsResult.success) {
        return res.status(400).json({
            error: paramsResult.error.errors || paramsResult.error.message || 'Invalid match ID'
        });
    }

    const queryResult = listCommentaryQuerySchema.safeParse(req.query);
    if (!queryResult.success) {
        return res.status(400).json({
            error: queryResult.error.errors || queryResult.error.message || 'Invalid query parameters'
        });
    }

    try {

        const { limit = 10, offset = 0 } = queryResult.data;
        const { id: matchId } = paramsResult.data;
        const safeLimit = Math.min(limit, MAX_LIMIT);

        const results = await db.select().from(commentary).where(eq(commentary.matchId, matchId)).orderBy(desc(commentary.createdAt)).limit(safeLimit).offset(offset);

        return res.status(200).json({
            message: "Commentary fetched successfully",
            commentary: results
        });

    } catch (error) {
        console.error('Error fetching commentary:', error);
        return res.status(500).json({ error: 'Failed to fetch commentary' });
    }
});


commentaryRouter.post('/', async (req, res) => {

    const paramsResult = matchIdParamSchema.safeParse({ id: req.params.matchId });
    if (!paramsResult.success) {
        return res.status(400).json({
            error: paramsResult.error.errors || paramsResult.error.message || 'Failed to create commentary'
        });
    }
    const bodyResult = createCommentarySchema.safeParse(req.body);
    if (!bodyResult.success) {
        return res.status(400).json({
            error: bodyResult.error.errors || bodyResult.error.message || 'Failed to create commentary'
        });
    }
    try {
        const { minutes, ...rest } = bodyResult.data;
        const [result] = await db.insert(commentary).values({
            matchId: paramsResult.data.id,
            minutes,
            ...rest
        }).returning();

        if (req.app.locals.broadcastCommentary) {
            req.app.locals.broadcastCommentary(result.matchId, result);
        }

        return res.status(201).json(result);

    } catch (error) {
        return res.status(400).json({
            error: error.errors || error.message || 'Failed to create commentary'
        });
    }
});

export default commentaryRouter;
