import { UnprocessableEntityException } from '@nestjs/common';

export const ProductTranslationAleardyExistException =
  new UnprocessableEntityException([
    {
      message: 'Error.ProductTranslationAlreadyExists',
      path: 'productId',
    },
  ]);
