// src/patients/patients.controller.ts
import { Controller, Get, Post, Body, Patch, Param, UseGuards } from '@nestjs/common';
import { PatientsService } from './patients.service';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('patients')
@Controller('patients')
export class PatientsController {
  constructor(private readonly patientsService: PatientsService) {}

  @Post()
  create(@Body() createPatientDto: CreatePatientDto) {
    return this.patientsService.create(createPatientDto);
  }

  @Get()
  findAll() {
    return this.patientsService.findAll();
  }

  @Get('user/:userId')
  findByUserId(@Param('userId') userId: string) {
    return this.patientsService.findByUserId(userId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Cập nhật thông tin bệnh nhân' })
  update(
    @Param('id') id: string, 
    @Body() updatePatientDto: UpdatePatientDto // Sử dụng Class thay vì Partial type
  ) {
    return this.patientsService.update(id, updatePatientDto);
  }
}