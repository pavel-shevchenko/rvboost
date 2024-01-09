import {
  BadRequestException,
  ForbiddenException,
  Injectable
} from '@nestjs/common';
import type { MultipartValue, MultipartFile } from '@fastify/multipart';

import { ReviewDbService } from './review_db.service';
import { User } from '../user/entity';
import { FeedbackSettingsDto } from 'validation';
import {
  addFastifyMultipartFieldToDto,
  createDtoValidator
} from '../common/helpers';
import { OrganizationDbService } from '../organization';
import { MinioService } from '../minio';
import { UploadedObjectInfo } from 'minio';
import { randomStringGenerator } from '@nestjs/common/utils/random-string-generator.util';

const fbSettingsDtoValidate = createDtoValidator(FeedbackSettingsDto);

@Injectable()
export class ReviewService {
  constructor(
    private readonly minioService: MinioService,
    private readonly reviewDbService: ReviewDbService,
    private readonly organizationDbService: OrganizationDbService
  ) {}

  async getFeedbackSettings(user: User) {
    const organizations =
      await this.organizationDbService.getOrganizationsByClient(user);
    if (!organizations.length) throw new ForbiddenException();
    const assignedOrg = organizations[0];

    return this.reviewDbService.getFeedbackSettingsByOrg(assignedOrg);
  }

  async saveFeedbackSettings(
    user: User,
    mpAsyncIterator: AsyncIterableIterator<MultipartValue | MultipartFile>
  ) {
    const feedbackSettingsDto = {
      redirectPlatform: [],
      whetherRequestUsername: false,
      requestUsernameRequired: false,
      whetherRequestPhone: false,
      requestPhoneRequired: false,
      whetherRequestEmail: false,
      requestEmailRequired: false
    } as FeedbackSettingsDto;

    const organizations =
      await this.organizationDbService.getOrganizationsByClient(user);
    if (!organizations.length) throw new ForbiddenException();
    const assignedOrg = organizations[0];

    const feedbackSettings =
      await this.reviewDbService.getFeedbackSettingsByOrg(assignedOrg);
    const newLogoS3Key = 'fb_settings_logo__' + randomStringGenerator();
    let logoUploadRes: UploadedObjectInfo;

    for await (const part of mpAsyncIterator) {
      if (part.type === 'file' && part.fieldname === 'logo') {
        feedbackSettingsDto['logoS3Key'] = newLogoS3Key;
        logoUploadRes = await this.minioService.putObject(
          newLogoS3Key,
          part.file
        );
      } else if (part.type === 'field' && part.fieldname !== 'logo') {
        addFastifyMultipartFieldToDto(
          part.fieldname,
          part.value,
          feedbackSettingsDto
        );
      } else if (
        part.fieldname === 'logo' &&
        part['value'] === 'removed' &&
        feedbackSettings.logoS3Key
      ) {
        feedbackSettingsDto['logoS3Key'] = null;
        await this.minioService.removeObjects([feedbackSettings.logoS3Key]);
      }
    }
    const errors = fbSettingsDtoValidate(feedbackSettingsDto);
    if (Object.keys(errors).length) {
      if (logoUploadRes) {
        await this.minioService.removeObjects([newLogoS3Key]);
      }
      throw new BadRequestException(errors);
    } else if (logoUploadRes) {
      await this.minioService.removeObjects([feedbackSettings.logoS3Key]);
    }

    if (feedbackSettings) {
      await this.reviewDbService.saveFeedbackSettings(
        Object.assign(feedbackSettings, feedbackSettingsDto)
      );
    } else {
      await this.reviewDbService.createFeedbackSettings({
        ...feedbackSettingsDto,
        organization: assignedOrg
      });
    }
  }
}
