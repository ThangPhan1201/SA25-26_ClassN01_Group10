import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, MaxLength } from 'class-validator';

export class CreateMedicineDto {
  @ApiProperty({ example: 'Paracetamol' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  name: string;

  @ApiProperty({ example: 'Panadol', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  brand_name?: string;

  @ApiProperty({ example: 'Viên' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  unit: string;

  @ApiProperty({ example: '500mg', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  concentration: string;

  @ApiProperty({ example: 'Thuốc giảm đau hạ sốt', required: false })
  @IsOptional()
  @IsString()
  description: string;
}