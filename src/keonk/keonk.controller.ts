import { Controller, Get, Req } from '@nestjs/common';
import { Request } from 'express';

@Controller('keonk')
export class KeonkController {
  @Get()
  findAll(@Req() request: Request): string {
    console.log(request.method);
    console.log(request.url);
    console.log(request.headers);
    return 'Keonk response';
  }
}
