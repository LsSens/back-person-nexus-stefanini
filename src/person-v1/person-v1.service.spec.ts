import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { PersonV1Service } from './person-v1.service';
import { Person, SexoEnum } from '../entities/person.entity';
import { CreatePersonV1Dto } from '../dto/create-person-v1.dto';

describe('PersonV1Service', () => {
  let service: PersonV1Service;
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
        PersonV1Service,
        {
          provide: getRepositoryToken(Person),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<PersonV1Service>(PersonV1Service);
    repository = module.get<Repository<Person>>(getRepositoryToken(Person));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const createPersonDto: CreatePersonV1Dto = {
      nome: 'João Silva',
      sexo: SexoEnum.MASCULINO,
      email: 'joao@email.com',
      dataDeNascimento: '1990-01-15',
      naturalidade: 'São Paulo',
      nacionalidade: 'Brasileira',
      cpf: '12345678901',
    };

    it('should create a person successfully', async () => {
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
    it('should return paginated results', async () => {
      const mockData = [{ id: 1, nome: 'João' }];
      mockRepository.findAndCount.mockResolvedValue([mockData, 1]);

      const result = await service.findAll(1, 10);

      expect(result).toEqual({
        data: mockData,
        total: 1,
        page: 1,
        totalPages: 1,
      });
    });

    it('should return paginated results with search', async () => {
      const mockData = [{ id: 1, nome: 'João' }];
      mockRepository.findAndCount.mockResolvedValue([mockData, 1]);

      const result = await service.findAll(1, 10, 'João');

      expect(result).toEqual({
        data: mockData,
        total: 1,
        page: 1,
        totalPages: 1,
      });
    });
  });

  describe('findOne', () => {
    it('should return a person', async () => {
      const mockPerson = { id: 1, nome: 'João' };
      mockRepository.findOne.mockResolvedValue(mockPerson);

      const result = await service.findOne(1);

      expect(result).toEqual(mockPerson);
    });

    it('should throw NotFoundException when person not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a person successfully', async () => {
      const mockPerson = { id: 1, nome: 'João', cpf: '12345678901' };
      const updateDto = { nome: 'João Silva' };
      const updatedPerson = { ...mockPerson, ...updateDto };

      mockRepository.findOne.mockResolvedValue(mockPerson);
      mockRepository.save.mockResolvedValue(updatedPerson);

      const result = await service.update(1, updateDto);

      expect(result).toEqual(updatedPerson);
    });

    it('should throw ConflictException when updating to existing CPF', async () => {
      const mockPerson = { id: 1, nome: 'João', cpf: '12345678901' };
      const existingPerson = { id: 2, cpf: '99999999999' };
      const updateDto = { cpf: '99999999999' };

      mockRepository.findOne
        .mockResolvedValueOnce(mockPerson)
        .mockResolvedValueOnce(existingPerson);

      await expect(service.update(1, updateDto)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('remove', () => {
    it('should remove a person successfully', async () => {
      const mockPerson = { id: 1, nome: 'João' };
      mockRepository.findOne.mockResolvedValue(mockPerson);
      mockRepository.remove.mockResolvedValue(mockPerson);

      await service.remove(1);

      expect(mockRepository.remove).toHaveBeenCalledWith(mockPerson);
    });
  });

  describe('findByCpf', () => {
    it('should find person by CPF', async () => {
      const mockPerson = { id: 1, cpf: '12345678901' };
      mockRepository.findOne.mockResolvedValue(mockPerson);

      const result = await service.findByCpf('123.456.789-01');

      expect(result).toEqual(mockPerson);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { cpf: '12345678901' }
      });
    });
  });
});
