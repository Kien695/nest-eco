import { Module } from '@nestjs/common';
import { CartRepo } from './cart.repo';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';

@Module({
  providers: [CartService, CartRepo],
  controllers: [CartController],
})
export class CartModule {}
