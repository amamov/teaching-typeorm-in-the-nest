import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { Test, TestingModule } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import * as bcrypt from 'bcrypt'
import { UserRegisterDTO } from './dtos/user-register.dto'
import { UserEntity } from './users.entity'
import { UsersService } from './users.service'

const mockUserId = 'c1f0e942-af78-4460-b3cc-4b0f6bfc1174'
const mockJwt = 'thisisjwt'

const password = '1205'

const mockUser = {
  id: mockUserId,
  email: 'me@amamov.com',
  username: 'amamov',
  password: bcrypt.hashSync(password, 10),
  isAdmin: false,
}

class MockUsersRepository {
  save = jest.fn().mockResolvedValue(mockUser)

  async findOne(where: { id?: string; email?: string }) {
    if (where?.id === mockUserId) return mockUser
    else if (where?.email === mockUser.email) return mockUser
    else return null
  }
}

const mockJwtService = () => ({
  signAsync: jest.fn().mockResolvedValue(mockJwt),
})

const mockConfigService = () => ({
  get: jest.fn().mockReturnValue('thisissecretkey'),
})

describe('UsersService', () => {
  let usersService: UsersService
  let usersRepository: MockUsersRepository
  let jwtService: JwtService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService, // { provide : UsersService, useClass : UsersService }
        {
          provide: getRepositoryToken(UserEntity),
          useClass: MockUsersRepository,
        },
        {
          provide: JwtService,
          useValue: mockJwtService(),
        },
        {
          provide: ConfigService,
          useValue: mockConfigService(),
        },
      ],
    }).compile()

    usersService = module.get<UsersService>(UsersService)
    jwtService = module.get<JwtService>(JwtService)
    usersRepository = module.get(getRepositoryToken(UserEntity))
  })

  it('UsersService should be defined', () => {
    expect(usersService).toBeDefined()
  })

  describe('registerUser function', () => {
    const newUser: UserRegisterDTO = {
      email: 'new@amamov.com',
      password: '1205',
      username: 'new',
    }
    const existedUser: UserRegisterDTO = {
      email: mockUser.email,
      password: mockUser.password,
      username: mockUser.username,
    }

    it('should be defined', () => {
      expect(usersService.registerUser).toBeDefined()
    })

    it('유저 정보의 이메일은 유일해야 하므로 DB에서 유일성 검사를 한다.', async () => {
      expect(usersRepository.findOne).toBeDefined()
      expect(usersService.registerUser(newUser)).resolves
      await expect(
        usersService.registerUser(existedUser),
      ).rejects.toThrowError()
    })

    it('유저 정보를 인자로 받고 새로운 유저를 생성하고 아무것도 반환하지 않는다.', async () => {
      await expect(usersService.registerUser(newUser)).resolves.toBeUndefined()
    })
  })

  describe('verifyUserAndSignJwt function', () => {
    it('should be defined', () => {
      expect(usersService.verifyUserAndSignJwt).toBeDefined()
    })

    it('jwtService should be defined', () => {
      expect(jwtService.signAsync).toBeDefined()
    })

    it('이메일로 유저를 찾고 없으면 400 에러를 발생시킨다.', async () => {
      try {
        await usersService.verifyUserAndSignJwt(
          'nothing@amamov.com',
          mockUser.password,
        )
        throw new Error('테스팅 에러')
      } catch (error) {
        expect(error.message).toBe('해당하는 이메일은 존재하지 않습니다.')
      }
    })

    it('암호화된 비밀번호를 복호화하여 비교 한다.', async () => {
      try {
        await usersService.verifyUserAndSignJwt(
          mockUser.email,
          mockUser.password,
        )
        throw new Error('테스팅 에러')
      } catch (error) {
        expect(error.message).toBe('로그인에 실패하였습니다.')
      }
      try {
        await usersService.verifyUserAndSignJwt(mockUser.email, password)
      } catch (error) {
        expect(error.message).toBeUndefined()
      }
    })

    it('만일 비밀번호가 다르다면 에러를 발생시킨다.', async () => {
      try {
        await usersService.verifyUserAndSignJwt(mockUser.email, '1205!')
        throw new Error('테스팅 에러')
      } catch (error) {
        expect(error.message).toBe('로그인에 실패하였습니다.')
      }
    })

    it('서명된 JWT와 UserDTO를 반환한다.', async () => {
      try {
        const user = await usersService.verifyUserAndSignJwt(
          mockUser.email,
          password,
        )
        expect(user).toEqual({
          jwt: mockJwt,
          user: mockUser,
        })
      } catch (error) {
        expect(error).toBeUndefined()
      }
    })
  })

  describe('findUserById function', () => {
    it('should be defined', () => {
      expect(usersService.findUserById).toBeDefined()
    })

    it('id로 DB에 존재하는 User를 찾는다.', async () => {
      await expect(usersService.findUserById(mockUserId)).resolves.toEqual(
        mockUser,
      )
    })

    it('id로 DB에 존재하지 않는 User를 찾는 경우, 400 에러를 발생시킨다.', async () => {
      await expect(usersService.findUserById('fakeid')).rejects.toThrowError()
    })
  })
})
