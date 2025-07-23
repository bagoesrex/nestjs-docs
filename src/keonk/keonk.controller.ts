import { Controller, Get } from '@nestjs/common';

@Controller('keonk')
export class KeonkController {
    @Get()
    findAll(): string {
      return 'Keonk response';
    }
}
