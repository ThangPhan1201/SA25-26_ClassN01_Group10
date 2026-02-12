import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Prescription } from './entities/prescription.entity';
import { CreatePrescriptionDto } from './dto/create-prescription.dto';
import { MedicalRecord } from '../medical-records/entities/medical-record.entity';
import { UpdatePrescriptionDto } from './dto/update-prescription.dto';
import { Medicine } from '../medicines/entities/medicine.entity'; // Thêm import này

@Injectable()
export class PrescriptionsService {
  constructor(
    @InjectRepository(Prescription)
    private readonly prescriptionRepo: Repository<Prescription>,

    @InjectRepository(MedicalRecord)
    private readonly recordRepo: Repository<MedicalRecord>,

    @InjectRepository(Medicine) // Inject thêm Repository thuốc
    private readonly medicineRepo: Repository<Medicine>,
  ) {}

  async create(dto: CreatePrescriptionDto) {
    // 1. Kiểm tra sự tồn tại của bệnh án
    const record = await this.recordRepo.findOne({ where: { id: dto.medical_record_id } });
    if (!record) throw new NotFoundException('Hồ sơ bệnh án không tồn tại');

    // 2. Logic thông minh cho tên thuốc:
    let finalMedicineName = dto.medicine_name;
    
    // Nếu có medicine_id, ưu tiên lấy tên chuẩn từ danh mục thuốc
    if (dto.medicine_id) {
      const medicine = await this.medicineRepo.findOne({ where: { id: dto.medicine_id } });
      if (medicine) {
        finalMedicineName = `${medicine.name} ${medicine.concentration || ''}`.trim();
      }
    }

    // 3. Tạo bản ghi
    const prescription = this.prescriptionRepo.create({
      medicalRecord: record,
      medicineId: dto.medicine_id, // Lưu ID để liên kết (nếu có)
      medicine_name: finalMedicineName, // Lưu text để hiển thị tĩnh
      dosage: dto.dosage,
      usage: dto.usage,
    });

    try {
      return await this.prescriptionRepo.save(prescription);
    } catch (error) {
      if (error.code === '23505') { 
        throw new ConflictException('Loại thuốc này đã có trong đơn thuốc của bệnh án này rồi');
      }
      throw error;
    }
  }

  async update(id: string, dto: UpdatePrescriptionDto) {
    const prescription = await this.prescriptionRepo.findOne({ where: { id } });
    if (!prescription) {
      throw new NotFoundException(`Không tìm thấy đơn thuốc với ID ${id}`);
    }
  
    if (dto.medical_record_id) {
      const record = await this.recordRepo.findOne({ where: { id: dto.medical_record_id } });
      if (!record) throw new NotFoundException('Hồ sơ bệnh án mới không tồn tại');
    }

    // Cập nhật dữ liệu
    Object.assign(prescription, dto);
  
    try {
      return await this.prescriptionRepo.save(prescription);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Tên thuốc này đã tồn tại trong đơn thuốc này rồi');
      }
      throw error;
    }
  }

  async findAllByRecord(recordId: string) {
    return await this.prescriptionRepo.find({
      where: { medicalRecordId: recordId },
      relations: ['medicine'] // Để lấy được cả thông tin gốc của thuốc nếu cần
    });
  }

  async remove(id: string) {
    const result = await this.prescriptionRepo.delete(id);
    if (result.affected === 0) throw new NotFoundException('Không tìm thấy đơn thuốc để xóa');
    return { message: 'Đã xóa thuốc khỏi đơn' };
  }
}