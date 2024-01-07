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

const fbSettingsDtoValidate = createDtoValidator(FeedbackSettingsDto);

@Injectable()
export class ReviewService {
  constructor(
    private readonly reviewDbService: ReviewDbService,
    private readonly organizationDbService: OrganizationDbService
  ) {}

  async saveFeedbackSettings(
    user: User,
    mpAsyncIterator: AsyncIterableIterator<MultipartValue | MultipartFile>
  ) {
    const feedbackSettingsDto = {
      whetherRequestUsername: false,
      requestUsernameRequired: false,
      whetherRequestPhone: false,
      requestPhoneRequired: false,
      whetherRequestEmail: false,
      requestEmailRequired: false
    } as FeedbackSettingsDto;

    let logoUploadRes;
    for await (const part of mpAsyncIterator) {
      if (part.type === 'file' && part.fieldname === 'logo') {
        // logoUploadRes = await part.file.pipe()
      } else if (part.type === 'field' && part.fieldname !== 'logo') {
        addFastifyMultipartFieldToDto(
          part.fieldname,
          part.value,
          feedbackSettingsDto
        );
      }
    }
    const errors = fbSettingsDtoValidate(feedbackSettingsDto);
    if (Object.keys(errors).length) {
      if (!logoUploadRes) {
      }
      throw new BadRequestException(errors);
    }

    const organizations =
      await this.organizationDbService.getOrganizationsByClient(user);
    if (!organizations.length) throw new ForbiddenException();
    const assignedOrg = organizations[0];

    const feedbackSettings =
      await this.reviewDbService.getFeedbackSettingsByOrg(assignedOrg);
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
