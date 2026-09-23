import { createZodDto } from 'nestjs-zod';
import {
  CreateProductBodySchema,
  GetManagerProductsQuerySchema,
  GetProductDetailResSchema,
  GetProductParamsSchema,
  GetProductsQuerySchema,
  GetProductSResSchema,
  UpdateProductBodySchema,
} from './product.model';
import { ProductsSchema } from 'src/shared/models/shared-product.model';

export class ProductDTO extends createZodDto(ProductsSchema) {}
export class GetProductResDTO extends createZodDto(GetProductSResSchema) {}
export class GetProductQueryDTO extends createZodDto(GetProductsQuerySchema) {}
export class GetManagerProductQueryDTO extends createZodDto(
  GetManagerProductsQuerySchema,
) {}
export class GetProductParamsDTO extends createZodDto(GetProductParamsSchema) {}
export class UpdateProductBodyDTO extends createZodDto(
  GetProductDetailResSchema,
) {}

export class CreateProductBodyDTO extends createZodDto(
  CreateProductBodySchema,
) {}
export class GetProductDetailResDTO extends createZodDto(
  UpdateProductBodySchema,
) {}
