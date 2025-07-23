import { Controller, Get, Post, Put, Delete, Req, Param } from '@nestjs/common';
import { Request } from 'express';

@Controller('keonk')
export class KeonkController {
    @Post()
    create(): string {
        return 'Membuat keonk baru';
    }

    @Put(':id')
    update(@Param('id') id: string): string {
        return `Keonk dengan ID ${id} telah diperbarui`;
    }

    @Delete(':id')
    remove(@Param('id') id: string): string {
        return `Keonk dengan ID ${id} telah dihapus`;
    }

    @Get()
    findAll(@Req() request: Request): string {
        console.log(request.method);
        console.log(request.url);
        console.log(request.headers);
        return 'Keonk response';
    }
}
