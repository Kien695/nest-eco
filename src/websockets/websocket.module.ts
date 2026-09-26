import { Module } from '@nestjs/common';
import { ChatGetware } from './chat.getware';

@Module({
  providers: [ChatGetware],
  exports: [ChatGetware],
})
export class WebsocketModule {}
