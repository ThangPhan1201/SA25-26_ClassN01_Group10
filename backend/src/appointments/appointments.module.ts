// src/appointments/appointments.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppointmentsService } from './appointments.service';
import { AppointmentsController } from './appointments.controller';
import { Appointment } from './appointments.entity';
import { UsersModule } from '../users/users.module';
import { NotificationsModule } from 'src/notifications/notifications.module';
import { Doctor } from '../doctors/doctors.entity'; // Import Entity Doctor
import { Patient } from '../patients/patients.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Appointment, Doctor, Patient]),
    UsersModule,
    NotificationsModule,
  ],
  controllers: [AppointmentsController],
  providers: [AppointmentsService],
})
export class AppointmentsModule {}
