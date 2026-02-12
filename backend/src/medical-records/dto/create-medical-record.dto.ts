// src/medical-records/dto/create-medical-record.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreateMedicalRecordDto {
  @ApiProperty({ example: '1', description: 'ID của lịch hẹn' })
  @IsNotEmpty()
  appointment_id: string;

  @ApiProperty({ example: 'Ho, sốt, đau họng', description: 'Triệu chứng bệnh' })
  @IsNotEmpty()
  @IsString()
  symptoms: string;

  @ApiProperty({ example: 'Viêm họng cấp', description: 'Chẩn đoán của bác sĩ' })
  @IsNotEmpty()
  @IsString()
  diagnosis: string;

  @ApiProperty({ example: 'Uống thuốc đúng liều, tránh nước đá', description: 'Lời khuyên/Kết luận' })
  @IsOptional()
  @IsString()
  conclusion: string;
}