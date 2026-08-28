import { Controller, Get, Post, Body, Put, Param, Delete, UseInterceptors, UploadedFile, UseGuards } from '@nestjs/common';
import { ApiProperty, ApiTags, ApiConsumes, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ArticlesService } from './articles.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { S3Service } from '../s3/s3.service';
import { ArticleDto } from './dto/article.dto';

@ApiTags('Articles')
@Controller('api/articles')
export class ArticlesController {
  constructor(
    private readonly articlesService: ArticlesService,
    private readonly s3Service: S3Service
  ) {}

  @Get()
  findAll() {
    return this.articlesService.findAll();
  }

  @Get(':id')
  @ApiParam({ name: 'id', type: 'string' })
  findOne(@Param('id') id: string) {
    return this.articlesService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('image'))
  async create(@Body() body: ArticleDto, @UploadedFile() file: Express.Multer.File) {
    body = body || {};
    let imageUrl = null;
    if (file) {
      imageUrl = await this.s3Service.uploadImage(file.buffer, file.originalname, file.mimetype);
    }
    const data = {
      ...body,
      orderIndex: body.orderIndex ? parseInt(body.orderIndex) : 0,
      tags: body.tags ? JSON.parse(body.tags) : [],
      ...(imageUrl && { imageUrl }),
    };
    return this.articlesService.create(data);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiParam({ name: 'id', type: 'string' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('image'))
  async update(@Param('id') id: string, @Body() body: ArticleDto, @UploadedFile() file: Express.Multer.File) {
    body = body || {};
    let imageUrl = null;
    if (file) {
      imageUrl = await this.s3Service.uploadImage(file.buffer, file.originalname, file.mimetype);
    }
    const data = {
      ...body,
      ...(body.orderIndex !== undefined && { orderIndex: parseInt(body.orderIndex) }),
      ...(body.tags && { tags: JSON.parse(body.tags) }),
      ...(imageUrl && { imageUrl }),
    };
    return this.articlesService.update(id, data);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiParam({ name: 'id', type: 'string' })
  remove(@Param('id') id: string) {
    return this.articlesService.remove(id);
  }
}
