import z from 'zod';

export const MessageSchema = z.object({
  message: z.string(),
});
export type MessageResDTO = z.infer<typeof MessageSchema>;
