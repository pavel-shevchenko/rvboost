import { BadRequestException, Injectable } from '@nestjs/common';
import { EventCrudService } from './event_crud.service';
import { EventEnumType } from 'typing';
import { CardDbService } from '../card';

@Injectable()
export class AnalyticsService {
  constructor(
    private readonly eventCrudService: EventCrudService,
    private readonly cardDbService: CardDbService
  ) {}

  async newEvent(shortLinkCode: string, eventType: EventEnumType) {
    const card = await this.cardDbService.getByShortLinkCode(shortLinkCode);
    if (!card) throw new BadRequestException();

    await this.eventCrudService.create({
      data: { card: card.id, eventType }
    });
  }
}
