import { Injectable } from '@nestjs/common';
import { Keonk } from 'src/interfaces/keonk.interface';

@Injectable()
export class KeonksService {
    private readonly keonks: Keonk[] = [];

    create(keonk: Keonk) {
        this.keonks.push(keonk);
    }

    findAll(): Keonk[] {
        return this.keonks;
    }
}
