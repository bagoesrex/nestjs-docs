import { Controller, Get, Post, Put, Delete, Req, Param, HttpCode, Header, Redirect, Query } from '@nestjs/common';
import { Request } from 'express';

@Controller('keonk')
export class KeonkController {
    @Post()
    @Header('Cache-Control', 'no-store')
    @HttpCode(202)
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

    @Get('abcd/*')
    handleWildcard(): string {
        return 'When Get abcd/keonk abcd/meonk abcd/miaw or abcd/* anythings';
    }

    @Get('portfolio')
    @Redirect('https://bagoes.dev', 301)
    redirectPortfolio(): void { }

    @Get('docs')
    @Redirect('https://docs.nestjs.com', 302)
    getDocs(@Query('version') version) {
        if (version && version === '5') {
            return { url: 'https://docs.nestjs.com/v5' };
        }
    }

    @Get(':id')
    findOne(@Param('id') id: string): string {
      return `This action returns a #${id} keonk`;
    }
}