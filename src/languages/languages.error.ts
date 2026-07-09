import { UnprocessableEntityException } from '@nestjs/common';

export const languagesAleadyExistsException = new UnprocessableEntityException({
  message: 'Error.LanguagesAlreadyExists',
  path: 'id',
});
