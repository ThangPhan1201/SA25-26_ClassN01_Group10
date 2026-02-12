// src/notifications/notifications.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from './notifications.entity';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepo: Repository<Notification>,
  ) {}

  // Hàm để các module khác gọi
  async createNotification(data: Partial<Notification>) {
    const notif = this.notificationRepo.create(data);
    return await this.notificationRepo.save(notif);
  }

  // Lấy danh sách thông báo của user
  async findAllByUser(userId: string) {
    return await this.notificationRepo.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  // Đánh dấu đã đọc
  async markAsRead(id: string) {
    const notif = await this.notificationRepo.findOneBy({ id });
    if (!notif) throw new NotFoundException('Notification not found');
    notif.isRead = true;
    return await this.notificationRepo.save(notif);
  }
}
