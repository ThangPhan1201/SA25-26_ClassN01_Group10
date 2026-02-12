import { Controller, Post, Body, Get, Param, Patch } from '@nestjs/common';
import { MedicalRecordsService } from './medical-records.service';
import { CreateMedicalRecordDto } from './dto/create-medical-record.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { UpdateMedicalRecordDto } from './dto/update-medical-record.dto';

@ApiTags('medical-records')
@Controller('medical-records')
export class MedicalRecordsController {
  constructor(private readonly medicalRecordsService: MedicalRecordsService) {}

  @Post()
  @ApiOperation({ summary: 'Bác sĩ tạo bệnh án cho lịch hẹn' })
  create(@Body() dto: CreateMedicalRecordDto) {
    return this.medicalRecordsService.create(dto);
  }

  @Get('patient/:id')
  @ApiOperation({ summary: 'Lấy lịch sử bệnh án của một bệnh nhân' })
  findByPatient(@Param('id') id: string) {
    return this.medicalRecordsService.findByPatient(id);
  }

  @Get()
  findAll() {
    return this.medicalRecordsService.findAll();
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateMedicalRecordDto) {
    return this.medicalRecordsService.update(id, dto);
  }
}
