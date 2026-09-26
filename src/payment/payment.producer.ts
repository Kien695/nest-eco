import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';
import { InjectQueue } from '@nestjs/bullmq';
import { PAYMENT_QUECE_NAME } from 'src/shared/constants/quece.constant';
import { generateCancelPaymentJobId } from 'src/shared/helper';

@Injectable()
export class PaymentProducer {
  constructor(@InjectQueue(PAYMENT_QUECE_NAME) private paymentQueue: Queue) {}

  removeJob(paymentId: number) {
    return this.paymentQueue.remove(generateCancelPaymentJobId(paymentId));
  }
}
