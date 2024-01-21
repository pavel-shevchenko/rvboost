import { ForbiddenException, Injectable } from '@nestjs/common';
import { FastifyReply } from 'fastify';

import { OrganizationDbService } from '../organization';
import { getReviewFormLink } from 'business';
import { RedirectPlatformEnum } from 'typing';

@Injectable()
export class LinkShorterService {
  constructor(private readonly organizationDbService: OrganizationDbService) {}

  async redirect(response: FastifyReply, shortLinkCode: string) {
    if (!shortLinkCode) throw new ForbiddenException();
    const organization =
      await this.organizationDbService.populatedOrgByShortLinkCode(shortLinkCode);
    const location = organization?.locations[0];
    if (!location) throw new ForbiddenException();

    // Если у QR кода включена опция перехвата отзывов - переадресуем пользователя на сервис перехвата отзывов
    const curDatetime = new Date();
    // Possible thanks to putClientToOrg->ForbiddenException('Client already assigned with other organization') in OrganizationCrudService
    for (const subscription of organization?.subscriptions || []) {
      if (
        new Date(subscription?.validUntil) > curDatetime &&
        location.card.isReviewInterception
      ) {
        return response.redirect(307, getReviewFormLink(shortLinkCode));
      }
    }

    // Если у QR кода включена опция переадресации по кастомной ссылке - то переадресуем пользователя на кастомную ссылку из QR
    if (location.card.isCustomLinkRedirect) {
      const customLink = location.card.linkCustom || location.linkDefault;

      return response.redirect(307, customLink);
    }

    // Если у QR кода выбрана какая-то платформа, переадресуем пользователя по ссылке из компании на эту платформу, иначе переадресуем на Default из компании
    switch (location.card.redirectPlatform) {
      case RedirectPlatformEnum.google:
        return response.redirect(307, location.linkGoogle);
      case RedirectPlatformEnum.trustpilot:
        return response.redirect(307, location.linkTrustPilot);
      default:
        return response.redirect(307, location.linkDefault);
    }
  }
}
