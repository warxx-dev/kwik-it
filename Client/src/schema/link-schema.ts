import type { FieldValues } from "react-hook-form";
import { z } from "zod";

export const LinkSchema = z.object({
  originalUrl: z.url("Please enter a valid URL").nonempty("URL is required"),
  shortCode: z.string("Invalid custom name").optional(),
});

export interface LinkData extends FieldValues {
  originalUrl: string;
  shortCode?: string;
}
