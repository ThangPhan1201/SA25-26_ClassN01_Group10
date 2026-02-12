import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { UpdateUserDto } from '../users/dto/update-user.dto';

@Injectable()
export class ProfileService {
  constructor(private usersService: UsersService) {}

  async getProfile(userId: string) {
    return this.usersService.findOne(userId);
  }

  async updateProfile(userId: string, dto: UpdateUserDto) {
    return this.usersService.update(userId, dto);
  }
}
