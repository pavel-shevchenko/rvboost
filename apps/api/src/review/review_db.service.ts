import { Injectable } from '@nestjs/common';
import { QueryOrderMap } from '@mikro-orm/core';
import { EntityManager } from '@mikro-orm/postgresql';

import { Organization } from '../organization/entity';
import { FeedbackSettings, Review } from './entity';
import { FeedbackSettingsDto } from 'validation';
import { RedirectPlatformType } from 'typing';

@Injectable()
export class ReviewDbService {
  constructor(private readonly em: EntityManager) {}

  getFbSettingsList(orderBy: QueryOrderMap<FeedbackSettings> = { id: 'desc' }) {
    return this.em.find(FeedbackSettings, {}, { orderBy });
  }

  getFeedbackSettingsByOrg(organization: Organization) {
    return this.em.findOne(FeedbackSettings, { organization });
  }

  createFeedbackSettings(
    feedbackSettingsData: FeedbackSettingsDto & { organization: Organization }
  ) {
    const feedbackSettings = this.em.create(
      FeedbackSettings,
      feedbackSettingsData
    );
    return this.em.persistAndFlush(feedbackSettings);
  }

  saveFeedbackSettings(feedbackSettings: FeedbackSettings) {
    return this.em.persistAndFlush(feedbackSettings);
  }

  async isLogoS3keyExists(logoS3Key: string) {
    return !!(await this.em.findOne(FeedbackSettings, { logoS3Key }));
  }

  async getById(id: number) {
    return this.em.findOne(Review, { id }, { populate: ['location'] });
  }

  async getFbSettingsById(id: number) {
    return this.em.findOne(FeedbackSettings, { id });
  }

  async deleteFbSettings(feedbackSettings: FeedbackSettings) {
    this.em.remove([feedbackSettings]);
    await this.em.flush();
  }

  async saveReview(review: Review) {
    await this.em.persistAndFlush(review);

    return review;
  }

  getAllReviewsCount() {
    return this.em.count(Review);
  }

  countReviewsByPlatformDayOrg(
    platform: RedirectPlatformType,
    day: Date,
    organization: Organization
  ) {
    const start = new Date(day);
    start.setUTCHours(0, 0, 0, 0);
    const end = new Date(day);
    end.setUTCHours(23, 59, 59, 999);

    return this.em.count(Review, {
      platform,
      publicationDatetime: {
        $gte: start,
        $lt: end
      },
      location: { organization }
    });
  }
}
