import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { AuthService } from '../auth';
import { User } from './entity';
import { EntityManager } from '@mikro-orm/postgresql';
import { RequiredEntityData } from '@mikro-orm/core';

@Injectable()
export class UserDbService {
  constructor(
    @Inject(forwardRef(() => AuthService))
    private authService: AuthService,
    private readonly em: EntityManager
  ) {}

  async saveUser(user: User) {
    await this.em.persistAndFlush(user);

    return user;
  }

  async createUserByLocalDto(params: RequiredEntityData<User>) {
    const user: User = this.em.create(User, params);
    await this.em.persistAndFlush(user);

    return user;
  }

  getPassportUserById(id: number): Promise<User> {
    return this.em.findOne(User, { id });
  }

  async getPassportUserByEmail(email: string): Promise<User> {
    return this.em.findOne(User, { email });
  }

  private getPassportUserIncludes() {
    return [];
  }
}
