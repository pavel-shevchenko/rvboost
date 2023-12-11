import { Injectable } from '@nestjs/common';
import { PartialType } from '@nestjs/swagger';

import { CrudUserDto } from 'validation';
import { MikroCrudServiceFactory } from '../nestjs-crud';
import { User } from './entity';
import { hashPassword } from '../common/helpers';

class CrudUserDbDto extends CrudUserDto {
  passwordHash: string;
}

const CRUDService = new MikroCrudServiceFactory({
  entity: User,
  dto: {
    create: CrudUserDbDto,
    update: PartialType(CrudUserDbDto)
  }
}).product;

@Injectable()
export class UserCrudService extends CRUDService {
  async create({ data, user }: { data: CrudUserDbDto; user: User }) {
    const passwordHash = await hashPassword(data.password);

    return await super.create({
      data: { ...data, passwordHash },
      user
    });
  }

  async update({ entity, data }: { entity: User; data: Partial<CrudUserDbDto> }) {
    if (data.password) data.passwordHash = await hashPassword(data.password);

    return await super.update({ entity, data });
  }
}
