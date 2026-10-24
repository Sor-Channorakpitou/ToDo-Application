import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as argon2 from 'argon2';

import { User } from './entities/user.entity.js';
import { Role } from './entities/role.enum.js';
import { SignupDto } from './dto/signup.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly users: Repository<User>,
  ) {}

  async signup(dto: SignupDto) {
    const email = dto.email.trim().toLowerCase();

    const exists = await this.users.findOne({ where: { email } });
    if (exists) {
      throw new ConflictException('Email already in use');
    }

    const passwordHash = await argon2.hash(dto.password);

    const user = this.users.create({
      email,
      passwordHash,
      role: Role.USER,
    });

    const saved = await this.users.save(user);

    return {
      id: saved.id,
      email: saved.email,
      role: saved.role,
    };
  }

  async findAll() {
    return this.users.find({
      select: { id: true, email: true, role: true },
      order: { email: 'ASC' },
    });
  }

  async findById(id: string) {
    const user = await this.users.findOne({
      where: { id },
      select: { id: true, email: true, role: true },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  async findByEmail(email: string) {
    return this.users.findOne({
      where: { email: email.trim().toLowerCase() },
    });
  }

  async update(id: string, dto: UpdateUserDto) {
    const user = await this.findById(id);
    Object.assign(user, dto);
    const saved = await this.users.save(user);
    return {
      id: saved.id,
      email: saved.email,
      role: saved.role,
    };
  }

  async remove(id: string) {
    const result = await this.users.delete(id);
    if (!result.affected) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return { message: `User ${id} removed successfully` };
  }
}
