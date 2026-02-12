import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { AppointmentStatus } from '../appointments.entity';

export class CreateAppointmentDto {
  @ApiProperty({ description: 'ID bệnh nhân', type: String })
  @IsNotEmpty()
  @IsString()
  patient_id: string;

  @ApiProperty({ description: 'ID bác sĩ', type: String })
  @IsNotEmpty()
  @IsString()
  doctor_id: string;

  @ApiProperty({ description: 'Ngày hẹn yyyy-mm-dd', type: String })
  @IsNotEmpty()
  @IsString()
  appointment_date: string;

  @ApiProperty({ description: 'Giờ hẹn HH:mm:ss', type: String })
  @IsNotEmpty()
  @IsString()
  appointment_time: string;

  @ApiPropertyOptional({ enum: AppointmentStatus, description: 'Trạng thái hẹn' })
  @IsOptional()
  @IsEnum(AppointmentStatus)
  status?: AppointmentStatus;

  @ApiPropertyOptional({ description: 'Ghi chú hẹn' })
  @IsOptional()
  @IsString()
  note?: string;

  @ApiPropertyOptional({ description: 'Địa điểm hẹn' })
  @IsOptional()
  @IsString()
  location?: string;
}
