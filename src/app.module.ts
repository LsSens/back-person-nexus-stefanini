import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { PersonV1Module } from './person-v1/person-v1.module';
import { PersonV2Module } from './person-v2/person-v2.module';
import { Person } from './entities/person.entity';
import { User } from './entities/user.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: process.env.DATABASE_NAME || 'database.db',
      entities: [Person, User],
      synchronize: true,
      logging: process.env.NODE_ENV === 'development',
    }),
    AuthModule,
    PersonV1Module,
    PersonV2Module,
  ],
})
export class AppModule {}
