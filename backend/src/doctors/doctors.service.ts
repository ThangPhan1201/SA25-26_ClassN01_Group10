import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Doctor } from './doctors.entity';
import { User } from '../users/users.entity';
import { CreateDoctorDto } from './dto/create-doctor.dto';

@Injectable()
export class DoctorsService {
  constructor(
    @InjectRepository(Doctor)
    private readonly doctorRepository: Repository<Doctor>,

    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async create(dto: CreateDoctorDto) {
    const user = await this.userRepo.findOne({ where: { id: dto.userId } });
    if (!user) throw new NotFoundException('Người dùng không tồn tại');

    const existingDoctor = await this.doctorRepository.findOne({
      where: { userId: dto.userId },
    });
    if (existingDoctor)
      throw new ConflictException('Người dùng này đã có hồ sơ bác sĩ');

    if (dto.phone) {
      const existingPhone = await this.doctorRepository.findOne({
        where: { phone: dto.phone },
      });
      if (existingPhone)
        throw new ConflictException('Số điện thoại này đã được đăng ký');
    }

    const doctor = this.doctorRepository.create(dto);
    return await this.doctorRepository.save(doctor);
  }

  // Cập nhật avatar vào bảng Users (khuyên dùng)
  // src/doctors/doctors.service.ts
  async updateAvatar(id: string, avatarUrl: string) {
    const doctor = await this.findOne(id);

    // Sửa tên thuộc tính thành 'avatar'
    await this.userRepo.update(doctor.userId, {
      avatar: avatarUrl,
    });

    return { avatar: avatarUrl };
  }

  async findOne(id: string) {
    const numericId = !isNaN(Number(id)) ? Number(id) : undefined;

    let doctor = await this.doctorRepository.findOne({
      where: [
        { userId: id },
        ...(numericId ? [{ id: numericId as any }] : []), // Thêm 'as any' ở đây
      ],
      relations: ['user', 'department'],
    });

    if (!doctor) throw new NotFoundException('Không tìm thấy bác sĩ');
    return doctor;
  }

  async findByUserId(userId: string): Promise<Doctor | null> {
    return await this.doctorRepository.findOne({
      where: { userId: userId },
      relations: ['user', 'department'],
    });
  }

  async findOneByUserId(userId: string) {
    const doctor = await this.findByUserId(userId);
    if (!doctor)
      throw new NotFoundException(
        `Không tìm thấy hồ sơ bác sĩ cho User ID: ${userId}`,
      );
    return doctor;
  }

  async findAll(status?: boolean) {
    const query: any = {
      relations: ['user', 'department'],
      order: { createdAt: 'DESC' },
    };
    if (status !== undefined) {
      query.where = { user: { is_active: status } };
    }
    return await this.doctorRepository.find(query);
  }

  async update(id: string, dto: Partial<CreateDoctorDto>) {
    const doctor = await this.findOne(id);
    if (dto.phone && dto.phone !== doctor.phone) {
      const existingPhone = await this.doctorRepository.findOne({
        where: { phone: dto.phone },
      });
      if (existingPhone) throw new ConflictException('Số điện thoại bị trùng');
    }
    Object.assign(doctor, dto);
    return await this.doctorRepository.save(doctor);
  }

  async deactivate(userId: string) {
    await this.userRepo.update(userId, { is_active: false });
    return { message: `Tài khoản bác sĩ đã bị vô hiệu hóa.` };
  }

  async activate(userId: string) {
    await this.userRepo.update(userId, { is_active: true });
    return { message: 'Đã khôi phục trạng thái hoạt động.' };
  }
}
