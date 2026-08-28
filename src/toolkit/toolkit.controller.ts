import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiProperty, ApiTags, ApiBody, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ToolkitService } from './toolkit.service';
import { ToolkitDto } from './dto/toolkit.dto';

@ApiTags('Toolkit')
@Controller('api/toolkit')
export class ToolkitController {
  constructor(private readonly toolkitService: ToolkitService) {}

  @Get()
  findAll() {
    return this.toolkitService.findAll();
  }

  @Get(':id')
  @ApiParam({ name: 'id', type: 'string' })
  findOne(@Param('id') id: string) {
    return this.toolkitService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  create(@Body() body: ToolkitDto) {
    let payload = body || {} as any;
    const data = {
      ...payload,
      orderIndex: payload.orderIndex ? parseInt(payload.orderIndex) : 0,
      items: payload.items ? (typeof payload.items === 'string' ? JSON.parse(payload.items) : payload.items) : [],
    };
    return this.toolkitService.create(data);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiParam({ name: 'id', type: 'string' })
  update(@Param('id') id: string, @Body() body: ToolkitDto) {
    let payload = body || {} as any;
    const data = {
      ...payload,
      ...(payload.orderIndex !== undefined && { orderIndex: parseInt(payload.orderIndex) }),
      ...(payload.items && { items: typeof payload.items === 'string' ? JSON.parse(payload.items) : payload.items }),
    };
    return this.toolkitService.update(id, data);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiParam({ name: 'id', type: 'string' })
  remove(@Param('id') id: string) {
    return this.toolkitService.remove(id);
  }
}

