import { ForbiddenException, Injectable } from '@nestjs/common';
import { ProductRepo } from './product.repo';
import {
  CreateProductBodyType,
  GetManagerProductQueryType,
  UpdateProductBodyType,
} from './product.model';
import { I18nContext } from 'nestjs-i18n';
import { NotFoundRecordException } from 'src/shared/error';
import { isUniqueNotFoundError } from 'src/shared/helper';
import { roleName } from 'src/shared/constants/role.constant';
@Injectable()
export class ManageProductService {
  constructor(private productRepo: ProductRepo) {}
  //Kiểm tra nếu người dùng không phải người tạo sản phẩm or admin thì không cho tiếp tục
  validatePrivilege({
    userIdRequest,
    roleNameRequest,
    createdById,
  }: {
    userIdRequest: number;
    roleNameRequest: string;
    createdById: number | undefined | null;
  }) {
    if (userIdRequest !== createdById && roleNameRequest !== roleName.Admin) {
      throw new ForbiddenException();
    }
    return true;
  }
  async list(props: {
    query: GetManagerProductQueryType;
    userIdRequest: number;
    roleNameRequest: string;
  }) {
    this.validatePrivilege({
      userIdRequest: props.userIdRequest,
      roleNameRequest: props.roleNameRequest,
      createdById: props.query.createdById,
    });
    const data = await this.productRepo.list({
      page: props.query.page,
      limit: props.query.limit,
      languageId: I18nContext.current()?.lang as string,
      createdById: props.query.createdById,
      isPublic: props.query.isPublic,
      brandIds: props.query.brandIds,
      categories: props.query.categories,
      minPrice: props.query.minPrice,
      maxPrice: props.query.maxPrice,
      name: props.query.name,
      orderBy: props.query.orderBy,
      sortBy: props.query.sortBy,
    });
    return data;
  }
  async getDetail(props: {
    productId: number;
    userIdRequest: number;
    roleNameRequest: string;
  }) {
    const product = await this.productRepo.getDetail({
      productId: props.productId,
      languageId: I18nContext.current()?.lang as string,
    });
    if (!product) {
      throw NotFoundRecordException;
    }
    this.validatePrivilege({
      userIdRequest: props.userIdRequest,
      roleNameRequest: props.roleNameRequest,
      createdById: product.createdById,
    });
    return product;
  }

  create({
    data,
    createdById,
  }: {
    data: CreateProductBodyType;
    createdById: number;
  }) {
    return this.productRepo.create({
      createdById,
      data,
    });
  }
  async update({
    productId,
    data,
    updatedById,
    roleNameRequest,
  }: {
    productId: number;
    data: UpdateProductBodyType;
    updatedById: number;
    roleNameRequest: string;
  }) {
    const product = await this.productRepo.findById(productId);
    if (!product) {
      throw NotFoundRecordException;
    }
    this.validatePrivilege({
      userIdRequest: updatedById,
      roleNameRequest: roleNameRequest,
      createdById: product.createdById,
    });
    try {
      const updatedProduct = await this.productRepo.update({
        id: productId,
        updatedById,
        data,
      });
      return updatedProduct;
    } catch (error) {
      if (isUniqueNotFoundError(error)) {
        throw NotFoundRecordException;
      }
      throw error;
    }
  }
  async delete({
    productId,
    deletedById,
    roleNameRequest,
  }: {
    productId: number;
    deletedById: number;
    roleNameRequest: string;
  }) {
    const product = await this.productRepo.findById(productId);
    if (!product) {
      throw NotFoundRecordException;
    }
    this.validatePrivilege({
      userIdRequest: deletedById,
      roleNameRequest: roleNameRequest,
      createdById: product.createdById,
    });
    try {
      await this.productRepo.delete(productId);
      return {
        message: 'Delete successfully',
      };
    } catch (error) {
      if (isUniqueNotFoundError(error)) {
        throw NotFoundRecordException;
      }
      throw error;
    }
  }
}
