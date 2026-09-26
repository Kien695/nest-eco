import { z } from 'zod';

export const PaymentTransactionSchema = z.object({
  id: z.number().int(),

  gateway: z.string().max(100),
  transactionDate: z.date(),
  accountNumber: z.string().max(100).nullable(),
  subAccount: z.string().max(250).nullable(),
  code: z.string().max(250).nullable(),
  amountIn: z.number().int(),
  amountOut: z.number().int(),
  accumulated: z.number().int(),
  transactionContent: z.string().nullable(),
  referenceNumber: z.string().max(255).nullable(),
  body: z.string().nullable(),
  createdAt: z.date(),
});

export const WebhookPaymentBodySchema = z.object({
  id: z.number(), // ID giao dịch trên SePay
  gateway: z.string(), // Brand name của ngân hàng
  transactionDate: z.string(), // Thời gian xảy ra giao dịch
  accountNumber: z.string().nullable(), // Số tài khoản ngân hàng
  code: z.string().nullable(), // Mã code thanh toán
  content: z.string().nullable(), // Nội dung chuyển khoản
  transferType: z.enum(['in', 'out']), // Loại giao dịch
  transferAmount: z.number(), // Số tiền giao dịch
  accumulated: z.number(), // Số dư tài khoản (lũy kế)
  subAccount: z.string().nullable(), // Tài khoản ngân hàng phụ
  referenceCode: z.string().nullable(), // Mã tham chiếu
  description: z.string(), // Toàn bộ nội dung tin nhắn SMS
});

export type PaymentTransactionType = z.infer<typeof PaymentTransactionSchema>;
export type WebhookPaymentBodyType = z.infer<typeof WebhookPaymentBodySchema>;
