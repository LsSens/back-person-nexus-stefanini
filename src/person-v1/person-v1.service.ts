import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Person } from '../entities/person.entity';
import { CreatePersonV1Dto } from '../dto/create-person-v1.dto';
import { UpdatePersonV1Dto } from '../dto/update-person-v1.dto';

@Injectable()
export class PersonV1Service {
  constructor(
    @InjectRepository(Person)
    private personRepository: Repository<Person>,
  ) {}

  async create(createPersonDto: CreatePersonV1Dto): Promise<Person> {
    const existingPerson = await this.personRepository.findOne({
      where: { cpf: createPersonDto.cpf }
    });

    if (existingPerson) {
      throw new ConflictException('CPF já cadastrado no sistema');
    }

    const person = this.personRepository.create(createPersonDto);
    return await this.personRepository.save(person);
  }

  async findAll(page = 1, limit = 10, search?: string): Promise<{
    data: Person[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const skip = (page - 1) * limit;
    
    let whereCondition = {};
    if (search) {
      whereCondition = [
        { nome: Like(`%${search}%`) },
        { email: Like(`%${search}%`) },
        { cpf: Like(`%${search}%`) },
        { naturalidade: Like(`%${search}%`) },
        { nacionalidade: Like(`%${search}%`) },
      ];
    }

    const [data, total] = await this.personRepository.findAndCount({
      where: whereCondition,
      skip,
      take: limit,
      order: { dataCriacao: 'DESC' },
    });

    return {
      data,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: number): Promise<Person> {
    const person = await this.personRepository.findOne({
      where: { id }
    });

    if (!person) {
      throw new NotFoundException(`Pessoa com ID ${id} não encontrada`);
    }

    return person;
  }

  async update(id: number, updatePersonDto: UpdatePersonV1Dto): Promise<Person> {
    const person = await this.findOne(id);

    if (updatePersonDto.cpf && updatePersonDto.cpf !== person.cpf) {
      const existingPerson = await this.personRepository.findOne({
        where: { cpf: updatePersonDto.cpf }
      });

      if (existingPerson) {
        throw new ConflictException('CPF já cadastrado no sistema');
      }
    }

    Object.assign(person, updatePersonDto);
    return await this.personRepository.save(person);
  }

  async remove(id: number): Promise<void> {
    const person = await this.findOne(id);
    await this.personRepository.remove(person);
  }

  async findByCpf(cpf: string): Promise<Person | null> {
    return await this.personRepository.findOne({
      where: { cpf: cpf.replace(/\D/g, '') }
    });
  }
}
