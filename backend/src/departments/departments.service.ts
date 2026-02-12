import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Department } from './entities/department.entity';
import { CreateDepartment } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';

@Injectable()
export class DepartmentsService {
  constructor(
    @InjectRepository(Department)
    private readonly repo: Repository<Department>,
  ) {}

  async create(dto: CreateDepartment) {
    const existing = await this.repo.findOne({ where: { name: dto.name } });
    if (existing) throw new ConflictException('Tên phòng ban đã tồn tại');
    
    const dept = this.repo.create(dto);
    return await this.repo.save(dept);
  }

  findAll() {
    return this.repo.find();
  }

  async findOne(id: number) { 
    const dept = await this.repo.findOne({ 
      where: { id: id },

    });
    if (!dept) throw new NotFoundException('Không tìm thấy phòng ban');
    return dept;
  }

  async remove(id: number) {
    const dept = await this.findOne(id); 
    return await this.repo.remove(dept);
  }

  async update(id: number, dto: UpdateDepartmentDto) {

    const dept = await this.findOne(id);
  

    if (dto.name && dto.name !== dept.name) {
      const existing = await this.repo.findOne({ where: { name: dto.name } });
      if (existing) throw new ConflictException('Tên phòng ban mới đã tồn tại');
    }

    const updatedDept = this.repo.merge(dept, dto);
  

    return await this.repo.save(updatedDept);
  }
}