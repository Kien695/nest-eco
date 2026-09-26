import z from 'zod';

export const MessageSchema = z.object({
  message: z.string(),
});
export type MessageResType = z.infer<typeof MessageSchema>;
