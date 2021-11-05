import { PickType } from '@nestjs/swagger'
import { UserEntity } from '../users.entity'

export class UserRegisterDTO extends PickType(UserEntity, [
  'email',
  'username',
  'password',
] as const) {}
