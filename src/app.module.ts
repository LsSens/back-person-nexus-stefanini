import { Module, OnModuleInit } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { PersonV1Module } from './person-v1/person-v1.module';
import { PersonV2Module } from './person-v2/person-v2.module';
import { Person } from './entities/person.entity';
import { User } from './entities/user.entity';
import { ConfigModule } from './config/config.module';
import { S3DatabaseService } from './config/s3-database.service';

@Module({
  imports: [
    NestConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: process.env.NODE_ENV === 'production' 
        ? '/tmp/h2db.db' 
        : (process.env.DATABASE_NAME || 'h2db.db'),
      entities: [Person, User],
      synchronize: true,
      logging: process.env.NODE_ENV === 'development',
    }),
    ConfigModule,
    AuthModule,
    PersonV1Module,
    PersonV2Module,
  ],
})
export class AppModule implements OnModuleInit {
  constructor(private readonly s3DatabaseService: S3DatabaseService) {}

  async onModuleInit() {
    // Garantir que o banco existe antes de inicializar o TypeORM
    await this.s3DatabaseService.ensureDatabaseExists();
  }
}
