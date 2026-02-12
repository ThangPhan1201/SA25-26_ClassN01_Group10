import { Controller, Get, Post, Body, Param, ParseIntPipe, Delete, Patch } from '@nestjs/common'; // Thêm ParseIntPipe
import { DepartmentsService } from './departments.service';
import { CreateDepartment } from './dto/create-department.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { UpdateDepartmentDto } from './dto/update-department.dto';

@ApiTags('Departments')
@Controller('departments')
export class DepartmentsController {
  constructor(private readonly departmentsService: DepartmentsService) {}

  @Post()
  @ApiOperation({ summary: 'Tạo mới một phòng ban' })
  create(@Body() createDepartmentDto: CreateDepartment) {
    return this.departmentsService.create(createDepartmentDto);
  }

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách tất cả phòng ban' })
  findAll() {
    return this.departmentsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) { 
    return this.departmentsService.findOne(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xóa một phòng ban' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.departmentsService.remove(id);
}

@Patch(':id') 
@ApiOperation({ summary: 'Cập nhật một phần thông tin phòng ban' })
async update(
  @Param('id', ParseIntPipe) id: number, 
  @Body() updateDto: UpdateDepartmentDto
) {
  return await this.departmentsService.update(id, updateDto);
}
}