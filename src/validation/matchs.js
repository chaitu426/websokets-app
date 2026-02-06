import {z} from "zod";

export const MATCH_STATUS = {SCHEDULED:"scheduled",LIVE:"live",FINISHED:"finished"};

export const listMatchesQuerySchema = z.object({
    limit: z.coerce.number().int().positive().max(100).optional(),
})

export const matchIdParamSchema = z.object({
    id: z.coerce.number().int().positive(),
})

const isoDateString = z.string().refine((val) => !isNaN(Date.parse(val)),{
    message: "Invalid date",
});

export const createMatchSchema = z.object({
    sport: z.string(),
    homeTeam: z.string(),
    awayTeam: z.string(),
    status: z.string(),
    startTime: z.string(),
    endTime: z.string(),
    homeScore: z.coerce.number().int().nonnegative().optional(),
    awayScore: z.coerce.number().int().nonnegative().optional(),
}).superRefine((data,ctx) => {
    const start = new Date(data.startTime);
    const end = new Date(data.endTime);
    if(start >= end){
        ctx.addIssue({
            code: "custom",
            message: "Start time must be before end time",
            path: ["startTime"],
        });
    }
});

export const updateMatchSchema = z.object({
    homeTeam: z.string().optional(),
    awayTeam: z.string().optional(),
});
