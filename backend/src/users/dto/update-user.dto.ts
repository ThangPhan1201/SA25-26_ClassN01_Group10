import { IsEnum, IsOptional, IsString } from 'class-validator';
import { UserRole } from '../users.entity';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiPropertyOptional({ example: 'Nguyễn Phương Ngân' })
  @IsOptional()
  @IsString()
  fullName?: string;

  @ApiPropertyOptional({ description: 'Đường dẫn avatar' })
  @IsOptional()
  @IsString()
  avatar?: string;

  // Thêm cập nhật Role ở đây
  @ApiPropertyOptional({ 
    enum: UserRole, 
    example: UserRole.PATIENT,
    description: 'Vai trò của người dùng trong hệ thống'
  })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  is_active?: boolean;
}