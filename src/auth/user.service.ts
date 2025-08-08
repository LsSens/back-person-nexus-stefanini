import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UserService implements OnModuleInit {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async onModuleInit() {
    await this.createDefaultUsers();
  }

  async findByUsername(username: string): Promise<User | undefined> {
    return this.userRepository.findOne({ 
      where: { username, ativo: true } 
    });
  }

  async findById(id: number): Promise<User | undefined> {
    return this.userRepository.findOne({ 
      where: { id, ativo: true } 
    });
  }

  private async createDefaultUsers(): Promise<void> {
    const existingAdmin = await this.userRepository.findOne({ 
      where: { username: 'admin' } 
    });

    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      const adminUser = this.userRepository.create({
        username: 'admin',
        password: hashedPassword,
        email: 'admin@sistema.com',
        ativo: true,
      });
      await this.userRepository.save(adminUser);
    }

    const existingTest = await this.userRepository.findOne({ 
      where: { username: 'teste' } 
    });

    if (!existingTest) {
      const hashedPassword = await bcrypt.hash('teste123', 10);
      const testUser = this.userRepository.create({
        username: 'teste',
        password: hashedPassword,
        email: 'teste@sistema.com',
        ativo: true,
      });
      await this.userRepository.save(testUser);
    }
  }
}
