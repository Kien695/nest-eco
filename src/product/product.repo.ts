import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/services/prisma.service';
import {
  CreateProductBodyType,
  GetProductDetailResType,
  GetProductsResType,
  ProductType,
  UpdateProductBodyType,
  VariantsSchema,
} from './product.model';
import { Prisma } from '@prisma/client';
import {
  ALL_LANGUAGE_CODE,
  OrderByType,
  SortBy,
  SortByType,
} from 'src/shared/constants/other.constant';

@Injectable()
export class ProductRepo {
  constructor(private readonly prismaService: PrismaService) {}
  async list({
    limit,
    page,
    name,
    brandIds,
    categories,
    minPrice,
    maxPrice,
    createdById,
    isPublic,
    languageId,
    orderBy,
    sortBy,
  }: {
    limit: number;
    page: number;
    name?: string;
    brandIds?: number[];
    categories?: number[];
    minPrice?: number;
    maxPrice?: number;
    createdById?: number;
    isPublic?: boolean;
    languageId: string;
    orderBy: OrderByType;
    sortBy: SortByType;
  }): Promise<GetProductsResType> {
    const skip = (page - 1) * limit;
    const take = limit;
    let where: Prisma.ProductWhereInput = {
      deletedAt: null,
      createdById: createdById ? createdById : undefined,
    };
    if (isPublic === true) {
      where.publishedAt = {
        lte: new Date(),
        not: null,
      };
    } else if (isPublic === false) {
      where = {
        ...where,
        OR: [{ publishedAt: null }, { publishedAt: { gt: new Date() } }],
      };
    }
    if (name) {
      where.name = {
        contains: name,
        mode: 'insensitive',
      };
    }
    if (brandIds && brandIds.length > 0) {
      where.brandId = {
        in: brandIds,
      };
    }
    if (categories && categories.length > 0) {
      where.categories = {
        some: {
          id: {
            in: categories,
          },
        },
      };
    }
    if (minPrice !== undefined || maxPrice !== undefined) {
      where.basePrice = {
        gte: minPrice,
        lte: maxPrice,
      };
    }
    let caculartedOrderBy:
      | Prisma.ProductOrderByWithRelationInput
      | Prisma.ProductOrderByWithRelationInput[] = {
      createdAt: orderBy,
    };
    if (sortBy === SortBy.Price) {
      caculartedOrderBy = {
        basePrice: orderBy,
      };
    } else if (sortBy === SortBy.Sale) {
      caculartedOrderBy = {
        orders: {
          _count: orderBy,
        },
      };
    }
    const [totalItems, data] = await Promise.all([
      this.prismaService.product.count({
        where,
      }),
      this.prismaService.product.findMany({
        where,
        include: {
          productTranslations: {
            where:
              languageId === ALL_LANGUAGE_CODE
                ? { deletedAt: null }
                : { languageId, deletedAt: null },
          },
          orders: {
            where: {
              deletedAt: null,
              status: 'DELIVERED',
            },
          },
        },
        orderBy: caculartedOrderBy,
        skip,
        take,
      }),
    ]);
    const parsedData = data.map((product) => ({
      ...product,
      variants: VariantsSchema.parse(product.variants),
    }));
    return {
      data: parsedData,
      totalItems,
      page: page,
      limit: limit,
      totalPages: Math.ceil(totalItems / limit),
    };
  }
  async findById(productId: number): Promise<ProductType | null> {
    const product = await this.prismaService.product.findUnique({
      where: {
        id: productId,
        deletedAt: null,
      },
    });

    if (!product) {
      return null;
    }

    return {
      ...product,
      variants: VariantsSchema.parse(product.variants),
    };
  }
  async getDetail({
    productId,
    languageId,
    isPublic,
  }: {
    productId: number;
    languageId: string;
    isPublic?: boolean;
  }): Promise<GetProductDetailResType | null> {
    let where: Prisma.ProductWhereUniqueInput = {
      id: productId,
      deletedAt: null,
    };
    if (isPublic === true) {
      where.publishedAt = {
        lte: new Date(),
        not: null,
      };
    } else if (isPublic === false) {
      where = {
        ...where,
        OR: [{ publishedAt: null }, { publishedAt: { gt: new Date() } }],
      };
    }
    const product = await this.prismaService.product.findUnique({
      where,
      include: {
        productTranslations: {
          where: languageId
            ? { languageId, deletedAt: null }
            : { deletedAt: null },
        },
        skus: {
          where: {
            deletedAt: null,
          },
        },
        brand: {
          include: {
            brandTranslations: {
              where: languageId
                ? { languageId, deletedAt: null }
                : { deletedAt: null },
            },
          },
        },
        categories: {
          where: {
            deletedAt: null,
          },
          include: {
            categoryTranslations: {
              where: languageId
                ? { languageId, deletedAt: null }
                : { deletedAt: null },
            },
          },
        },
      },
    });

    if (!product) {
      return null;
    }

    return {
      ...product,
      variants: VariantsSchema.parse(product.variants),
    };
  }
  async create({
    createdById,
    data,
  }: {
    createdById: number;
    data: CreateProductBodyType;
  }): Promise<GetProductDetailResType> {
    const { skus, categories, ...productData } = data;

    const product = await this.prismaService.product.create({
      data: {
        createdById,
        ...productData,
        categories: {
          connect: categories.map((categoryId) => ({
            id: categoryId,
          })),
        },
        skus: {
          createMany: {
            data: skus.map((sku) => ({
              ...sku,
              createdById,
            })),
          },
        },
      },
      include: {
        productTranslations: {
          where: {
            deletedAt: null,
          },
        },
        skus: {
          where: {
            deletedAt: null,
          },
        },
        brand: {
          include: {
            brandTranslations: {
              where: {
                deletedAt: null,
              },
            },
          },
        },
        categories: {
          where: {
            deletedAt: null,
          },
          include: {
            categoryTranslations: {
              where: {
                deletedAt: null,
              },
            },
          },
        },
      },
    });

    return {
      ...product,
      variants: VariantsSchema.parse(product.variants),
    };
  }

