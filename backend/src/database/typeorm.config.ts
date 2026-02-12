import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User } from '../users/users.entity';
import { Department } from 'src/departments/entities/department.entity';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'daongocthong', 
  password: '',         
  database: 'booking_db',
  autoLoadEntities: true,
  entities: [User,Department],
  synchronize: false,
};