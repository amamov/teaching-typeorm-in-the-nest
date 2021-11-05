require('dotenv/config')
/* eslint @typescript-eslint/no-var-requires: 0 */
const { SnakeNamingStrategy } = require('typeorm-naming-strategies')

module.exports = {
  type: 'postgres',
  database: process.env.DB_NAME,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  synchronize: false,
  autoLoadEntities: true,
  keepConnectionAlive: true,
  logging: true,
  namingStrategy: new SnakeNamingStrategy(),
  // entities: [UserEntity],
  entities: ['src/**/*.entity.ts'],
  migrations: ['migrations/**/*.ts'],
  cli: { migrationsDir: 'migrations' },
  seeds: ['src/seeds/**/*.ts'],
}
