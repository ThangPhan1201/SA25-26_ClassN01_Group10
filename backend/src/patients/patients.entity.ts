// src/patients/patients.entity.ts
import { Entity, PrimaryColumn, Column, CreateDateColumn, OneToOne, JoinColumn } from 'typeorm';
import { User } from '../users/users.entity';

export enum GenderType {
  MALE = 'man',
  FEMALE = 'woman',
  OTHER = 'other',
}

@Entity('patients')
export class Patient {
  @PrimaryColumn({ type: 'bigint' })
  id: string; // TypeORM sẽ nhận bigint dưới dạng string để tránh mất độ chính xác

  @Column({ name: 'user_id' })
  userId: string;

  @OneToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'full_name', length: 100 })
  fullName: string;

  @Column({ type: 'enum', enum: GenderType })
  gender: GenderType;

  @Column({ name: 'date_of_birth', type: 'date' })
  dateOfBirth: Date;

  @Column({ unique: true, length: 20 })
  phone: string;

  @Column({ type: 'text', nullable: true })
  address: string;

  @Column({ name: 'health_insurance_number', unique: true, nullable: true, length: 50 })
  healthInsuranceNumber: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}