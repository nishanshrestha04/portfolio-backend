import { Controller, Get, Post, Body, Put, Param, Delete, UseInterceptors, UploadedFile, UseGuards } from '@nestjs/common';
import { ApiProperty, ApiTags, ApiConsumes, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ExperiencesService } from './experiences.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { S3Service } from '../s3/s3.service';
import { ExperienceDto } from './dto/experience.dto';

@ApiTags('Experiences')
@Controller('api/experiences')
export class ExperiencesController {
  constructor(
    private readonly experiencesService: ExperiencesService,
    private readonly s3Service: S3Service
  ) {}

  @Get()
  findAll() {
    return this.experiencesService.findAll();
  }

  @Get(':id')
  @ApiParam({ name: 'id', type: 'string' })
  findOne(@Param('id') id: string) {
    return this.experiencesService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('logo'))
  async create(@Body() body: ExperienceDto, @UploadedFile() file: Express.Multer.File) {
    body = body || {};
    let logoUrl = null;
    if (file) {
      logoUrl = await this.s3Service.uploadImage(file.buffer, file.originalname, file.mimetype);
    }
    
    const data = {
      ...body,
      orderIndex: body.orderIndex ? parseInt(body.orderIndex) : 0,
      description: body.description ? JSON.parse(body.description) : [],
      ...(logoUrl && { logoUrl }),
    };

    return this.experiencesService.create(data);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiParam({ name: 'id', type: 'string' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('logo'))
  async update(@Param('id') id: string, @Body() body: ExperienceDto, @UploadedFile() file: Express.Multer.File) {
    body = body || {};
    let logoUrl = null;
    if (file) {
      logoUrl = await this.s3Service.uploadImage(file.buffer, file.originalname, file.mimetype);
    }
    
    const data = {
      ...body,
      ...(body.orderIndex !== undefined && { orderIndex: parseInt(body.orderIndex) }),
      ...(body.description && { description: JSON.parse(body.description) }),
      ...(logoUrl && { logoUrl }),
    };

    return this.experiencesService.update(id, data);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiParam({ name: 'id', type: 'string' })
  remove(@Param('id') id: string) {
    return this.experiencesService.remove(id);
  }
}
