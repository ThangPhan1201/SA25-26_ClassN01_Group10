// src/appointments/dto/update-appointment.dto.ts
import { AppointmentStatus } from '../appointments.entity';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class UpdateAppointmentDto {
  @ApiPropertyOptional({ description: 'ID bệnh nhân' })
  @IsOptional()
  @IsString()
  patient_id?: string;

  @ApiPropertyOptional({ description: 'ID bác sĩ' })
  @IsOptional()
  @IsString()
  doctor_id?: string;

  @ApiPropertyOptional({ description: 'Ngày hẹn yyyy-mm-dd' })
  @IsOptional()
  @IsString()
  appointment_date?: string;

  @ApiPropertyOptional({ description: 'Giờ hẹn HH:mm:ss' })
  @IsOptional()
  @IsString()
  appointment_time?: string;

  @ApiPropertyOptional({ enum: AppointmentStatus, description: 'Trạng thái hẹn' })
  @IsOptional()
  @IsEnum(AppointmentStatus) // Quan trọng: Để chặn lỗi 400 nếu gửi status sai
  status?: AppointmentStatus;

  @ApiPropertyOptional({ description: 'Ghi chú' })
  @IsOptional()
  @IsString()
  note?: string;

  @ApiPropertyOptional({ description: 'Địa điểm' })
  @IsOptional()
  @IsString()
  location?: string;
}