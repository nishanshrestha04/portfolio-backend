import { Controller, Get, Post, Body, Put, Param, Delete, UseInterceptors, UploadedFile, BadRequestException, UseGuards } from '@nestjs/common';
import { ApiProperty, ApiTags, ApiConsumes, ApiBody, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ProjectsService } from './projects.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { S3Service } from '../s3/s3.service';
import { ProjectDto } from './dto/project.dto';

@ApiTags('Projects')
@Controller('api/projects')
export class ProjectsController {
  constructor(
    private readonly projectsService: ProjectsService,
    private readonly s3Service: S3Service
  ) {}

  @Get()
  findAll() {
    return this.projectsService.findAll();
  }

  @Get(':id')
  @ApiParam({ name: 'id', type: 'string' })
  findOne(@Param('id') id: string) {
    return this.projectsService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('image'))
  async create(@Body() body: ProjectDto, @UploadedFile() file: Express.Multer.File) {
    body = body || {};
    let imageUrl = null;
    
    if (file) {
      imageUrl = await this.s3Service.uploadImage(file.buffer, file.originalname, file.mimetype);
    }
    
    // Parse JSON fields if they are sent as strings in form-data
    const data = {
      ...body,
      isFeatured: body.isFeatured === 'true',
      orderIndex: body.orderIndex ? parseInt(body.orderIndex) : 0,
      architecture: body.architecture ? JSON.parse(body.architecture) : [],
      technologies: body.technologies ? JSON.parse(body.technologies) : [],
      ...(imageUrl && { imageUrl }),
    };

    return this.projectsService.create(data);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiParam({ name: 'id', type: 'string' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('image'))
  async update(@Param('id') id: string, @Body() body: ProjectDto, @UploadedFile() file: Express.Multer.File) {
    body = body || {};
    let imageUrl = null;
    
    if (file) {
      imageUrl = await this.s3Service.uploadImage(file.buffer, file.originalname, file.mimetype);
    }
    
    const data = {
      ...body,
      ...(body.isFeatured !== undefined && { isFeatured: body.isFeatured === 'true' }),
      ...(body.orderIndex !== undefined && { orderIndex: parseInt(body.orderIndex) }),
      ...(body.architecture && { architecture: JSON.parse(body.architecture) }),
      ...(body.technologies && { technologies: JSON.parse(body.technologies) }),
      ...(imageUrl && { imageUrl }),
    };

    return this.projectsService.update(id, data);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiParam({ name: 'id', type: 'string' })
  remove(@Param('id') id: string) {
    return this.projectsService.remove(id);
  }
}
