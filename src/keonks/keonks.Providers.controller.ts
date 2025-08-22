
import { Controller, Get, Post, Body } from '@nestjs/common';
import { KeonksService } from './keonks.service';
import { CreateKeonkDto } from './create-keonk.dto';
import { Keonk } from 'src/interfaces/keonk.interface';

@Controller('keonks')
export class KeonksController {
    constructor(private keonksService: KeonksService) { }

    @Post()
    async create(@Body() createKeonkDto: CreateKeonkDto) {
        this.keonksService.create(createKeonkDto);
    }

    @Get()
    async findAll(): Promise<Keonk[]> {
        return this.keonksService.findAll();
    }
}
