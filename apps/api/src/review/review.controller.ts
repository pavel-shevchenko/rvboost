import {
  Body,
  Controller,
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
    order: { in: ['id:desc'], default: ['id:desc'] }
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
