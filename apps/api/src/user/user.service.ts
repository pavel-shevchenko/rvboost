import { RequiredEntityData } from '@mikro-orm/core';
import { EntityManager } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';
import { User } from './entity';

@Injectable()
export class UserService {
  constructor(private readonly em: EntityManager) {}

  async createUser(params: RequiredEntityData<User>) {
    const user = this.em.create(User, params);

    await this.em.persistAndFlush(user);

    return user.id;
  }

  async retrieveUser(id: number) {
    return this.em.findOne(User, id);
  }
}
