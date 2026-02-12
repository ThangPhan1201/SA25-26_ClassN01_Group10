import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  UploadedFile,
  UseInterceptors,
  Patch,
  BadRequestException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { ApiBody, ApiConsumes, ApiOperation } from '@nestjs/swagger';
import * as fs from 'fs';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() dto: CreateUserDto) {
    return this.usersService.create(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Cập nhật thông tin người dùng' })
  // Nếu chỉ cập nhật JSON bình thường, Swagger sẽ tự nhận diện qua DTO
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }

  // users.controller.ts
  @Post('upload-avatar/:userId')
  @ApiOperation({ summary: 'Upload avatar cho người dùng' })
  @ApiConsumes('multipart/form-data') // Bắt buộc để Swagger hiện nút upload
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          // Tên field này phải khớp với FileInterceptor('file')
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
          const userId = req.params.userId;
          const fileExtName = extname(file.originalname);
          const fileName = `user_${userId}${fileExtName}`;
          const fullPath = join('./src/avatar', fileName);

          // Nếu file đã tồn tại, xóa nó đi trước khi Multer ghi file mới
          if (fs.existsSync(fullPath)) {
            try {
              fs.unlinkSync(fullPath);
            } catch (e) {
              // Đôi khi file bị lock bởi hệ thống, có thể bỏ qua hoặc log lỗi
            }
          }
          callback(null, fileName);
        },
      }),
    }),
  )
  async uploadUserAvatar(
    @Param('userId') userId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new Error('File upload thất bại!');
    }
    const avatarUrl = `/avatar/${file.filename}`;
    await this.usersService.updateAvatar(userId, avatarUrl);
    return {
      message: 'Upload thành công',
      path: avatarUrl,
    };
  }

  // Thêm vào users.controller.ts

  @Patch('avatar/:userId')
  @ApiOperation({ summary: 'Cập nhật avatar người dùng và ghi đè file cũ' })
  @ApiConsumes('multipart/form-data') // 1. Khai báo kiểu dữ liệu là multipart
  @ApiBody({
    // 2. Định nghĩa cấu trúc body cho Swagger
    schema: {
      type: 'object',
      properties: {
        file: {
          // Tên này phải khớp với FileInterceptor('file')
          type: 'string',
          format: 'binary', // binary sẽ kích hoạt ô Upload file trong Swagger
        },
      },
    },
  })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './src/avatar',
        filename: (req, file, callback) => {
          const userId = req.params.userId;
          const fileExtName = extname(file.originalname);
          const fileName = `user_${userId}${fileExtName}`;

          const fullPath = join('./src/avatar', fileName);
          if (fs.existsSync(fullPath)) {
            try {
              fs.unlinkSync(fullPath);
            } catch (err) {
              console.error('Lỗi khi xóa file cũ:', err);
            }
          }
          callback(null, fileName);
        },
      }),
    }),
  )
  async patchAvatar(
    @Param('userId') userId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) throw new BadRequestException('Vui lòng chọn ảnh');
    const avatarPath = `/src/avatar/${file.filename}`;
    return this.usersService.updateAvatar(userId, avatarPath);
  }
}
