import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { KeonkController } from './keonk/keonk.controller';

@Module({
  imports: [],
  controllers: [AppController, KeonkController],
  providers: [AppService],
})
export class AppModule {}
