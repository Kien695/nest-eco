import { Injectable } from '@nestjs/common';
import {
  OrderStatus,
  OrderStatusType,
} from 'src/shared/constants/order.constant';
import { PrismaService } from 'src/shared/services/prisma.service';
import {
  CancelOrderResType,
  CreateOrderBodyType,
  CreateOrderResSchema,
  CreateOrderResType,
  GetOrderDetailResSchema,
  GetOrderDetailResType,
  GetOrderListQueryType,
  GetOrderListResSchema,
  GetOrderListResType,
} from './order.model';
import { Prisma } from '@prisma/client';
import {
  NotFoundCartItemException,
  OrderNotFoundException,
  OutOfStockSKUException,
  ProductNotFoundException,
  SKUNotBelongToShopException,
} from './order.error';
import { isUniqueNotFoundError } from 'src/shared/helper';
import { PaymentStatus } from 'src/shared/constants/payment.contstant';
import { OrderProducer } from './order.producer';

@Injectable()
export class OrderRepo {
  constructor(
    private readonly prismaService: PrismaService,
    private orderProducer: OrderProducer,
  ) {}
  async list(
    userId: number,
    query: GetOrderListQueryType,
  ): Promise<GetOrderListResType> {
    const { page, limit, status } = query;
    const skip = (page - 1) * limit;
    const take = limit;
    const where: Prisma.OrderWhereInput = {
      userId,
      status,
    };
    const totalItem$ = this.prismaService.order.count({
      where,
    });
    const data$ = this.prismaService.order.findMany({
      where,
      include: { items: true },
      skip,
      take,
      orderBy: {
        createdAt: 'desc',
      },
    });
    const [data, totalItems] = await Promise.all([data$, totalItem$]);
    return GetOrderListResSchema.parse({
      data,
      page,
      limit,
      totalItems,
      totalPages: Math.ceil(totalItems / limit),
    });
  }
  async create(
    userId: number,
    body: CreateOrderBodyType,
  ): Promise<{ paymentId: number; orders: CreateOrderResType['data'] }> {
    const allBodyCartItemIds = body.map((item) => item.cartItemIds).flat();
    const cartItems = await this.prismaService.cartItem.findMany({
      where: {
        id: { in: allBodyCartItemIds },
        userId,
      },
      include: {
        sku: {
          include: {
            product: {
              include: { productTranslations: true },
            },
          },
        },
      },
    });
    //1. ktra cartItemIds có tồn tại trong csdl không
    if (cartItems.length !== allBodyCartItemIds.length) {
      throw NotFoundCartItemException;
    }
    //2. Ktra số lượng mua có lớn hơn số lượng tồn
    const isOutOfStock = cartItems.some(
      (item) => item.sku.stock < item.quantity,
    );
    if (isOutOfStock) {
      throw OutOfStockSKUException;
    } //3. Ktra tất cả sản phẩm mua có sp nào bị xóa hay ẩn k
    const isExistNotReadyProduct = cartItems.some(
      (item) =>
        item.sku.product.deletedAt !== null ||
        item.sku.product.publishedAt === null ||
        item.sku.product.publishedAt > new Date(),
    );
    if (isExistNotReadyProduct) {
      throw ProductNotFoundException;
    }

    //4. Ktra các skuId trong cartItems gửi lên có thuộc về shopId gửi lên không
    const cartItemMap = new Map<number, (typeof cartItems)[0]>();
    cartItems.forEach((item) => {
      cartItemMap.set(item.id, item);
    });
    const isValidShop = body.every((item) => {
      const bodyCartItemIds = item.cartItemIds;
      return bodyCartItemIds.every((cartItemId) => {
        const cartItem = cartItemMap.get(cartItemId)!;
        return item.shopId === cartItem.sku.createdById;
      });
    });
    if (!isValidShop) {
      throw SKUNotBelongToShopException;
    }

    //5. tạo order
    const [paymentId, orders] = await this.prismaService.$transaction(
      async (tx) => {
        const payment = await tx.payment.create({
          data: { status: PaymentStatus.PENDING },
        });
        const orders$ = Promise.all(
          body.map((item) =>
            tx.order.create({
              data: {
                userId,
                status: OrderStatus.PENDING_PAYMENT,
                receiver: item.receiver,
                createdById: userId,
                shopId: item.shopId,
                paymentId: payment.id,
                items: {
                  create: item.cartItemIds.map((cartItemId) => {
                    const cartItem = cartItemMap.get(cartItemId)!;
                    return {
                      productName: cartItem.sku.product.name,
                      skuPrice: cartItem.sku.price,
                      images: cartItem.sku.image,
                      skuId: cartItem.sku.id,
                      skuValue: cartItem.sku.value,
                      quantity: cartItem.quantity,
                      productId: cartItem.sku.product.id,
                      productTranslations:
                        cartItem.sku.product.productTranslations.map(
                          (translation) => {
                            return {
                              id: translation.id,
                              name: translation.name,
                              description: translation.description,
                              languageId: translation.languageId,
                            };
                          },
                        ),
                    };
                  }),
                },
                products: {
                  connect: item.cartItemIds.map((cartItemId) => {
                    const cartItem = cartItemMap.get(cartItemId)!;
                    return {
                      id: cartItem.sku.product.id,
                    };
                  }),
                },
              },
            }),
          ),
        );
        const cartItem$ = tx.cartItem.deleteMany({
          where: {
            id: {
              in: allBodyCartItemIds,
            },
          },
        });

        const sku$ = Promise.all(
          cartItems.map((item) => {
            return tx.sKU.update({
              where: {
                id: item.sku.id,
              },
              data: {
                stock: {
                  decrement: item.quantity,
                },
              },
            });
          }),
        );
        const addCancelPaymentJob$ = this.orderProducer.cancelPayment(
          payment.id,
        );
        const [orders] = await Promise.all([
          orders$,
          cartItem$,
          sku$,
          addCancelPaymentJob$,
        ]);
        return [payment.id, orders] as const;
      },
    );
    return {
      paymentId,
      orders: CreateOrderResSchema.parse({ data: orders }).data,
    };
  }

  async detail(
    userId: number,
    orderId: number,
  ): Promise<GetOrderDetailResType> {
    const order = await this.prismaService.order.findUnique({
      where: {
        id: orderId,
        userId,
        deletedAt: null,
      },
      include: {
        items: true,
      },
    });
    if (!order) {
      throw OrderNotFoundException;
    }
    return GetOrderDetailResSchema.parse(order);
  }

  async cancel(userId: number, orderId: number): Promise<CancelOrderResType> {
    try {
      const order = await this.prismaService.order.update({
        where: {
          id: orderId,
          userId,
          deletedAt: null,
        },
        data: {
          status: OrderStatus.CANCELLED,
          updatedById: userId,
        },
      });
      return GetOrderDetailResSchema.parse(order);
    } catch (error) {
      if (isUniqueNotFoundError(error)) {
        throw OrderNotFoundException;
      }
      throw error;
    }
  }
}
