import { IsString, IsEmail, IsOptional, IsEnum, IsNotEmpty, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsCpf } from '../common/validators/cpf.validator';
import { IsValidBirthDate } from '../common/validators/date.validator';
import { SexoEnum } from '../entities/person.entity';

export class CreatePersonV1Dto {
  @ApiProperty({ 
    description: 'Nome completo da pessoa',
    example: 'João Silva Santos'
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  nome: string;

  @ApiProperty({ 
    description: 'Sexo da pessoa',
    enum: SexoEnum,
    required: false,
    example: SexoEnum.MASCULINO
  })
  @IsOptional()
  @IsEnum(SexoEnum)
  sexo?: SexoEnum;

  @ApiProperty({ 
    description: 'Email da pessoa',
    required: false,
    example: 'joao@email.com'
  })
  @IsOptional()
  @IsEmail()
  @MaxLength(100)
  email?: string;

  @ApiProperty({ 
    description: 'Data de nascimento (YYYY-MM-DD)',
    example: '1990-01-15'
  })
  @IsNotEmpty()
  @IsValidBirthDate()
  dataDeNascimento: string;

  @ApiProperty({ 
    description: 'Naturalidade da pessoa',
    required: false,
    example: 'São Paulo, SP'
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  naturalidade?: string;

  @ApiProperty({ 
    description: 'Nacionalidade da pessoa',
    required: false,
    example: 'Brasileira'
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  nacionalidade?: string;

  @ApiProperty({ 
    description: 'CPF da pessoa (somente números ou formatado)',
    example: '12345678901'
  })
  @IsString()
  @IsNotEmpty()
  @IsCpf()
  @Transform(({ value }) => value.replace(/\D/g, ''))
  cpf: string;

  @ApiProperty({ 
    description: 'Endereço da pessoa (opcional na v1)',
    required: false,
    example: 'Rua das Flores, 123, Centro, São Paulo - SP'
  })
  @IsOptional()
  @IsString()
  @MaxLength(300)
  endereco?: string;
}
