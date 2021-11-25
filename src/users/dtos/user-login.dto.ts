import { PickType } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'
import { UserEntity } from '../users.entity'

export class UserLogInDTO extends PickType(UserEntity, ['email'] as const) {
  @IsString()
  @IsNotEmpty({ message: '비밀번호를 작성해주세요.' })
  password: string
}
