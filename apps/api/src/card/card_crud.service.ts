import { Injectable } from '@nestjs/common';
import { PartialType } from '@nestjs/swagger';

import { MikroCrudServiceFactory } from '../nestjs-crud';
import { CrudCardDto } from 'validation';
import { Card } from './entity';
import { User } from '../user/entity';
import { CardService } from './card.service';
import { generateShortLinkCode } from '../common/helpers/common';
import { getShortLink } from 'business';

class CrudCardDbDto extends CrudCardDto {
  shortLinkCode?: string;
}

const CRUDService = new MikroCrudServiceFactory({
  entity: Card,
  dto: {
    create: CrudCardDbDto,
    update: PartialType(CrudCardDbDto)
  }
}).product;

@Injectable()
export class CardCrudService extends CRUDService {
  constructor(private readonly cardService: CardService) {
    super();
  }

  async create({ data, user }: { data: CrudCardDbDto; user: User }) {
    const shortLinkCode = generateShortLinkCode();
    const card = await super.create({ data: { ...data, shortLinkCode }, user });

    await this.cardService.generateQR(shortLinkCode, getShortLink(shortLinkCode));

    return card;
  }
}
