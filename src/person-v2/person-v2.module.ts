import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PersonV2Controller } from './person-v2.controller';
import { PersonV2Service } from './person-v2.service';
import { Person } from '../entities/person.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Person])],
  controllers: [PersonV2Controller],
  providers: [PersonV2Service],
  exports: [PersonV2Service],
})
export class PersonV2Module {}
