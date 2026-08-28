import { Module } from '@nestjs/common';
import { ToolkitController } from './toolkit.controller';
import { ToolkitService } from './toolkit.service';

@Module({
  controllers: [ToolkitController],
  providers: [ToolkitService]
})
export class ToolkitModule {}
