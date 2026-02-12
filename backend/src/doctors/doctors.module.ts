// src/doctors/doctors.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DoctorsService } from './doctors.service';
import { DoctorsController } from './doctors.controller';
import { Doctor } from './doctors.entity';
import { User } from '../users/users.entity';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Doctor,User]), UsersModule], // Đăng ký Entity Doctor tại đây
  controllers: [DoctorsController],
  providers: [DoctorsService],
  exports: [DoctorsService], 
})
export class DoctorsModule {}