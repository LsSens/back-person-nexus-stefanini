import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PersonV1Controller } from './person-v1.controller';
import { PersonV1Service } from './person-v1.service';
import { Person } from '../entities/person.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Person])],
  controllers: [PersonV1Controller],
  providers: [PersonV1Service],
  exports: [PersonV1Service],
})
export class PersonV1Module {}
