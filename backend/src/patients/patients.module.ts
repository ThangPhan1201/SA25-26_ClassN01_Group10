// src/patients/patients.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PatientsService } from './patients.service';
import { PatientsController } from './patients.controller';
import { Patient } from './patients.entity';
import { User } from '../users/users.entity'; // Quan trọng: Nếu Service cần truy cập bảng User

@Module({
  imports: [
    // Đăng ký các Entity để TypeORM tạo ra Repository tương ứng
    TypeOrmModule.forFeature([Patient, User]), 
  ],
  controllers: [PatientsController],
  providers: [PatientsService],
  exports: [PatientsService], // Export nếu bạn muốn module Appointments sử dụng PatientsService
})
export class PatientsModule {}