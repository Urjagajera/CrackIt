import { z } from "zod";

export const getAnalyticsSchema = z.object({
  period: z.enum(["week", "month", "all"]).optional().default("month"),
});
