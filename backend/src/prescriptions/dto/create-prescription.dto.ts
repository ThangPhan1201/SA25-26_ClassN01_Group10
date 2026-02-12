import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional ,MaxLength } from 'class-validator';

export class CreatePrescriptionDto {
  @ApiProperty({ example: '1' })
  @IsNotEmpty()
  medical_record_id: string;
  
  @ApiProperty({ example: '1', required: false, description: 'ID từ bảng medicines' })
  @IsOptional()
  medicine_id?: string;

  @ApiProperty({ example: 'Augmentin 625mg' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  medicine_name: string;

  @ApiProperty({ example: '14 viên' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  dosage: string;

  @ApiProperty({ example: 'Uống 1 viên mỗi 12 giờ, sau khi ăn.' })
  @IsNotEmpty()
  @IsString()
  usage: string;
}