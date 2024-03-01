import { ForbiddenException, Injectable } from '@nestjs/common';
import { FastifyReply } from 'fastify';

import { OrganizationDbService } from '../organization';
import { getReviewFormLink } from 'business';
import { EventEnum, RedirectPlatformEnum } from 'typing';
import { EventCrudService } from '../analytics';
import { Card } from '../card/entity';

@Injectable()
export class LinkShorterService {
  constructor(
    private readonly eventCrudService: EventCrudService,
    private readonly orgDbService: OrganizationDbService
  ) {}

  async redirect(response: FastifyReply, shortLinkCode: string) {
    if (!shortLinkCode) throw new ForbiddenException();
    const organization =
      await this.orgDbService.populatedOrgByShortLinkCode(shortLinkCode);

    const location = organization?.locations[0];
    if (!location) throw new ForbiddenException();

    // Если у QR кода включена опция перехвата отзывов - переадресуем пользователя на сервис перехвата отзывов
    const curDatetime = new Date();
    // Possible thanks to putClientToOrg->ForbiddenException('Client already assigned with other organization') in OrganizationCrudService
    for (const subscription of organization?.subscriptions || []) {
      if (
        new Date(subscription?.validUntil) > curDatetime &&
        location.card.isReviewInterception &&
        organization?.feedbackSettings
      ) {
        return response.redirect(307, getReviewFormLink(shortLinkCode));
      }
    }

    // Если у QR кода включена опция переадресации по кастомной ссылке - то переадресуем пользователя на кастомную ссылку из QR
    if (location.card.isCustomLinkRedirect) {
      let customLink = location.linkDefault;
      if (location.card.linkCustom && location.card.isCustomLinkRedirect)
        customLink = location.card.linkCustom;

      return this.redirectExternalLink(response, location.card, customLink);
    }

    // Если у QR кода выбрана какая-то платформа, переадресуем пользователя по ссылке из компании на эту платформу, иначе переадресуем на Default из компании
    switch (location.card.redirectPlatform) {
      case RedirectPlatformEnum.google:
        return this.redirectExternalLink(
          response,
          location.card,
          location.linkGoogle
        );
      case RedirectPlatformEnum.trustpilot:
        return this.redirectExternalLink(
          response,
          location.card,
          location.linkTrustPilot
        );
      default:
        return this.redirectExternalLink(
          response,
          location.card,
          location.linkDefault
        );
    }
  }

  async redirectExternalLink(response: FastifyReply, card: Card, link: string) {
    this.eventCrudService.create({
      data: { card: card.id, eventType: EventEnum.followExternalLink }
    });
    return response.redirect(307, link);
  }
}
