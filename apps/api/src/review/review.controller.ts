import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';

import { FeedbackSettingsDto } from 'validation';
import { MikroCrudControllerFactory } from '../nestjs-crud';
import { ReviewCrudService } from './review_crud.service';
import { JwtAuthGuard } from '../auth/guards';
import { ReviewService } from './review.service';
import { AppRequest } from '../common/typing';

const CRUDController = new MikroCrudControllerFactory<ReviewCrudService>({
  service: ReviewCrudService,
  actions: ['query', 'create', 'retrieve', 'update', 'destroy'],
  lookup: { field: 'id' },
  query: {
    limit: { max: 200, default: 50 },
    offset: { max: 10_000 }
  }
}).applyDecoratorToActions(UseGuards(JwtAuthGuard)).product;

@Controller('review')
export class ReviewController extends CRUDController {
  constructor(private readonly reviewService: ReviewService) {
    super();
  }

  @UseGuards(JwtAuthGuard)
  @Post('feedback-settings')
  async saveFeedbackSettings(@Request() req: AppRequest) {
    return this.reviewService.saveFeedbackSettings(
      req.user,
      req.parts({ limits: { fileSize: 10 * 1024 * 1024 } })
    );
  }
}
