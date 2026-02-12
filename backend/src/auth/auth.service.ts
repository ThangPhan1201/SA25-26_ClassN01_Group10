// src/auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { DoctorsService } from '../doctors/doctors.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly doctorsService: DoctorsService,
  ) {}

  async validateUser(username: string, password: string) {
    const user = await this.usersService.findByUsername(username);

    if (!user) {
      throw new UnauthorizedException('Username không tồn tại');
    }

    // --- CHỐT CHẶN TRẠNG THÁI TÀI KHOẢN ---
    // Nếu tài khoản đã bị set is_active = false trong DoctorsService, chặn ở đây.
    if (user.is_active === false) {
      throw new UnauthorizedException(
        'Tài khoản của bạn đã bị vô hiệu hóa hoặc bị khóa',
      );
    }
    // --------------------------------------

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw new UnauthorizedException('Sai mật khẩu');
    }

    return user;
  }

  async login(user: any) {
    const doctor = await this.doctorsService.findByUserId(user.id);
    // Payload lưu thêm is_active nếu bạn muốn kiểm tra ở Guard sau này
    const payload = {
      sub: user.id,
      username: user.username,
      role: user.role,
      doctorId: doctor ? doctor.id: null,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
        is_active: user.is_active, // Trả về để Frontend biết trạng thái
      },
      doctorId: doctor ? doctor.id : null,
    };
  }

  async register(dto: CreateUserDto) {
    const hashed = await bcrypt.hash(dto.password, 10);
    const newUser = await this.usersService.create({
      ...dto,
      password: hashed,
    });
    return newUser;
  }
}
