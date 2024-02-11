import {
  BadRequestException,
  ForbiddenException,
  Injectable
} from '@nestjs/common';
import type { MultipartFile, MultipartValue } from '@fastify/multipart';

import { ReviewDbService } from './review_db.service';
import { User } from '../user/entity';
import { FeedbackSettingsDto } from 'validation';
import {
  addFastifyMultipartFieldToDto,
  createDtoValidator
} from '../common/helpers';
import { OrganizationDbService, OrganizationService } from '../organization';
import { MinioService } from '../minio';
import { UploadedObjectInfo } from 'minio';
import { randomStringGenerator } from '@nestjs/common/utils/random-string-generator.util';
import { CardDbService } from '../card';
import { Organization } from '../organization/entity';
import { defineUserAbility, PermissionSubject } from 'casl';
import { FeedbackSettings } from './entity';

const fbSettingsDtoValidate = createDtoValidator(FeedbackSettingsDto);

@Injectable()
export class ReviewService {
  constructor(
    private readonly minioService: MinioService,
    private readonly reviewDbService: ReviewDbService,
    private readonly cardDbService: CardDbService,
    private readonly orgService: OrganizationService,
    private readonly orgDbService: OrganizationDbService
  ) {}

  async getFeedbackSettingsForClient(client: User) {
    const organization = await this.orgService.getOrganizationByClient(client);

    return this.reviewDbService.getFeedbackSettingsByOrg(organization);
  }

  async getFeedbackSettingsForAdmin(admin: User, fbSettingsId: number) {
    const userAbility = defineUserAbility(admin);
    if (userAbility.cannot('manage', PermissionSubject.entityFbSettings))
      throw new ForbiddenException();

    return this.reviewDbService.getFbSettingsById(fbSettingsId);
  }

  async delFeedbackSettingsByAdmin(admin: User, fbSettingsId: number) {
    const userAbility = defineUserAbility(admin);
    if (userAbility.cannot('manage', PermissionSubject.entityFbSettings))
      throw new ForbiddenException();

    const fbSettings = await this.reviewDbService.getFbSettingsById(fbSettingsId);
    if (fbSettings?.logoS3Key) {
      await this.minioService.removeObjects([fbSettings.logoS3Key]);
    }

    return this.reviewDbService.deleteFbSettings(fbSettings);
  }

  async getFbSettingsListForAdmin(admin: User) {
    const userAbility = defineUserAbility(admin);
    if (userAbility.cannot('manage', PermissionSubject.entityFbSettings))
      throw new ForbiddenException();

    return this.reviewDbService.getFbSettingsList();
  }

  async addFeedbackSettingsByAdmin(
    admin: User,
    organizationId: number,
    mpAsyncIterator: AsyncIterableIterator<MultipartValue | MultipartFile>
  ) {
    const userAbility = defineUserAbility(admin);
    if (userAbility.cannot('manage', PermissionSubject.entityFbSettings))
      throw new ForbiddenException();

    const organization =
      await this.orgDbService.getOrgWithFbSettingsById(organizationId);
    if (organization?.feedbackSettings?.id) throw new ForbiddenException();

    return this.saveFeedbackSettings(organization, mpAsyncIterator);
  }

  async saveFeedbackSettingsForAdmin(
    admin: User,
    organizationId: number,
    fbSettingsId: number,
    mpAsyncIterator: AsyncIterableIterator<MultipartValue | MultipartFile>
  ) {
    const userAbility = defineUserAbility(admin);
    if (userAbility.cannot('manage', PermissionSubject.entityFbSettings))
      throw new ForbiddenException();

    const organization =
      await this.orgDbService.getOrgWithFbSettingsById(organizationId);
    const fbSettings = await this.reviewDbService.getFbSettingsById(fbSettingsId);

    if (
      organization?.feedbackSettings?.id &&
      organization?.feedbackSettings?.id !== fbSettings.id
    )
      throw new ForbiddenException();

    return this.saveFeedbackSettings(organization, mpAsyncIterator, fbSettings);
  }

  async saveFeedbackSettingsForClient(
    client: User,
    mpAsyncIterator: AsyncIterableIterator<MultipartValue | MultipartFile>
  ) {
    const organization = await this.orgService.getOrganizationByClient(client);

    return this.saveFeedbackSettings(organization, mpAsyncIterator);
  }

  async saveFeedbackSettings(
    organization: Organization,
    mpAsyncIterator: AsyncIterableIterator<MultipartValue | MultipartFile>,
    feedbackSettings?: FeedbackSettings
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

    if (!feedbackSettings) {
      feedbackSettings =
        await this.reviewDbService.getFeedbackSettingsByOrg(organization);
    }
    let logoUploadRes: UploadedObjectInfo;
    let isLogoRemovingRequested = false;
    const newLogoS3Key = 'fb_settings_logo__' + randomStringGenerator();

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
        feedbackSettings?.logoS3Key
      ) {
        feedbackSettingsDto['logoS3Key'] = null;
        isLogoRemovingRequested = true;
      }
    }
    const errors = fbSettingsDtoValidate(feedbackSettingsDto);
    if (Object.keys(errors).length) {
      if (logoUploadRes) {
        await this.minioService.removeObjects([newLogoS3Key]);
      }
      throw new BadRequestException(errors);
    } else if (
      isLogoRemovingRequested ||
      (logoUploadRes && feedbackSettings?.logoS3Key)
    ) {
      await this.minioService.removeObjects([feedbackSettings.logoS3Key]);
    }

    if (feedbackSettings) {
      await this.reviewDbService.saveFeedbackSettings(
        Object.assign(feedbackSettings, {
          ...feedbackSettingsDto,
          organization
        })
      );
    } else {
      await this.reviewDbService.createFeedbackSettings({
        ...feedbackSettingsDto,
        organization
      });
    }
  }

  async putReviewInterceptionBadText(
    shortLinkCode: string,
    reviewId: number,
    reviewText: string
  ) {
    if (!shortLinkCode || !reviewId || !reviewText)
      throw new ForbiddenException();

    const card = await this.cardDbService.getByShortLinkCode(shortLinkCode);
    const review = await this.reviewDbService.getById(reviewId);
    if (card.location.id !== review.location.id) throw new ForbiddenException();

    review.reviewText = reviewText;
    review.isBadFormCollected = true;
    this.reviewDbService.saveReview(review);
  }
}
