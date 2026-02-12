import { Controller, Post, Body, Get, Param, Patch } from '@nestjs/common';
import { PrescriptionsService } from './prescriptions.service';
import { CreatePrescriptionDto } from './dto/create-prescription.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UpdatePrescriptionDto } from './dto/update-prescription.dto';

@ApiTags('prescriptions')
@Controller('prescriptions')
export class PrescriptionsController {
  constructor(private readonly prescriptionsService: PrescriptionsService) {}

  @Post()
  create(@Body() dto: CreatePrescriptionDto) {
    return this.prescriptionsService.create(dto);
  }

  @Get('record/:recordId')
  findAllByRecord(@Param('recordId') recordId: string) {
    return this.prescriptionsService.findAllByRecord(recordId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Cập nhật thông tin một loại thuốc trong đơn' })
  update(@Param('id') id: string, @Body() dto: UpdatePrescriptionDto) {
    return this.prescriptionsService.update(id, dto);
  }
}
