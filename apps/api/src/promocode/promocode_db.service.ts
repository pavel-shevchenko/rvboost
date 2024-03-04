import { Injectable } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/postgresql';
import { Promocode } from './entity';

@Injectable()
export class PromocodeDbService {
  constructor(private readonly em: EntityManager) {}

  async activatePromocode(code: string) {
    const promocode = await this.em.findOne(Promocode, {
      code,
      isActivated: false
    });
    if (!promocode) return null;

    promocode.isActivated = true;
    promocode.activationDate = new Date();
    await this.em.persistAndFlush(promocode);

    return promocode;
  }

  async getPromocode(code: string) {
    return this.em.findOne(Promocode, { code });
  }
}
