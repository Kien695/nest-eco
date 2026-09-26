import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';
import { InjectQueue } from '@nestjs/bullmq';
import {
  CANCEL_PAYMENT_JOB_NAME,
  PAYMENT_QUECE_NAME,
} from 'src/shared/constants/quece.constant';
import { generateCancelPaymentJobId } from 'src/shared/helper';

@Injectable()
export class OrderProducer {
  constructor(@InjectQueue(PAYMENT_QUECE_NAME) private paymentQueue: Queue) {}

  async cancelPayment(paymentId: number) {
    await this.paymentQueue.add(
      CANCEL_PAYMENT_JOB_NAME,
      {
        paymentId,
      },
      {
        delay: 1000 * 60 * 60 * 24,
        jobId: generateCancelPaymentJobId(paymentId),
        removeOnComplete: true,
        removeOnFail: true,
      }, // 24 h delayed
    );
  }
}
