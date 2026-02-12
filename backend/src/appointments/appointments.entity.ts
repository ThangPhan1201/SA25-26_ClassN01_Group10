// src/appointments/appointments.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Doctor } from '../doctors/doctors.entity'; // Import Entity Doctor
import { Patient } from '../patients/patients.entity'; // Import Entity Patient

export enum AppointmentStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  CANCELLED = 'cancelled',
  COMPLETED = 'completed',
}

@Entity('appointments')
export class Appointment {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: string;

  @Column({ name: 'patient_id', type: 'bigint' })
  patientId: string;

  @Column({ name: 'doctor_id', type: 'bigint' })
  doctorId: string;

  @ManyToOne(() => Patient)
  @JoinColumn({ name: 'patient_id' })
  patient: Patient;

  @ManyToOne(() => Doctor)
  @JoinColumn({ name: 'doctor_id' })
  doctor: Doctor;

  @Column({ type: 'date' })
  appointment_date: string;

  @Column({ type: 'time' })
  appointment_time: string;

  @Column({ type: 'enum', enum: ['pending', 'confirmed', 'cancelled', 'completed'] }) // Khớp với enum trong DB
  status: string;

  @Column({ type: 'text', nullable: true })
  note: string;

  @Column({ type: 'text', nullable: true })
  location: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}