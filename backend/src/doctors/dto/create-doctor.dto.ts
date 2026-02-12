// src/doctors/dto/create-doctor.dto.ts
import {
  IsString,
  IsNotEmpty,
  IsInt,
  Min,
  IsOptional,
  IsDateString,
  MaxLength,
  IsEnum,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Column } from 'typeorm';

export class CreateDoctorDto {
  // Xóa bỏ phần @Column cũ ở đây, chỉ giữ lại Validation
  @ApiProperty({
    enum: ['male', 'female', 'other'],
    example: 'male',
    description: 'Giới tính của bác sĩ',
  })
  @IsOptional()
  @IsEnum(['male', 'female', 'other'], {
    message: 'Giới tính phải là male, female hoặc other',
  })
  gender?: string; // Chỉ khai báo một lần duy nhất

  @ApiProperty({
    example: '3352808440',
    description: 'ID của User từ bảng users',
  })
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({ example: 'BS. Nguyễn Văn Thông' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  fullName: string;

  @ApiProperty({ example: '0912345678' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  phone: string;

  // THAY ĐỔI TẠI ĐÂY: Sử dụng departmentId thay vì tên khoa
  @ApiProperty({
    example: '1',
    description: 'ID của phòng ban từ bảng departments',
  })
  @IsString()
  @IsNotEmpty()
  departmentId: string;

  @ApiProperty({ example: 10 })
  @IsInt()
  @Min(0)
  experienceYear: number;

  @ApiProperty({ example: '1985-05-20' })
  @IsDateString()
  dateOfBirth: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  address?: string;
}
