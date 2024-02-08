import { Injectable } from '@nestjs/common';
import { QueryOrderMap } from '@mikro-orm/core';
import { EntityManager } from '@mikro-orm/postgresql';

import { Organization } from '../organization/entity';
import { FeedbackSettings, Review } from './entity';
import { FeedbackSettingsDto } from 'validation';

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
}
