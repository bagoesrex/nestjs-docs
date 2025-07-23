import { Test, TestingModule } from '@nestjs/testing';
import { KeonkController } from './keonk.controller';

describe('KeonkController', () => {
  let controller: KeonkController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [KeonkController],
    }).compile();

    controller = module.get<KeonkController>(KeonkController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
