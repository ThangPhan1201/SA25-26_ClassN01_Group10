import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('departments')
export class Department {
  @PrimaryGeneratedColumn({ type: 'bigint' }) 
  id: number;

  @Column({ name: 'name_department', length: 100, unique: true }) 
  name: string; 

  @Column({ type: 'text', nullable: true })
  description: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp without time zone' })
  created_at: Date;
}