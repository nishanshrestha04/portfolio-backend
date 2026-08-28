import { Controller, Get, Post, Put, Body, UseGuards } from '@nestjs/common';
import { ApiProperty, ApiTags, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ProfileService } from './profile.service';
import { ProfileDto } from './dto/profile.dto';

@ApiTags('Profile')
@Controller('api/profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get()
  getProfile() {
    return this.profileService.getProfile();
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  upsertProfile(@Body() body: ProfileDto) {
    return this.profileService.upsertProfile(body);
  }

  @Put()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  updateProfile(@Body() body: ProfileDto) {
    return this.profileService.upsertProfile(body);
  }
}

