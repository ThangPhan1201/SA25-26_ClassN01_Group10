// src/prescriptions/prescriptions.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PrescriptionsService } from './prescriptions.service';
import { PrescriptionsController } from './prescriptions.controller';
import { Prescription } from './entities/prescription.entity'; // Đảm bảo đúng đường dẫn
import { MedicalRecord } from '../medical-records/entities/medical-record.entity'; // Đảm bảo đúng đường dẫn
import { Medicine } from 'src/medicines/entities/medicine.entity';

@Module({
  imports: [
    // BỔ SUNG: Phải có cả Prescription và MedicalRecord trong mảng này
    TypeOrmModule.forFeature([Prescription, MedicalRecord, Medicine]),
  ],
  controllers: [PrescriptionsController],
  providers: [PrescriptionsService],
  exports: [PrescriptionsService], // Export nếu bạn muốn module khác sử dụng
})
export class PrescriptionsModule {}