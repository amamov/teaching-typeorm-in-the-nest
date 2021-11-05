import { PickType } from '@nestjs/swagger'
import { UserEntity } from '../users.entity'

export class UserLogInDTO extends PickType(UserEntity, [
  'email',
  'password',
] as const) {}
