import { Test, TestingModule } from '@nestjs/testing';
import { KeonksController } from './keonks.Controllers.controller';

describe('KeonkController', () => {
  let controller: KeonksController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [KeonksController],
    }).compile();

    controller = module.get<KeonksController>(KeonksController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
