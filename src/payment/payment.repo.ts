import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/services/prisma.service';
import { WebhookPaymentBodyType } from './payment.model';
import { MessageResType } from 'src/shared/models/response.model';
import { parse } from 'date-fns';
import { PREFIX_PAYMENT_CODE } from 'src/shared/constants/other.constant';

import { OrderStatus } from 'src/shared/constants/order.constant';
import { PaymentStatus } from 'src/shared/constants/payment.contstant';
import { Prisma } from '@prisma/client';
@Injectable()
export class PaymentRepo {
  constructor(
    private readonly prismaService: PrismaService,
  ) {}
  private getTotalPrice(
    orders: Array<{
      items: Array<{
        skuPrice: number;
        quantity: number;
      }>;
    }>,
  ): number {
    return orders.reduce((total, order) => {
      const orderTotal = order.items.reduce((totalPrice, productSku) => {
        return totalPrice + productSku.skuPrice * productSku.quantity;
      }, 0);

      return total + orderTotal;
    }, 0);
  }
  async receiver(body: WebhookPaymentBodyType): Promise<{
    paymentId: number;
    orderIds: number[];
    userId: number;
    duplicate: boolean;
  }> {
    let amountIn = 0;
    let amountOut = 0;
    if (body.transferType === 'in') {
      amountIn = body.transferAmount;
    } else if (body.transferType === 'out') {
      amountOut = body.transferAmount;
    }
    const paymentTransaction =
      await this.prismaService.paymentTransaction.findUnique({
        where: {
          id: body.id,
        },
      });
    if (paymentTransaction) {
      return { paymentId: 0, orderIds: [], userId: 0, duplicate: true };
    }
    try {
      return await this.prismaService.$transaction(async (tx) => {
      await tx.paymentTransaction.create({
        data: {
          id: body.id,
          gateway: body.gateway,
          transactionDate: parse(
            body.transactionDate,
            'yyyy-MM-dd HH:mm:ss',
            new Date(),
          ),
          accountNumber: body.accountNumber,
          subAccount: body.subAccount,
          amountIn,
          amountOut,
          accumulated: body.accumulated,
          code: body.code,
          transactionContent: body.content,
          referenceNumber: body.referenceCode,
          body: body.description,
        },
      });
      //2. Ktra nd chuyển khoảng và tổng tiền có khớp hay không
      const paymentId = body.code
        ? Number(body.code.split(PREFIX_PAYMENT_CODE)[1])
        : Number(body.content?.split(PREFIX_PAYMENT_CODE)[1]);
      if (isNaN(paymentId)) {
        throw new BadRequestException('Không thể lấy paymentId từ content');
      }
      const payment = await tx.payment.findUnique({
        where: {
          id: paymentId,
        },
        include: {
          orders: {
            include: {
              items: true,
            },
          },
        },
      });
      if (!payment) {
        throw new BadRequestException('Payment không tồn tại!');
      }
      if (payment.status === PaymentStatus.SUCCESS) {
        return {
          paymentId,
          orderIds: payment.orders.map((order) => order.id),
          userId: payment.orders[0]?.userId ?? 0,
          duplicate: true,
        };
      }
      const { orders } = payment;
      const totalPrice = this.getTotalPrice(orders);
      if (totalPrice !== body.transferAmount) {
        throw new BadRequestException('Giá không đúng!');
      }

      //3. Cập nhật trạng thái đơn hàng

      await Promise.all([
        tx.payment.update({
          where: {
            id: paymentId,
          },
          data: {
            status: PaymentStatus.SUCCESS,
          },
        }),
        tx.order.updateMany({
          where: {
            id: {
              in: orders.map((order) => order.id),
            },
          },
          data: {
            status: OrderStatus.PENDING_PICKUP,
          },
        }),
      ]);
      return {
        paymentId,
        orderIds: orders.map((order) => order.id),
        userId: orders[0]?.userId ?? 0,
        duplicate: false,
      };
      });
    } catch (error) {
      // Concurrent retries of the same SePay transaction are idempotent.
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        return { paymentId: 0, orderIds: [], userId: 0, duplicate: true };
      }
      throw error;
    }
  }
}
