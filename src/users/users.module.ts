import { Module } from '@nestjs/common'
import { UsersController } from './users.controller'
import { UserEntity } from './users.entity'
import { PassportModule } from '@nestjs/passport'
import { JwtModule } from '@nestjs/jwt'
import { JwtStrategy } from './jwt/jwt.strategy'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UsersService } from './users.service'

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    PassportModule.register({ defaultStrategy: 'jwt', session: true }),
    JwtModule.register({
      secret: process.env.SECRET_KEY,
      secretOrPrivateKey: process.env.SECRET_KEY,
      signOptions: { expiresIn: '1d' },
    }),
  ],
  providers: [JwtStrategy, UsersService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
