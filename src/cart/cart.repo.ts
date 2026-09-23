import { Injectable } from '@nestjs/common';
import { SKUSchemaType } from 'src/shared/models/shared-sku.model';
import { PrismaService } from 'src/shared/services/prisma.service';
import {
  IsValidQuantityException,
  NotFoundSKUException,
  OutOfStockSKUException,
  ProductNotFoundException,
} from './cart.error';
import {
  AddToCartBodyType,
  CartItemDetailType,
  CartItemType,
  DeleteCartBodyType,
  GetCartResType,
  UpdateCartItemBodyType,
} from './cart.model';
import { ALL_LANGUAGE_CODE } from 'src/shared/constants/other.constant';
import { VariantsSchema } from 'src/shared/models/shared-product.model';
import { Prisma } from '@prisma/client';
import { NotFoundCartItemException } from 'src/order/order.error';

@Injectable()
export class CartRepo {
  constructor(private readonly prismaService: PrismaService) {}
  private async validateSKU({
    skuId,
    quantity,
    userId,
    isCreate,
  }: {
    skuId: number;
    quantity: number;
    userId: number;
    isCreate: Boolean;
  }): Promise<SKUSchemaType> {
    const [cartItems, sku] = await Promise.all([
      this.prismaService.cartItem.findUnique({
        where: {
          skuId_userId: {
            userId,
            skuId,
          },
        },
      }),
      this.prismaService.sKU.findUnique({
        where: { id: skuId, deletedAt: null },
        include: {
          product: true,
        },
      }),
    ]);

    if (!sku) {
      throw NotFoundSKUException;
    }
    if (!cartItems) {
      throw NotFoundCartItemException;
    }
    if (isCreate && quantity + cartItems.quantity > sku.stock) {
      throw IsValidQuantityException;
    }
    if (sku.stock < 1 || sku.stock < quantity) {
      throw OutOfStockSKUException;
    }
    const { product } = sku;

    //kiểm tra sản phẩm đã bị xóa hoặc có công khai không
    if (
      product.deletedAt !== null ||
      product.publishedAt === null ||
      product.publishedAt > new Date()
    ) {
      throw ProductNotFoundException;
    }
    return sku;
  }
  async list({
    userId,
    languageId,
    page,
    limit,
  }: {
    userId: number;
    languageId: string;
    page: number;
    limit: number;
  }): Promise<GetCartResType> {
    const cartItems = await this.prismaService.cartItem.findMany({
      where: {
        userId,
        sku: {
          product: {
            deletedAt: null,
            publishedAt: { lte: new Date(), not: null },
          },
        },
      },
      include: {
        sku: {
          include: {
            product: {
              include: {
                productTranslations: {
                  where:
                    languageId === ALL_LANGUAGE_CODE
                      ? { deletedAt: null }
                      : { languageId, deletedAt: null },
                },
                createdBy: true,
              },
            },
          },
        },
      },

      orderBy: {
        updatedAt: 'desc',
      },
    });
    const groupMap = new Map<number, CartItemDetailType>();
    for (const cartItem of cartItems) {
      const shopId = cartItem.sku.product.createdById;
      const parsedCartItem = {
        ...cartItem,
        sku: {
          ...cartItem.sku,
          product: {
            ...cartItem.sku.product,
            variants: VariantsSchema.parse(cartItem.sku.product.variants),
          },
        },
      };
      if (!groupMap.has(shopId)) {
        groupMap.set(shopId, {
          shop: cartItem.sku.product.createdBy,
          cartItems: [],
        });
      }
      groupMap.get(shopId)!.cartItems.push(parsedCartItem);
    }

    const sortedGroups = Array.from(groupMap.values());
    const skip = (page - 1) * limit;
    const take = limit;
    const totalGroup = sortedGroups.length;
    const pagedGroups = sortedGroups.slice(skip, skip + take);
    return {
      data: pagedGroups,
      totalItems: totalGroup,
      limit,
      page,
      totalPages: Math.ceil(totalGroup / limit),
    };
  }
  //nếu nhiều data thì dùng list2
  async list2({
    userId,
    languageId,
    page,
    limit,
  }: {
    userId: number;
    languageId: string;
    page: number;
    limit: number;
  }): Promise<GetCartResType> {
    const skip = (page - 1) * limit;
    const take = limit;
    //count total product
    const totalItems$ = this.prismaService.$queryRaw<{ createdById: number }[]>`
      select "Product"."createdById" from "CartItem"
      join "SKU" on "CartItem"."skuId"="SKU"."id"
      join "Product" on "SKU"."productId"="Product"."id"
      where "CartItem"."userId"=${userId}
      and "Product"."deletedAt" is NULL
      and "Product"."publishedAt" is Not null
      and "Product"."publishedAt" <= NOW()
      group by "Product"."createdById"
    `;
    const data$ = await this.prismaService.$queryRaw<CartItemDetailType[]>`
      select "Product"."createdById",
      json_agg(
        jsonb_build_object(
          "id","CartItem"."id",
          "quantity","CartItem"."quantity",
          "skuId","CartItem"."skuId",
          "userId","CartItem"."userId",
          "createdAt","CartItem"."createdAt",
          "updatedAt","CartItem"."updatedAt",
          "sku",jsonb_build_object(
            "id","SKU"."id",
            "value","SKU"."value",
            "price","SKU"."price",
            "stock","SKU"."stock",
            "image","SKU"."image",
            "productId","SKU"."productId",
          'product', jsonb_build_object(
                'id', "Product"."id",
                'publishedAt', "Product"."publishedAt",
                'name', "Product"."name",
                'basePrice', "Product"."basePrice",
                'virtualPrice', "Product"."virtualPrice",
                'brandId', "Product"."brandId",
                'images', "Product"."images",
                'variants', "Product"."variants",
                'productTranslations', COALESCE(
                    (
                        SELECT json_agg(
                            jsonb_build_object(
                                'id', pt."id",
                                'productId', pt."productId",
                                'languageId', pt."languageId",
                                'name', pt."name",
                                'description', pt."description"
                            )
                        ) FILTER (WHERE pt."id" IS NOT NULL)
                        from "ProductTranslation" pt
                        where pt."productId"="Product"."id"
                        and pt."deletedAt" is null
                        ${languageId === ALL_LANGUAGE_CODE ? Prisma.sql`` : Prisma.sql`and pt."languageId"=${languageId}`}
                    ),'[]'::JSON)
                )
            )
          ) order by "CartItem"."updatedAt" desc
        ) as "cartItems",
        jsonb_build_object(
          'id', "User"."id",
          'name', "User"."name",
          'avatar', "User"."avatar"
        ) AS "shop"
        FROM "CartItem"
        JOIN "SKU" ON "CartItem"."skuId" = "SKU"."id"
        JOIN "Product" ON "SKU"."productId" = "Product"."id"
        LEFT JOIN "ProductTranslation"
          ON "Product"."id" = "ProductTranslation"."productId"
          AND "ProductTranslation"."deletedAt" IS NULL
          ${languageId === ALL_LANGUAGE_CODE ? Prisma.sql`` : Prisma.sql`AND "ProductTranslation"."languageId" = ${languageId}`}
        LEFT JOIN "User" ON "Product"."createdById" = "User"."id"
        WHERE "CartItem"."userId" = ${userId}
          AND "Product"."deletedAt" IS NULL
          AND "Product"."publishedAt" IS NOT NULL
          AND "Product"."publishedAt" <= NOW()
        GROUP BY "Product"."createdById", "User"."id"
        ORDER BY MAX("CartItem"."updatedAt") DESC
        limit ${take}
        offset ${skip}
            
    `;
    const [data, totalItems] = await Promise.all([data$, totalItems$]);
    return {
      data,
      page,
      limit,
      totalItems: totalItems.length,
      totalPages: Math.ceil(totalItems.length / limit),
    };
  }

  async create(userId: number, body: AddToCartBodyType): Promise<CartItemType> {
    await this.validateSKU({
      skuId: body.skuId,
      quantity: body.quantity,
      userId,
      isCreate: true,
    });
    return this.prismaService.cartItem.upsert({
      where: {
        skuId_userId: {
          userId,
          skuId: body.skuId,
        },
      },
      update: {
        quantity: {
          increment: body.quantity,
        },
      },
      create: {
        userId,
        skuId: body.skuId,
        quantity: body.quantity,
      },
    });
  }

  async update(
    userId: number,
    cartItemId: number,
    body: UpdateCartItemBodyType,
  ): Promise<CartItemType> {
    await this.validateSKU({
      skuId: body.skuId,
      quantity: body.quantity,
      userId,
      isCreate: false,
    });
    return this.prismaService.cartItem.update({
      where: {
        id: cartItemId,
        userId,
      },
      data: {
        skuId: body.skuId,
        quantity: body.quantity,
      },
    });
  }

  delete(userId: number, body: DeleteCartBodyType): Promise<{ count: number }> {
    return this.prismaService.cartItem.deleteMany({
      where: {
        id: {
          in: body.cartItemIds,
        },
        userId,
      },
    });
  }
}
