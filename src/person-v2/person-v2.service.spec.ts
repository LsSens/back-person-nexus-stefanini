import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { PersonV2Service } from './person-v2.service';
import { Person, SexoEnum } from '../entities/person.entity';
import { CreatePersonV2Dto } from '../dto/create-person-v2.dto';

describe('PersonV2Service', () => {
  let service: PersonV2Service;
  let repository: Repository<Person>;

  const mockRepository = {
    findOne: jest.fn(),
    findAndCount: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    remove: jest.fn(),
    find: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PersonV2Service,
        {
          provide: getRepositoryToken(Person),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<PersonV2Service>(PersonV2Service);
    repository = module.get<Repository<Person>>(getRepositoryToken(Person));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const createPersonDto: CreatePersonV2Dto = {
      nome: 'João Silva',
      sexo: SexoEnum.MASCULINO,
      email: 'joao@email.com',
      dataDeNascimento: '1990-01-15',
      naturalidade: 'São Paulo',
      nacionalidade: 'Brasileira',
      cpf: '12345678901',
      endereco: 'Rua das Flores, 123',
    };

    it('should create a person successfully with address', async () => {
      const mockPerson = { id: 1, ...createPersonDto };

      mockRepository.findOne.mockResolvedValue(null);
      mockRepository.create.mockReturnValue(mockPerson);
      mockRepository.save.mockResolvedValue(mockPerson);

      const result = await service.create(createPersonDto);

      expect(result).toEqual(mockPerson);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { cpf: createPersonDto.cpf }
      });
      expect(mockRepository.create).toHaveBeenCalledWith(createPersonDto);
      expect(mockRepository.save).toHaveBeenCalledWith(mockPerson);
    });

    it('should throw ConflictException when CPF already exists', async () => {
      const existingPerson = { id: 2, cpf: '12345678901' };

      mockRepository.findOne.mockResolvedValue(existingPerson);

      await expect(service.create(createPersonDto)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('findAll', () => {
    it('should return paginated results including address in search', async () => {
      const mockData = [{ id: 1, nome: 'João', endereco: 'Rua das Flores' }];
      mockRepository.findAndCount.mockResolvedValue([mockData, 1]);

      const result = await service.findAll(1, 10, 'Flores');

      expect(result).toEqual({
        data: mockData,
        total: 1,
        page: 1,
        totalPages: 1,
      });
    });
  });

  describe('findByAddress', () => {
    it('should find people by address', async () => {
      const mockPeople = [
        { id: 1, nome: 'João', endereco: 'Rua das Flores, 123' },
        { id: 2, nome: 'Maria', endereco: 'Rua das Flores, 456' },
      ];

      mockRepository.find.mockResolvedValue(mockPeople);

      const result = await service.findByAddress('Flores');

      expect(result).toEqual(mockPeople);
      expect(mockRepository.find).toHaveBeenCalledWith({
        where: { endereco: expect.anything() }
      });
    });
  });

  describe('update', () => {
    it('should update a person successfully', async () => {
      const mockPerson = { 
        id: 1, 
        nome: 'João', 
        cpf: '12345678901',
        endereco: 'Rua Antiga, 123'
      };
      const updateDto = { endereco: 'Rua Nova, 456' };
      const updatedPerson = { ...mockPerson, ...updateDto };

      mockRepository.findOne.mockResolvedValue(mockPerson);
      mockRepository.save.mockResolvedValue(updatedPerson);

      const result = await service.update(1, updateDto);

      expect(result).toEqual(updatedPerson);
    });
  });

  describe('remove', () => {
    it('should remove a person successfully', async () => {
      const mockPerson = { 
        id: 1, 
        nome: 'João',
        endereco: 'Rua das Flores, 123'
      };
      
      mockRepository.findOne.mockResolvedValue(mockPerson);
      mockRepository.remove.mockResolvedValue(mockPerson);

      await service.remove(1);

      expect(mockRepository.remove).toHaveBeenCalledWith(mockPerson);
    });
  });
});
