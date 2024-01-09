import { Injectable } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/postgresql';

import { Organization } from '../organization/entity';
import { FeedbackSettings } from './entity';
import { FeedbackSettingsDto } from 'validation';

@Injectable()
export class ReviewDbService {
  constructor(private readonly em: EntityManager) {}

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
}
