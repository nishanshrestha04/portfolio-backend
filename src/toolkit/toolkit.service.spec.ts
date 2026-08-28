import { Test, TestingModule } from '@nestjs/testing';
import { ToolkitService } from './toolkit.service';

describe('ToolkitService', () => {
  let service: ToolkitService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ToolkitService],
    }).compile();

    service = module.get<ToolkitService>(ToolkitService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
