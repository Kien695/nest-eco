import { Module } from '@nestjs/common';
import { PaymentController } from './payment.controller';
import { PaymentRepo } from './payment.repo';
import { PaymentService } from './payment.service';
import { PaymentProducer } from './payment.producer';
import { BullModule } from '@nestjs/bullmq';
import { PAYMENT_QUECE_NAME } from 'src/shared/constants/quece.constant';
import { WebsocketModule } from 'src/websockets/websocket.module';

@Module({
  imports: [
    BullModule.registerQueue({
      name: PAYMENT_QUECE_NAME,
    }),
    WebsocketModule,
  ],
  providers: [PaymentService, PaymentRepo, PaymentProducer],
  controllers: [PaymentController],
})
export class PaymentModule {}
