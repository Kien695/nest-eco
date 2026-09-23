import { Injectable } from '@nestjs/common';
import { OrderRepo } from './order.repo';
import { OrderStatusType } from 'src/shared/constants/order.constant';
import {
  CreateOrderBodyType,
  GetOrderListQueryType,
  GetOrderListResType,
} from './order.model';

@Injectable()
export class OrderService {
  constructor(private orderRepo: OrderRepo) {}
  async list(
    userId: number,

    query: GetOrderListQueryType,
  ): Promise<GetOrderListResType> {
    return this.orderRepo.list(userId, query);
  }
  async create(userId: number, body: CreateOrderBodyType) {
    return this.orderRepo.create(userId, body);
  }
  cancel(userId: number, orderId: number) {
    return this.orderRepo.cancel(userId, orderId);
  }

  detail(userId: number, orderId: number) {
    return this.orderRepo.detail(userId, orderId);
  }
}
