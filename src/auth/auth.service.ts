import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/types';
import { AuthPayload } from './auth.module';
import { EmittedToken } from './types';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  deletePassword(user: User): Omit<User, 'passwordHash'> {
    if (user) {
      delete user.passwordHash;

      return user;
    }

    return null;
  }

  emitToken(user: User): EmittedToken {
    const payload: AuthPayload = { username: user.username, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(username: string, password: string): Promise<EmittedToken> {
    const user = await this.usersService.createOne(username, password);

    return this.emitToken(user);
  }

  async validateUser(id: number): Promise<Omit<User, 'passwordHash'>> {
    const user = await this.usersService.findOne(id);
    return this.deletePassword(user);
  }

  async auth(username: string, password: string): Promise<EmittedToken> {
    const user = await this.usersService.findByName(username);
    const isValidPassword = bcrypt.compareSync(user.passwordHash, password);

    if (!user || !isValidPassword) {
      throw new HttpException(
        'Неверное имя пользователя или пароль.',
        HttpStatus.UNAUTHORIZED,
      );
    }

    return this.emitToken(user);
  }
}