  async update({
    id,
    updatedById,
    data,
  }: {
    id: number;
    updatedById: number;
    data: UpdateProductBodyType;
  }) {
    const { skus: dataSkus, categories, ...productData } = data;
    //1. lấy ds SKU hiện tại trong db
    const existingSKUs = await this.prismaService.sKU.findMany({
      where: {
        productId: id,
        deletedAt: null,
      },
    });
    //2. Tìm các SKU cần xóa( tồn tại trong DB nhưng k có trong data payload)
    const skuToDelete = existingSKUs.filter((sku) =>
      dataSkus.every((dataSku) => dataSku.value !== sku.value),
    );
    const skuIds = skuToDelete.map((sku) => sku.id);

    //3. Mapping id vào trong data payload
    const skuWithId = dataSkus.map((dataSku) => {
      const existingSku = existingSKUs.find(
        (sku) => sku.value === dataSku.value,
      );
      return {
        ...dataSku,
        id: existingSku ? existingSku?.id : null,
      };
    });

    //4. Tìm các skus để cập nhật
    const skuToUpdate = skuWithId.filter((sku) => sku.id !== null);

    //5. Tìm các skus để thêm mới
    const skuToCreate = skuWithId
      .filter((sku) => sku.id === null)
      .map((sku) => {
        const { id: skuId, ...data } = sku;
        return {
          ...data,
          productId: id,
          createdById: updatedById,
        };
      });
    const [product] = await this.prismaService.$transaction([
      // cap nhat product
      this.prismaService.product.update({
        where: {
          id,
          deletedAt: null,
        },
        data: {
          ...productData,
          updatedById,
          categories: {
            connect: categories.map((category) => ({ id: category })),
          },
        },
      }),
      //xoa mem
      this.prismaService.sKU.updateMany({
        where: {
          id: { in: skuIds },
        },
        data: {
          updatedAt: new Date(),
          updatedById: updatedById,
        },
      }),
      //cap nhat sku co trong data payload
      ...skuToUpdate.map((sku) =>
        this.prismaService.sKU.update({
          where: {
            id: sku.id as number,
          },
          data: {
            value: sku.value,
            price: sku.price,
            stock: sku.stock,
            image: sku.image,
            updatedById,
          },
        }),
      ),
      //them moi cac sku khong co trong database
      this.prismaService.sKU.createMany({
        data: skuToCreate,
      }),
    ]);
    return product;
  }

  async delete(id: number, isHard?: Boolean): Promise<ProductType> {
    if (isHard) {
      const product = await this.prismaService.product.delete({
        where: {
          id,
        },
      });

      return {
        ...product,
        variants: VariantsSchema.parse(product.variants),
      };
    }
    const [product] = await Promise.all([
      this.prismaService.product.update({
        where: { id, deletedAt: null },
        data: {
          deletedAt: new Date(),
        },
      }),
      this.prismaService.productTranslation.updateMany({
        where: {
          productId: id,
          deletedAt: null,
        },
        data: {
          deletedAt: new Date(),
        },
      }),
      this.prismaService.sKU.updateMany({
        where: {
          productId: id,
          deletedAt: null,
        },
        data: {
          deletedAt: new Date(),
        },
      }),
    ]);
    return { ...product, variants: VariantsSchema.parse(product.variants) };
  }
}
