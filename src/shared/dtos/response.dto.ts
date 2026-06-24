import { createZodDto } from 'nestjs-zod';
import { MessageSchema } from '../models/response.model';

export class MessageResDTO extends createZodDto(MessageSchema) {}
