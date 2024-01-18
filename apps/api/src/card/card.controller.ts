import { Controller, Get, Param, Res, UseGuards } from '@nestjs/common';
import { FastifyReply } from 'fastify';

import { MikroCrudControllerFactory } from '../nestjs-crud';
import { CardCrudService } from './card_crud.service';
import { JwtAuthGuard } from '../auth/guards';
import { CardService } from './card.service';

const CRUDController = new MikroCrudControllerFactory<CardCrudService>({
  service: CardCrudService,
  actions: ['query', 'create', 'retrieve', 'update', 'destroy'],
  lookup: { field: 'id' },
  query: {
    limit: { max: 200, default: 50 },
    offset: { max: 10_000 }
  }
}).applyDecoratorToActions(UseGuards(JwtAuthGuard)).product;

@Controller('card')
export class CardController extends CRUDController {
  constructor(private readonly cardService: CardService) {
    super();
  }

  @Get('get-qr-code-image/:shortLinkCode')
  async getQrCodeImage(
    @Res() response: FastifyReply,
    @Param('shortLinkCode') shortLinkCode: string
  ) {
    return this.cardService.getQrCodeImage(response, shortLinkCode);
  }
}
