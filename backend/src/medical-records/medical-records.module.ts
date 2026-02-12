import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MedicalRecord } from '../medical-records/entities/medical-record.entity';
import { MedicalRecordsService } from './medical-records.service';
import { MedicalRecordsController } from './medical-records.controller';
import { Appointment } from '../appointments/appointments.entity';

@Module({
  imports: [
    // Phải có cả MedicalRecord và Appointment vì Service dùng cả 2 Repository
    TypeOrmModule.forFeature([MedicalRecord, Appointment])
  ],
  controllers: [MedicalRecordsController],
  providers: [MedicalRecordsService],
})
export class MedicalRecordsModule {}