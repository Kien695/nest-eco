import { Module } from '@nestjs/common';
import { OrderRepo } from './order.repo';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';

@Module({
  controllers: [OrderController],
  providers: [OrderService, OrderRepo],
})
export class OrderModule {}
