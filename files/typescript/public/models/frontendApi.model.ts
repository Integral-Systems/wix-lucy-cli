import { z } from "zod";

export const frontendAPISchema =  z.object({});
export type FrontendAPI = z.infer<typeof frontendAPISchema>;