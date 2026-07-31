import { z } from "zod";

export const resumeIdParamSchema = z.object({
  id: z.string().uuid("Invalid resume ID format"),
});
