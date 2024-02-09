import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Request,
  UseGuards
} from '@nestjs/common';

import { MikroCrudControllerFactory } from '../nestjs-crud';
import { ReviewCrudService } from './review_crud.service';
import { JwtAuthGuard } from '../auth/guards';
import { ReviewService } from './review.service';
import { AppRequest } from '../common/typing';
import { MinioService } from '../minio';
import { ReviewDbService } from './review_db.service';
import { CrudReviewDto } from 'validation';

const CRUDController = new MikroCrudControllerFactory<ReviewCrudService>({
  service: ReviewCrudService,
  actions: ['query', 'create', 'retrieve', 'update', 'destroy'],
  lookup: { field: 'id' },
  query: {
    limit: { max: 200, default: 50 },
    offset: { max: 10_000 },
    order: { in: ['id:desc'], default: ['id:desc'] },
    expand: {
      in: ['location'],
      default: ['location']
    }
  }
}).applyDecoratorToActions(UseGuards(JwtAuthGuard)).product;

@Controller('review')
export class ReviewController extends CRUDController {
  constructor(
    private readonly minioService: MinioService,
    private readonly reviewService: ReviewService,
    private readonly reviewCrudService: ReviewCrudService,
    private readonly reviewDbService: ReviewDbService
  ) {
    super();
  }

  @UseGuards(JwtAuthGuard)
  @Get('feedback-settings')
  async getFeedbackSettingsForClient(@Request() req: AppRequest) {
    return this.reviewService.getFeedbackSettingsForClient(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Post('feedback-settings')
  async saveFeedbackSettingsForClient(@Request() req: AppRequest) {
    return this.reviewService.saveFeedbackSettingsForClient(
      req.user,
      req.parts({ limits: { fileSize: 10 * 1024 * 1024 } })
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('feedback-settings-list')
  async getFbSettingsListForAdmin(@Request() req: AppRequest) {
    return this.reviewService.getFbSettingsListForAdmin(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('feedback-settings/:fbSettingsId')
  async delFeedbackSettingsByAdmin(
    @Request() req: AppRequest,
    @Param('fbSettingsId', new ParseIntPipe()) fbSettingsId: number
  ) {
    return this.reviewService.delFeedbackSettingsByAdmin(req.user, fbSettingsId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('feedback-settings/:fbSettingsId')
  async getFeedbackSettingsForAdmin(
    @Request() req: AppRequest,
    @Param('fbSettingsId', new ParseIntPipe()) fbSettingsId: number
  ) {
    return this.reviewService.getFeedbackSettingsForAdmin(req.user, fbSettingsId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('feedback-settings/:organizationId')
  async addFeedbackSettingsByAdmin(
    @Request() req: AppRequest,
    @Param('organizationId', new ParseIntPipe()) organizationId: number
  ) {
    return this.reviewService.addFeedbackSettingsByAdmin(
      req.user,
      organizationId,
      req.parts({ limits: { fileSize: 10 * 1024 * 1024 } })
    );
  }

  @UseGuards(JwtAuthGuard)
  @Post('feedback-settings/:organizationId/:fbSettingsId')
  async saveFeedbackSettingsForAdmin(
    @Request() req: AppRequest,
    @Param('organizationId', new ParseIntPipe()) organizationId: number,
    @Param('fbSettingsId', new ParseIntPipe()) fbSettingsId: number
  ) {
    return this.reviewService.saveFeedbackSettingsForAdmin(
      req.user,
      organizationId,
      fbSettingsId,
      req.parts({ limits: { fileSize: 10 * 1024 * 1024 } })
    );
  }

  @Get('logo-by-s3key/:logoS3Key')
  async getLogoByS3Key(@Param('logoS3Key') logoS3Key: string) {
    if (!(await this.reviewDbService.isLogoS3keyExists(logoS3Key)))
      throw new ForbiddenException();

    return this.minioService.getObject(logoS3Key);
  }

  @Post('new-review-interception-evaluation')
  async newReviewInterceptionEvaluation(@Body() reviewDto: CrudReviewDto) {
    return this.reviewCrudService.create({ data: reviewDto });
  }

  @Put('put-review-interception/:shortLinkCode/:reviewId')
  async putReviewInterception(
    @Body() reviewDto: CrudReviewDto,
    @Param('shortLinkCode') shortLinkCode: string,
    @Param('reviewId', new ParseIntPipe()) reviewId: number
  ) {
    return this.reviewService.putReviewInterceptionBadText(
      shortLinkCode,
      reviewId,
      reviewDto.reviewText
    );
  }
}
