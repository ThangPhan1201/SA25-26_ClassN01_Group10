import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MedicalRecord } from '../medical-records/entities/medical-record.entity';
import { CreateMedicalRecordDto } from './dto/create-medical-record.dto';
import { Appointment } from '../appointments/appointments.entity';
import { UpdateMedicalRecordDto } from './dto/update-medical-record.dto';

@Injectable()
export class MedicalRecordsService {
  constructor(
    @InjectRepository(MedicalRecord)
    private readonly recordRepo: Repository<MedicalRecord>,
    
    @InjectRepository(Appointment)
    private readonly appointmentRepo: Repository<Appointment>,
  ) {}

  async create(dto: CreateMedicalRecordDto) {
    // 1. Kiểm tra lịch hẹn
    const appointment = await this.appointmentRepo.findOne({
      where: { id: dto.appointment_id },
      relations: ['patient', 'doctor']
    });

    if (!appointment) throw new NotFoundException('Không tìm thấy lịch hẹn');

    // 2. Chặn nếu lịch hẹn này đã có bệnh án
    const existing = await this.recordRepo.findOne({ where: { appointmentId: dto.appointment_id } });
    if (existing) throw new BadRequestException('Lịch hẹn này đã được lập bệnh án trước đó');

    // 3. Tạo record (Lấy thẳng doctor_id/patient_id từ lịch hẹn)
    const record = this.recordRepo.create({
      appointment,
      patient: appointment.patient,
      doctor: appointment.doctor,
      symptoms: dto.symptoms,
      diagnosis: dto.diagnosis,
      conclusion: dto.conclusion,
    });

    const savedRecord = await this.recordRepo.save(record);

    // 4. Update trạng thái Appointment thành completed
    await this.appointmentRepo.update(appointment.id, { status: 'completed' as any });

    return savedRecord;
  }

  async findAll() {
    return await this.recordRepo.find({
      relations: ['patient.user', 'doctor.user', 'appointment'],
      order: { createdAt: 'DESC' }
    });
  }

  async findByPatient(patientId: string) {
    return await this.recordRepo.find({
      where: { patientId },
      relations: ['doctor.user', 'appointment'],
    });
  }

  async findOne(id: string) {
    const record = await this.recordRepo.findOne({
      where: { id },
      relations: ['patient.user', 'doctor.user', 'appointment'],
    });
    if (!record) throw new NotFoundException('Không tìm thấy hồ sơ bệnh án');
    return record;
  }

  async update(id: string, dto: UpdateMedicalRecordDto) {
    // 1. Kiểm tra tồn tại
    const record = await this.findOne(id);

    // 2. Cập nhật các trường (không cho phép sửa appointment_id để đảm bảo tính nhất quán)
    if (dto.symptoms) record.symptoms = dto.symptoms;
    if (dto.diagnosis) record.diagnosis = dto.diagnosis;
    if (dto.conclusion) record.conclusion = dto.conclusion;
    
    // Nếu bạn có các trường khác như treatment_plan, medications thì thêm ở đây
    
    // 3. Lưu bản ghi
    return await this.recordRepo.save(record);
  }

  async remove(id: string) {
    const record = await this.findOne(id);
    return await this.recordRepo.remove(record);
  }
}