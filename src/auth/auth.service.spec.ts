import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { UserService } from './user.service';
import * as bcrypt from 'bcryptjs';

jest.mock('bcryptjs');

describe('AuthService', () => {
  let service: AuthService;
  let userService: UserService;
  let jwtService: JwtService;

  const mockUserService = {
    findByUsername: jest.fn(),
    findById: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UserService, useValue: mockUserService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUser', () => {
    it('should return user data without password when credentials are valid', async () => {
      const mockUser = {
        id: 1,
        username: 'test',
        password: 'hashedPassword',
        email: 'test@test.com',
      };

      mockUserService.findByUsername.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await service.validateUser('test', 'password');

      expect(result).toEqual({
        id: 1,
        username: 'test',
        email: 'test@test.com',
      });
    });

    it('should return null when user not found', async () => {
      mockUserService.findByUsername.mockResolvedValue(null);

      const result = await service.validateUser('test', 'password');

      expect(result).toBeNull();
    });

    it('should return null when password is invalid', async () => {
      const mockUser = {
        id: 1,
        username: 'test',
        password: 'hashedPassword',
        email: 'test@test.com',
      };

      mockUserService.findByUsername.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      const result = await service.validateUser('test', 'wrongPassword');

      expect(result).toBeNull();
    });
  });

  describe('login', () => {
    it('should return access token', async () => {
      const mockUser = { id: 1, username: 'test' };
      mockJwtService.sign.mockReturnValue('token123');

      const result = await service.login(mockUser);

      expect(result).toEqual({
        access_token: 'token123',
        token_type: 'Bearer',
        expires_in: 86400,
      });
    });
  });

  describe('validateToken', () => {
    it('should return user when token is valid', async () => {
      const mockUser = { id: 1, username: 'test', ativo: true };
      mockUserService.findById.mockResolvedValue(mockUser);

      const result = await service.validateToken({ sub: 1 });

      expect(result).toEqual(mockUser);
    });

    it('should throw UnauthorizedException when user not found', async () => {
      mockUserService.findById.mockResolvedValue(null);

      await expect(service.validateToken({ sub: 1 })).rejects.toThrow();
    });

    it('should throw UnauthorizedException when user is inactive', async () => {
      const mockUser = { id: 1, username: 'test', ativo: false };
      mockUserService.findById.mockResolvedValue(mockUser);

      await expect(service.validateToken({ sub: 1 })).rejects.toThrow();
    });
  });
});
