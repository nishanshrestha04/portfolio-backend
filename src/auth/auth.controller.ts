import { Controller, Post, Body, Put, UseGuards, Request } from '@nestjs/common';
import { ApiProperty, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from './jwt-auth.guard';
import { UpdateCredentialsDto } from './dto/update-credentials.dto';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@ApiTags('Auth')
@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() body: LoginDto) {
    return this.authService.login(body.email, body.password);
  }

  @Put('update')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async updateCredentials(@Request() req: any, @Body() body: UpdateCredentialsDto) {
    return this.authService.updateCredentials(req.user.userId, body.email, body.password);
  }
}
