import { PartialType } from '@nestjs/swagger';
import { RegisterDto } from './user-create.dto';

export class UpdateUserDto extends PartialType(RegisterDto) {}
