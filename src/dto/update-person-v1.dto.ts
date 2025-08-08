import { PartialType } from '@nestjs/swagger';
import { CreatePersonV1Dto } from './create-person-v1.dto';

export class UpdatePersonV1Dto extends PartialType(CreatePersonV1Dto) {}
