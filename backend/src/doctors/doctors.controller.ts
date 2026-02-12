// src/doctors/doctors.controller.ts
import {
  Controller,
  Post,
  Get,
  Body,
  Patch,
  Delete,
  Param,
  Query,
  UseInterceptors,
  BadRequestException,
  UploadedFile,
} from '@nestjs/common';
import { DoctorsService } from './doctors.service';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { UpdateDoctorDto } from './dto/update-doctor.dto';
import { ApiTags, ApiOperation, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { UsersService } from '../users/users.service';

@ApiTags('doctors')
@Controller('doctors')
export class DoctorsController {
  constructor(
    private readonly doctorsService: DoctorsService,
    private readonly usersService: UsersService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Tạo thông tin chi tiết bác sĩ' })
  create(@Body() dto: CreateDoctorDto) {
    return this.doctorsService.create(dto);
  }

  @Post('upload-avatar/:id')
  @ApiConsumes('multipart/form-data') // Báo cho Swagger đây là form gửi file
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          // Tên key ở đây phải là 'file'
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './src/avatar', // Lưu vào src/avatar như bạn muốn
        filename: (req, file, callback) => {
          const doctorId = req.params.id;
          const fileExtName = extname(file.originalname);
          callback(null, `doctor_${doctorId}${fileExtName}`);
        },
      }),
    }),
  )
  async uploadFile(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException(
        'Không nhận được file! Hãy kiểm tra lại nút chọn file trong Swagger.',
      );
    }

    const doctor = await this.doctorsService.findOne(id);
    await this.usersService.updateAvatar(doctor.userId, file.filename);

    return {
      message: 'Upload thành công',
      avatar: file.filename,
    };
  }

  @Get('active')
  @ApiOperation({ summary: 'Danh sách bác sĩ đang làm việc (Cho Bệnh nhân)' })
  findActive() {
    return this.doctorsService.findAll(true);
  }

  // 2. API cho Admin: Lấy tất cả, có thể lọc theo trạng thái
  @Get('admin/all')
  // @UseGuards(RolesGuard) // Sau này bạn sẽ thêm bảo mật ở đây
  @ApiOperation({ summary: 'Quản lý danh sách bác sĩ (Cho Admin)' })
  findAllForAdmin(@Query('onlyActive') onlyActive?: boolean) {
    return this.doctorsService.findAll(onlyActive);
  }

  @Get('user/:userId')
  findOneByUserId(@Param('userId') userId: string) {
    return this.doctorsService.findOneByUserId(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy thông tin chi tiết một bác sĩ theo ID' })
  findOne(@Param('id') id: string) {
    return this.doctorsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateDoctorDto: UpdateDoctorDto, // Đổi từ Partial<CreateDoctorDto> sang Class này
  ) {
    return this.doctorsService.update(id, updateDoctorDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.doctorsService.deactivate(id);
  }
}
