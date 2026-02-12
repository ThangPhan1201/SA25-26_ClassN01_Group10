import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MedicinesService } from './medicines.service';
import { MedicinesController } from './medicines.controller';
import { Medicine } from './entities/medicine.entity';

@Module({
  imports: [
    // BẮT BUỘC: Thêm dòng này để MedicineRepository có sẵn cho Service
    TypeOrmModule.forFeature([Medicine])
  ],
  controllers: [MedicinesController],
  providers: [MedicinesService],
  exports: [TypeOrmModule, MedicinesService], // Export TypeOrmModule để module Prescriptions có thể dùng Medicine
})
export class MedicinesModule {}