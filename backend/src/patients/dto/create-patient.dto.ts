// src/patients/dto/create-patient.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsEnum, IsOptional, IsDateString } from 'class-validator';
import { GenderType } from '../patients.entity';

export class CreatePatientDto {
  @ApiProperty({ 
    example: '3352808440', 
    description: 'ID của User (UUID hoặc String ID tùy cấu hình)' 
  })
  @IsNotEmpty()
  @IsString()
  userId: string;

  @ApiProperty({ 
    example: 'Nguyễn Văn Bệnh', 
    description: 'Họ tên đầy đủ của bệnh nhân' 
  })
  @IsNotEmpty()
  @IsString()
  fullName: string;

  @ApiProperty({ 
    enum: GenderType, 
    example: 'man', // Sử dụng giá trị chuỗi thực tế trong DB để test nhanh
    description: 'Giới tính (man, woman, other)' 
  })
  @IsNotEmpty()
  @IsEnum(GenderType, {
    message: 'Giới tính phải là man, woman hoặc other'
  })
  gender: GenderType;

  @ApiProperty({ 
    example: '1990-01-01', 
    description: 'Ngày sinh định dạng YYYY-MM-DD' 
  })
  @IsNotEmpty()
  @IsDateString({}, { message: 'Ngày sinh không đúng định dạng (YYYY-MM-DD)' })
  dateOfBirth: Date;

  @ApiProperty({ example: '0901234567', description: 'Số điện thoại liên lạc' })
  @IsNotEmpty()
  @IsString()
  phone: string;

  @ApiProperty({ 
    example: '123 Đường ABC, Quận 1, TP.HCM', 
    required: false 
  })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({ 
    example: 'BH123456789', 
    required: false,
    description: 'Số thẻ bảo hiểm y tế (nếu có)'
  })
  @IsOptional()
  @IsString()
  healthInsuranceNumber?: string;
}