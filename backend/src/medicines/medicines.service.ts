import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Medicine } from './entities/medicine.entity';
import { UpdateMedicineDto } from './dto/update-medicine.dto';

@Injectable()
export class MedicinesService {
  constructor(
    @InjectRepository(Medicine)
    private readonly medicineRepo: Repository<Medicine>,
  ) {}

  // Các hàm Controller đang gọi:
  async findOne(id: string) {
    const medicine = await this.medicineRepo.findOne({ where: { id } });
    if (!medicine) throw new NotFoundException('Không tìm thấy thuốc');
    return medicine;
  }

  async update(id: string, updateMedicineDto: UpdateMedicineDto) {
    // 1. Tìm bản ghi hiện tại
    const medicine = await this.medicineRepo.findOne({ where: { id } });
    if (!medicine) throw new NotFoundException('Không tìm thấy thuốc');

    // 2. Ghi đè dữ liệu mới (Nếu updateMedicineDto có brand_name, nó sẽ đè lên cái cũ)
    Object.assign(medicine, updateMedicineDto);

    // 3. Lưu lại
    return await this.medicineRepo.save(medicine);
  }

  async remove(id: string) {
    const medicine = await this.findOne(id);
    await this.medicineRepo.remove(medicine);
    return { message: 'Đã xóa thuốc' };
  }

  // Tìm kiếm thuốc theo tên (Dùng cho ô gợi ý khi kê đơn)
  async search(name: string) {
    return await this.medicineRepo.find({
      where: { name: Like(`%${name}%`) },
      take: 10, // Chỉ lấy 10 kết quả gợi ý
    });
  }

  findAll() {
    return this.medicineRepo.find({ order: { name: 'ASC' } });
  }

  create(dto: any) {
    const medicine = this.medicineRepo.create(dto);
    return this.medicineRepo.save(medicine);
  }
}
