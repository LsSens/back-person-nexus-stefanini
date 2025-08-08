import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

export enum SexoEnum {
  MASCULINO = 'masculino',
  FEMININO = 'feminino',
  OUTRO = 'outro',
}

@Entity('pessoas')
export class Person {
  @ApiProperty({ description: 'ID único da pessoa' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'Nome completo da pessoa' })
  @Column({ length: 200 })
  nome: string;

  @ApiProperty({ 
    description: 'Sexo da pessoa',
    enum: SexoEnum,
    required: false 
  })
  @Column({ 
    type: 'varchar',
    enum: SexoEnum,
    nullable: true 
  })
  sexo?: SexoEnum;

  @ApiProperty({ 
    description: 'Email da pessoa',
    required: false 
  })
  @Column({ length: 100, nullable: true })
  email?: string;

  @ApiProperty({ description: 'Data de nascimento' })
  @Column({ type: 'date' })
  dataDeNascimento: string;

  @ApiProperty({ 
    description: 'Naturalidade da pessoa',
    required: false 
  })
  @Column({ length: 100, nullable: true })
  naturalidade?: string;

  @ApiProperty({ 
    description: 'Nacionalidade da pessoa',
    required: false 
  })
  @Column({ length: 100, nullable: true })
  nacionalidade?: string;

  @ApiProperty({ description: 'CPF da pessoa (único)' })
  @Column({ length: 14, unique: true })
  cpf: string;

  @ApiProperty({ 
    description: 'Endereço da pessoa (obrigatório na v2)',
    required: false 
  })
  @Column({ length: 300, nullable: true })
  endereco?: string;

  @ApiProperty({ description: 'Data de criação do registro' })
  @CreateDateColumn()
  dataCriacao: Date;

  @ApiProperty({ description: 'Data da última atualização' })
  @UpdateDateColumn()
  dataAtualizacao: Date;
}
