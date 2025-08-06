import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { KeonksController } from './keonks/keonk.controller';

@Module({
  imports: [],
  controllers: [AppController, KeonksController],
  providers: [AppService],
})
export class AppModule {}
