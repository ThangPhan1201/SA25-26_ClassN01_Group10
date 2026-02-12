import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateDepartment {
  @ApiProperty({ example: 'Khoa Nội' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'Chuyên điều trị các bệnh nội khoa tổng quát' })
  @IsString()
  @IsOptional()
  description?: string;
}