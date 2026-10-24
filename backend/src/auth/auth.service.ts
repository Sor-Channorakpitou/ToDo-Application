import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as argon2 from 'argon2';
import * as bcrypt from 'bcrypt';
import { createHash, randomUUID } from 'node:crypto';

import { User } from '../users/entities/user.entity.js';
import { Role } from '../users/entities/role.enum.js';
import { RefreshToken } from './entities/refresh-token.entity.js';
import { AuthUser, JwtPayload } from './auth.types.js';
import { SignupDto } from './dto/signup.dto.js';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly users: Repository<User>,

    @InjectRepository(RefreshToken)
    private readonly refreshTokens: Repository<RefreshToken>,

    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) {}

  private hashToken(token: string): string {
    return createHash('sha256').update(token).digest('hex');
  }

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

  async validate(email: string, password: string): Promise<AuthUser> {
    const user = await this.users
      .createQueryBuilder('user')
      .addSelect('user.passwordHash')
      .where('LOWER(user.email) = :email', {
        email: email.trim().toLowerCase(),
      })
      .getOne();

    if (!user || !user.passwordHash) {
      throw new UnauthorizedException('Invalid email or password');
    }

    let isValid = false;
    try {
      isValid = await argon2.verify(user.passwordHash, password);
    } catch {
      // Fallback for any legacy bcrypt hash during migration
      isValid = await bcrypt
        .compare(password, user.passwordHash)
        .catch(() => false);
    }

    if (!isValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    return { id: user.id, role: user.role };
  }

  async issueTokens(user: AuthUser) {
    const payload: JwtPayload = {
      sub: user.id,
      role: user.role,
    };

    const accessToken = await this.jwt.signAsync(payload);

    const refreshToken = await this.jwt.signAsync(
      {
        ...payload,
        jti: randomUUID(),
      },
      {
        secret: this.config.getOrThrow<string>('JWT_REFRESH_SECRET'),
        expiresIn: '7d',
      },
    );

    await this.refreshTokens.save(
      this.refreshTokens.create({
        tokenHash: this.hashToken(refreshToken),
        userId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        revokedAt: null,
      }),
    );

    return { accessToken, refreshToken };
  }

  async useRefresh(token: string | undefined): Promise<AuthUser> {
    if (!token) {
      throw new UnauthorizedException('Refresh token missing');
    }

    let payload: JwtPayload;

    try {
      payload = await this.jwt.verifyAsync<JwtPayload>(token, {
        secret: this.config.getOrThrow<string>('JWT_REFRESH_SECRET'),
      });
    } catch {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    const stored = await this.refreshTokens.findOne({
      where: { tokenHash: this.hashToken(token) },
      relations: { user: true },
    });

    if (
      !stored ||
      stored.revokedAt ||
      stored.expiresAt <= new Date() ||
      stored.userId !== payload.sub
    ) {
      throw new UnauthorizedException('Refresh token revoked or invalid');
    }

    // Rotate: invalidate the old token before issuing another.
    stored.revokedAt = new Date();
    await this.refreshTokens.save(stored);

    return {
      id: stored.user.id,
      role: stored.user.role,
    };
  }

  async revokeAll(userId: string): Promise<void> {
    await this.refreshTokens
      .createQueryBuilder()
      .update(RefreshToken)
      .set({ revokedAt: () => 'CURRENT_TIMESTAMP' })
      .where('"userId" = :userId', { userId })
      .andWhere('"revokedAt" IS NULL')
      .execute();
  }
}