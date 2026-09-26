import { Body, Controller, Post } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { ZodSerializerDto } from 'nestjs-zod';
import { Auth, isPublic } from 'src/shared/decorators/auth.decorators';
import { WebhookPaymentBodyDTO } from './payment.dto';
import { MessageResDTO } from 'src/shared/dtos/response.dto';

@Controller('payment')
export class PaymentController {
  constructor(private paymentService: PaymentService) {}

  @Post('/receive')
  @ZodSerializerDto(MessageResDTO)
  @Auth(['PaymentAPIKey'])
  receive(@Body() body: WebhookPaymentBodyDTO) {
    return this.paymentService.receiver(body);
  }
}
