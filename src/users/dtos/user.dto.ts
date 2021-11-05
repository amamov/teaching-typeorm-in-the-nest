import { OmitType } from '@nestjs/swagger'
import { UserEntity } from '../users.entity'

export class UserDTO extends OmitType(UserEntity, ['password'] as const) {}
