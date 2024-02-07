import {
  BadRequestException,
  ForbiddenException,
  Injectable
} from '@nestjs/common';
import type { MultipartValue, MultipartFile } from '@fastify/multipart';

import { ReviewDbService } from './review_db.service';
import { User } from '../user/entity';
import { CrudReviewDto, FeedbackSettingsDto } from 'validation';
import {
  addFastifyMultipartFieldToDto,
  createDtoValidator
} from '../common/helpers';
import { OrganizationDbService } from '../organization';
import { MinioService } from '../minio';
import { UploadedObjectInfo } from 'minio';
import { randomStringGenerator } from '@nestjs/common/utils/random-string-generator.util';
import { ReviewCrudService } from './review_crud.service';
import { CardDbService } from '../card';
import { Organization } from '../organization/entity';

const fbSettingsDtoValidate = createDtoValidator(FeedbackSettingsDto);

@Injectable()
export class ReviewService {
  constructor(
    private readonly minioService: MinioService,
    private readonly reviewCrudService: ReviewCrudService,
    private readonly reviewDbService: ReviewDbService,
    private readonly cardDbService: CardDbService,
    private readonly orgDbService: OrganizationDbService
  ) {}

  async getOrganizationByClient(client: User) {
    const organizations =
      await this.orgDbService.getOrganizationsByClient(client);
    if (!organizations.length) throw new ForbiddenException();

    return organizations[0];
  }

  async getFeedbackSettingsForClient(client: User) {
    const organization = await this.getOrganizationByClient(client);

    return this.reviewDbService.getFeedbackSettingsByOrg(organization);
  }

  async saveFeedbackSettingsForClient(
    client: User,
    mpAsyncIterator: AsyncIterableIterator<MultipartValue | MultipartFile>
  ) {
    const organization = await this.getOrganizationByClient(client);

    return this.saveFeedbackSettings(organization, mpAsyncIterator);
  }

  async saveFeedbackSettings(
    assignedOrg: Organization,
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

    let logoUploadRes: UploadedObjectInfo;
    let isLogoRemovingRequested = false;
    const newLogoS3Key = 'fb_settings_logo__' + randomStringGenerator();
    const feedbackSettings =
      await this.reviewDbService.getFeedbackSettingsByOrg(assignedOrg);

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
        Object.assign(feedbackSettings, feedbackSettingsDto)
      );
    } else {
      await this.reviewDbService.createFeedbackSettings({
        ...feedbackSettingsDto,
        organization: assignedOrg
      });
    }
  }

  async newReviewInterceptionEvaluation(reviewDto: CrudReviewDto) {
    const review = await this.reviewCrudService.create({ data: reviewDto });

    return review;
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
