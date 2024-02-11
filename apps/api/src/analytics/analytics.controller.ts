import { Controller, UseGuards, Post, Param, Get, Request } from '@nestjs/common';
import { MikroCrudControllerFactory } from '../nestjs-crud';
import { JwtAuthGuard } from '../auth/guards';
import { EventCrudService } from './event_crud.service';
import { AnalyticsService } from './analytics.service';
import { EventEnum } from 'typing';
import { AppRequest } from '../common/typing';

const EventCrudController = new MikroCrudControllerFactory<EventCrudService>({
  service: EventCrudService,
  actions: ['query', 'create', 'retrieve', 'update', 'destroy'],
  lookup: { field: 'id' },
  query: {
    limit: { max: 200, default: 50 },
    offset: { max: 10_000 },
    order: { in: ['createdAt:desc'], default: ['createdAt:desc'] }
  }
}).applyDecoratorToActions(UseGuards(JwtAuthGuard)).product;

@Controller('analytics')
export class AnalyticsController extends EventCrudController {
  constructor(private readonly analyticsService: AnalyticsService) {
    super();
  }

  @UseGuards(JwtAuthGuard)
  @Get('get-admin-dashboard-data')
  async getAdminDashboardData(@Request() req: AppRequest) {
    return this.analyticsService.getAdminDashboardData(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('get-client-dashboard-data')
  async getClientDashboardData(@Request() req: AppRequest) {
    return this.analyticsService.getClientDashboardData(req.user);
  }

  @Post('new-follow-external-link-event/:shortLinkCode')
  newFollowExternalLink(@Param('shortLinkCode') shortLinkCode: string) {
    return this.analyticsService.newEvent(
      shortLinkCode,
      EventEnum.followExternalLink
    );
  }

  @Post('new-show-review-form-with-rating-event/:shortLinkCode')
  newShowReviewFormWithRating(@Param('shortLinkCode') shortLinkCode: string) {
    return this.analyticsService.newEvent(
      shortLinkCode,
      EventEnum.showReviewFormWithRating
    );
  }

  @Post('new-show-review-form-with-platform-event/:shortLinkCode')
  newShowReviewFormWithPlatform(@Param('shortLinkCode') shortLinkCode: string) {
    return this.analyticsService.newEvent(
      shortLinkCode,
      EventEnum.showReviewFormWithPlatform
    );
  }

  @Post('new-show-review-form-with-bad-event/:shortLinkCode')
  newShowReviewFormWithBad(@Param('shortLinkCode') shortLinkCode: string) {
    return this.analyticsService.newEvent(
      shortLinkCode,
      EventEnum.showReviewFormWithBad
    );
  }

  @Post('new-submit-review-form-with-bad-event/:shortLinkCode')
  newSubmitReviewFormWithBad(@Param('shortLinkCode') shortLinkCode: string) {
    return this.analyticsService.newEvent(
      shortLinkCode,
      EventEnum.submitReviewFormWithBad
    );
  }
}
