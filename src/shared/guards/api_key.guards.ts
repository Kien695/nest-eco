import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import envConfig from '../config';

@Injectable()
export class APIGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const xAPIKey = request.headers['x-api-key'];
    if (xAPIKey !== envConfig.SECRET_API_KEY) {
      throw new UnauthorizedException();
    }
    return true;
  }
}
