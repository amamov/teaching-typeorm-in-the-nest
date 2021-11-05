import { Controller, Get } from '@nestjs/common'

@Controller()
export class AppController {
  @Get()
  getRoot() {
    return 'typeorm in nest, just coding'
  }
}
