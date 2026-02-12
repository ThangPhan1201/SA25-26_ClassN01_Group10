// src/appointments/appointments.service.ts
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Appointment, AppointmentStatus } from './appointments.entity';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { NotificationsService } from '../notifications/notifications.service';
import { NotificationType } from '../notifications/notifications.entity';
import { Doctor } from '../doctors/doctors.entity';
import { Patient } from '../patients/patients.entity';

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(Appointment)
    private readonly appointmentRepo: Repository<Appointment>,

    @InjectRepository(Doctor)
    private readonly doctorRepo: Repository<Doctor>,

    @InjectRepository(Patient)
    private readonly patientRepo: Repository<Patient>,

    private readonly notificationsService: NotificationsService,
  ) {}

  async create(dto: CreateAppointmentDto): Promise<Appointment> {
    // 1. Kiểm tra sự tồn tại trong bảng patients và doctors (không phải users)
    const patient = await this.patientRepo.findOne({
      where: { id: dto.patient_id },
      relations: ['user'], // Lấy thêm quan hệ user để lấy tên gửi thông báo
    });
    if (!patient) throw new NotFoundException('Hồ sơ bệnh nhân không tồn tại');

    const doctor = await this.doctorRepo.findOne({
      where: { id: dto.doctor_id },
      relations: ['user'],
    });
    if (!doctor) throw new NotFoundException('Hồ sơ bác sĩ không tồn tại');

    // 2. Tạo đối tượng và lưu
    // TypeORM sẽ tự hiểu gán id của object patient/doctor vào cột patient_id/doctor_id
    const appointment = this.appointmentRepo.create({
      patient,
      doctor,
      appointment_date: dto.appointment_date,
      appointment_time: dto.appointment_time,
      status: dto.status || AppointmentStatus.PENDING,
      note: dto.note,
      location: dto.location,
    });

    try {
      const savedAppointment = await this.appointmentRepo.save(appointment);

      // 3. Gửi thông báo cho bác sĩ (Dùng userId của bác sĩ)
      await this.notificationsService.createNotification({
        userId: doctor.userId, // ID từ bảng Users để nhận tin nhắn
        title: 'New Appointment',
        content: `Patient ${patient.fullName || patient.user.username} scheduled an appointment for ${dto.appointment_date}`,
        type: NotificationType.APPOINTMENT,
        targetUrl: `/appointments/${savedAppointment.id}`,
      });

      return savedAppointment;
    } catch (error) {
      // Bắt lỗi Unique Constraint (trùng lịch) từ Database
      if (error.code === '23505') {
        throw new BadRequestException(
          'The doctor or patient already has an appointment at this time slot.',
        );
      }
      throw error;
    }
  }

  async findAll(): Promise<Appointment[]> {
    return this.appointmentRepo.find({
      // Load thông tin lồng nhau: Appointment -> Doctor -> User
      relations: ['patient.user', 'doctor.user', 'doctor.department'],
      order: { appointment_date: 'DESC', appointment_time: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Appointment> {
    const appointment = await this.appointmentRepo.findOne({
      where: { id },
      relations: ['patient.user', 'doctor.user', 'doctor.department'],
    });
    if (!appointment) throw new NotFoundException('No appointment found.');
    return appointment;
  }

  // src/appointments/appointments.service.ts

  // src/appointments/appointments.service.ts

  async update(id: string, dto: UpdateAppointmentDto): Promise<Appointment> {
    const appointment = await this.appointmentRepo.findOne({
      where: { id },
      relations: ['patient', 'doctor'], // Đảm bảo đã load cả patient và doctor
    });

    if (!appointment) {
      throw new NotFoundException('No appointment found.');
    }

    const oldStatus = appointment.status;

    // Cập nhật các trường dữ liệu
    if (dto.appointment_date) appointment.appointment_date = dto.appointment_date;
    if (dto.appointment_time) appointment.appointment_time = dto.appointment_time;
    if (dto.status) appointment.status = dto.status;
    if (dto.note) appointment.note = dto.note;
    if (dto.location) appointment.location = dto.location;

    const updatedAppointment = await this.appointmentRepo.save(appointment);

    // KIỂM TRA CHUYỂN TRẠNG THÁI SANG CANCELLED
    if (dto.status === AppointmentStatus.CANCELLED && oldStatus !== AppointmentStatus.CANCELLED) {
      try {
        const commonTitle = 'Update your appointment.';
        const commonContent = `The appointment scheduled for ${updatedAppointment.appointment_time} on ${updatedAppointment.appointment_date} has been cancelled.`;
        const commonType = NotificationType.APPOINTMENT;
        const commonUrl = `/appointments/${updatedAppointment.id}`;

        // 1. Tạo thông báo cho Bệnh nhân
        await this.notificationsService.createNotification({
          userId: updatedAppointment.patient.userId,
          title: commonTitle,
          content: commonContent,
          type: commonType,
          targetUrl: commonUrl,
        });

        // 2. Tạo thông báo cho Bác sĩ
        await this.notificationsService.createNotification({
          userId: updatedAppointment.doctor.userId,
          title: commonTitle,
          content: commonContent,
          type: commonType,
          targetUrl: commonUrl,
        });

        console.log('Đã gửi thông báo hủy lịch cho cả bệnh nhân và bác sĩ');
      } catch (error) {
        console.error('Lỗi gửi thông báo hủy lịch:', error);
      }
    }
    // Gửi thông báo thông thường cho các trạng thái khác (nếu cần)
    else if (dto.status && dto.status !== oldStatus) {
      try {
        await this.notificationsService.createNotification({
          userId: updatedAppointment.patient.userId,
          title: 'New Appointment',
          content: `Patient ${updatedAppointment.patient.fullName} scheduled an appointment for ${updatedAppointment.appointment_time} on ${updatedAppointment.appointment_date}  ${dto.status.toUpperCase()}`,
          type: NotificationType.APPOINTMENT,
          targetUrl: `/appointments/${updatedAppointment.id}`,
        });
      } catch (error) {
        console.error('Lỗi gửi thông báo trạng thái:', error);
      }
    }

    return updatedAppointment;
  }

  async remove(id: string): Promise<void> {
    const result = await this.appointmentRepo.delete(id);
    if (result.affected === 0)
      throw new NotFoundException('Không tìm thấy lịch hẹn để xóa');
  }
}
