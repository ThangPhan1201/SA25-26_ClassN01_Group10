import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Unique } from 'typeorm';
import { MedicalRecord } from '../../medical-records/entities/medical-record.entity';
import { Medicine } from '../../medicines/entities/medicine.entity'; // Import Medicine Entity mới tạo

@Entity('prescriptions')
@Unique('unique_medicine_per_record', ['medicalRecordId', 'medicine_name'])
export class Prescription {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: string;

  @Column({ name: 'medical_record_id', type: 'bigint' })
  medicalRecordId: string;

  @ManyToOne(() => MedicalRecord, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'medical_record_id' })
  medicalRecord: MedicalRecord;

  // Link tới bảng danh sách thuốc (Optional - Nếu thuốc có trong danh mục)
  @Column({ name: 'medicine_id', type: 'bigint', nullable: true })
  medicineId: string;

  @ManyToOne(() => Medicine, { nullable: true })
  @JoinColumn({ name: 'medicine_id' })
  medicine: Medicine;

  // Tên thuốc hiển thị (Lưu tên thuốc chuẩn từ bảng Medicine hoặc tên thuốc bác sĩ tự gõ)
  @Column({ type: 'varchar', length: 100 })
  medicine_name: string;

  @Column({ type: 'varchar', length: 100 })
  dosage: string;

  @Column({ type: 'text' })
  usage: string;
}