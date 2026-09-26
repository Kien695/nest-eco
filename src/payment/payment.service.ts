import { Injectable } from '@nestjs/common';
import { PaymentRepo } from './payment.repo';
import { WebhookPaymentBodyType } from './payment.model';
import { PaymentProducer } from './payment.producer';
import { ChatGetware } from 'src/websockets/chat.getware';

@Injectable()
export class PaymentService {
  constructor(
    private readonly paymentRepo: PaymentRepo,
    private readonly paymentProducer: PaymentProducer,
    private readonly gateway: ChatGetware,
  ) {}
  async receiver(body: WebhookPaymentBodyType) {
    const result = await this.paymentRepo.receiver(body);
    if (!result.duplicate) {
      // External queue and socket side effects happen only after DB commit.
      await this.paymentProducer.removeJob(result.paymentId);
      this.gateway.paymentUpdated({
        paymentId: result.paymentId,
        orderIds: result.orderIds,
        userId: result.userId,
        status: 'SUCCESS',
      });
    }
    return { message: result.duplicate ? 'Transaction already processed' : 'Payment success' };
  }
}
