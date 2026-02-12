import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Appointment } from '../../appointments/appointments.entity';
import { Doctor } from '../../doctors/doctors.entity';
import { Patient } from '../../patients/patients.entity';

@Entity('medical_records')
export class MedicalRecord {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: string;

  @Column({ name: 'appointment_id', type: 'bigint' })
  appointmentId: string;

  @ManyToOne(() => Appointment)
  @JoinColumn({ name: 'appointment_id' })
  appointment: Appointment;

  @Column({ name: 'patient_id', type: 'bigint' })
  patientId: string;

  @ManyToOne(() => Patient)
  @JoinColumn({ name: 'patient_id' })
  patient: Patient;

  @Column({ name: 'doctor_id', type: 'bigint' })
  doctorId: string;

  @ManyToOne(() => Doctor)
  @JoinColumn({ name: 'doctor_id' })
  doctor: Doctor;

  @Column({ type: 'text' })
  symptoms: string;

  @Column({ type: 'text' })
  diagnosis: string;

  @Column({ type: 'text', nullable: true })
  conclusion: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}