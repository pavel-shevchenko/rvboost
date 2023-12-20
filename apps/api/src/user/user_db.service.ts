import { Injectable } from '@nestjs/common';
import { User } from './entity';
import { EntityManager } from '@mikro-orm/postgresql';
import { RequiredEntityData } from '@mikro-orm/core';

@Injectable()
export class UserDbService {
  constructor(private readonly em: EntityManager) {}

  async createUserByRequiredEntityDto(data: RequiredEntityData<User>) {
    const user: User = this.em.create<User>(User, data);
    await this.em.persistAndFlush(user);

    return user;
  }

  async saveUser(user: User) {
    await this.em.persistAndFlush(user);

    return user;
  }

  async retrieveUser(id: number): Promise<User> {
    return this.em.findOne(
      User,
      { id },
      { populate: this.getPassportUserPopulates() }
    );
  }

  getPassportUserById(id: number): Promise<User> {
    return this.retrieveUser(id);
  }

  async getPassportUserByEmail(email: string): Promise<User> {
    return this.em.findOne(
      User,
      { email },
      { populate: this.getPassportUserPopulates() }
    );
  }

  getPassportUserPopulates = () => [];
}
