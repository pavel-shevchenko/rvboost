import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { PartialType } from '@nestjs/swagger';

import { CrudUserDto } from 'validation';
import { MikroCrudServiceFactory } from '../nestjs-crud';
import { User } from './entity';
import { AuthService } from '../auth';

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
  constructor(
    @Inject(forwardRef(() => AuthService))
    private authService: AuthService
  ) {
    super();
  }

  async create({ data, user }: { data: CrudUserDbDto; user: User }) {
    data.passwordHash = await this.authService.hashPassword(data.password);

    return super.create({ data, user });
  }

  async update({ entity, data }: { entity: User; data: Partial<CrudUserDbDto> }) {
    if (data.password)
      data.passwordHash = await this.authService.hashPassword(data.password);

    return super.update({ entity, data });
  }
}
