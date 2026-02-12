import { Controller, Get, Put, Body, Req, UseGuards } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UpdateUserDto } from '../users/dto/update-user.dto';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Profile')
@Controller('profile')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ProfileController {
  constructor(private profileService: ProfileService) {}

  @Get()
  async getProfile(@Req() req) {
    return req.user;
  }

  @Put()
  async updateProfile(@Req() req, @Body() dto: UpdateUserDto) {
    return this.profileService.updateProfile(req.user.id, dto);
  }
}
