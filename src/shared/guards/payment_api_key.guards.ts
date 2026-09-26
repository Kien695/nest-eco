import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import envConfig from '../config';

@Injectable()
export class PaymentAPIKeyGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    // Node normalizes incoming header names to lowercase.
    const authorization = request.headers.authorization;
    const xAPIKey = authorization?.split(' ')[1];
    if (xAPIKey !== envConfig.PAYMENT_API_KEY) {
      throw new UnauthorizedException();
    }
    return true;
  }
}
