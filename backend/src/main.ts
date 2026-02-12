import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common/pipes/validation.pipe';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.enableCors({
    origin: '*', // Cho phép tất cả các nguồn (hoặc điền http://127.0.0.1:5500 nếu bạn dùng Live Server)
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  app.useStaticAssets(join(process.cwd(), 'src/avatar'), {
    prefix: '/avatar/', 
  });

  const config = new DocumentBuilder()
    .setTitle('Hệ thống Đặt lịch khám Online')
    .setDescription('Tài liệu API cho dự án đặt lịch')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.setGlobalPrefix('api');

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000, '0.0.0.0');
  console.log(`Ứng dụng đang chạy tại: http://localhost:3000/api`);
}
bootstrap();
