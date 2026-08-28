import { Controller, Get, Param, Res } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AppService } from './app.service';
import { S3Service } from './s3/s3.service';

@ApiTags('System')
@Controller('api')
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly s3Service: S3Service
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('health')
  @ApiOperation({ summary: 'Check API health status' })
  checkHealth() {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }

  @Get('images/:key')
  @ApiOperation({ summary: 'Get a signed URL and redirect' })
  async getImage(@Param('key') key: string, @Res() res: any) {
    try {
      const url = await this.s3Service.getSignedUrl(key);
      res.redirect(302, url);
    } catch (err) {
      res.status(404).send('Image not found');
    }
  }
}
