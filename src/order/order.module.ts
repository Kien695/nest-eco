import { Module } from '@nestjs/common';
import { OrderRepo } from './order.repo';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { BullModule } from '@nestjs/bullmq';
import { PAYMENT_QUECE_NAME } from 'src/shared/constants/quece.constant';
import { OrderProducer } from './order.producer';
@Module({
  imports: [
    BullModule.registerQueue({
      name: PAYMENT_QUECE_NAME,
    }),
  ],
  controllers: [OrderController],
  providers: [OrderService, OrderRepo, OrderProducer],
})
export class OrderModule {}
