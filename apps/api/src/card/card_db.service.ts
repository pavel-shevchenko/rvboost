import { Injectable } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/postgresql';
import { Card } from './entity';

@Injectable()
export class CardDbService {
  constructor(private readonly em: EntityManager) {}

  async getByShortLinkCode(shortLinkCode: string) {
    return this.em.findOne(Card, { shortLinkCode }, { populate: ['location'] });
  }
}
