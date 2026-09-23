import { BadRequestException, NotFoundException } from '@nestjs/common';

export const NotFoundSKUException = new NotFoundException('Error.SKU.NotFound');
export const OutOfStockSKUException = new BadRequestException(
  'Error.SKU.OutOfStock',
);
export const ProductNotFoundException = new NotFoundException(
  'Error.product.NotFound',
);
export const IsValidQuantityException = new BadRequestException(
  'Error.cartItem.InvalidQuantity',
);
