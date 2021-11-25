import {
  Body,
  Controller,
  Get,
  Logger,
  Post,
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import { Response } from 'express'
import { UsersService } from './users.service'
import { UserLogInDTO } from './dtos/user-login.dto'
import { UserRegisterDTO } from './dtos/user-register.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { UserEntity } from './users.entity'
import { Repository } from 'typeorm'
import { OnlyPrivateInterceptor } from '../common/interceptors/only-private.interceptor'
import { CurrentUser } from '../common/decorators/current-user.decorator'
import { UserDTO } from './dtos/user.dto'
import { JwtAuthGuard } from './jwt/jwt.guard'

@Controller('users')
export class UsersController {
  private readonly logger = new Logger(UsersController.name)

  constructor(
    private readonly usersService: UsersService,
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
  ) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(OnlyPrivateInterceptor)
  async getCurrentUser(@CurrentUser() currentUser: UserDTO) {
    return currentUser
  }

  @Post()
  async signUp(@Body() userRegisterDTO: UserRegisterDTO) {
    return await this.usersService.registerUser(userRegisterDTO)
  }

  @Post('login')
  async logIn(
    @Body() userLoginDTO: UserLogInDTO,
    @Res({ passthrough: true }) response: Response,
  ) {
    const { jwt, user } = await this.usersService.verifyUserAndSignJwt(
      userLoginDTO.email,
      userLoginDTO.password,
    )
    response.cookie('jwt', jwt, { httpOnly: true })
    return user
  }

  @Post('logout')
  async logOut(@Res({ passthrough: true }) response: Response) {
    response.clearCookie('jwt')
  }
}
