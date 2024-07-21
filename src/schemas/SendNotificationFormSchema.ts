import { z } from "zod";

const schema = z.object({
  subscription_id: z
    .string()
    .trim()
    .transform((value) => ((value?.length || 0) <= 0 ? undefined : value)),
  title: z.string().trim().min(1),
  body: z.string().trim().min(1),
  tags: z
    .string()
    .trim()
    .transform((value) => ((value?.length || 0) <= 0 ? undefined : value)),
});

export type FormData = z.output<typeof schema>;
export type PartialFormData = Partial<FormData>;
export type FormError = z.ZodFormattedError<z.infer<typeof schema>, string>;

export function safeParse(formData: FormData) {
  return schema.safeParse(formData);
}

export default schema;
