import { PartialType } from '@nestjs/swagger';
import { CreateDepartment } from './create-department.dto';

export class UpdateDepartmentDto extends PartialType(CreateDepartment) {}
