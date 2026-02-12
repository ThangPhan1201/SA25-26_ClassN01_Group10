// src/patients/patients.service.ts
import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Patient } from './patients.entity';
import { CreatePatientDto } from './dto/create-patient.dto';

@Injectable()
export class PatientsService {
  constructor(
    @InjectRepository(Patient)
    private readonly patientRepo: Repository<Patient>,
  ) {}

  async create(dto: CreatePatientDto) {
    // 1. Kiểm tra trùng số điện thoại
    const existingPhone = await this.patientRepo.findOne({ where: { phone: dto.phone } });
    if (existingPhone) throw new ConflictException('Số điện thoại đã tồn tại');

    // 2. Kiểm tra mã bảo hiểm y tế (nếu có)
    if (dto.healthInsuranceNumber) {
      const existingHI = await this.patientRepo.findOne({ 
        where: { healthInsuranceNumber: dto.healthInsuranceNumber } 
      });
      if (existingHI) throw new ConflictException('Mã bảo hiểm y tế đã tồn tại');
    }

    const patient = this.patientRepo.create(dto);
    return await this.patientRepo.save(patient);
  }

  async findAll() {
    return await this.patientRepo.find({
      relations: ['user'],
      order: { createdAt: 'DESC' }
    });
  }

  async findByUserId(userId: string) {
    const patient = await this.patientRepo.findOne({ 
      where: { userId },
      relations: ['user'] 
    });
    if (!patient) throw new NotFoundException('Không tìm thấy hồ sơ bệnh nhân');
    return patient;
  }

  async update(id: string, dto: Partial<CreatePatientDto>) {
    const patient = await this.patientRepo.findOne({ where: { id } });
    if (!patient) throw new NotFoundException('Bệnh nhân không tồn tại');
    
    Object.assign(patient, dto);
    return await this.patientRepo.save(patient);
  }
}