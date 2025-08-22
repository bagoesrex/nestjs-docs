import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
// import { KeonksController } from './keonks/keonks.Controllers.controller';
import { KeonksController } from './keonks/keonks.Providers.controller';
import { KeonksService } from './keonks/keonks.service';

@Module({
  imports: [],
  controllers: [AppController, KeonksController],
  providers: [AppService, KeonksService],
})
export class AppModule { }
