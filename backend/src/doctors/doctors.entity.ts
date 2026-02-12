// src/doctors/entities/doctor.entity.ts
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  OneToOne,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../users/users.entity';
import { Department } from '../departments/entities/department.entity'; // <-- Đảm bảo bạn đã có file này

@Entity('doctors')
export class Doctor {
  @Column({ type: 'enum', enum: ['male', 'female', 'other'], default: 'male' })
  gender: string;
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: string;

  @Column({ name: 'user_id' })
  userId: string;

  @OneToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'full_name', length: 100 })
  fullName: string;

  @Column({ unique: true, length: 20 })
  phone: string;

  // 1. Lưu ID của phòng ban vào cột này
  @Column({ name: 'department_id', type: 'bigint' })
  departmentId: string;

  // 2. Thiết lập mối quan hệ Many-To-One (Nhiều bác sĩ - Một phòng ban)
  @ManyToOne(() => Department)
  @JoinColumn({ name: 'department_id' })
  department: Department;

  @Column({ name: 'experience_year' })
  experienceYear: number;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'text', nullable: true })
  address: string;

  @Column({ name: 'patients_seen', default: 0 })
  patientsSeen: number;

  @Column({ name: 'date_of_birth', type: 'date' })
  dateOfBirth: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
