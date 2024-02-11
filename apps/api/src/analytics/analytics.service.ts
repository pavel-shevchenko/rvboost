import {
  BadRequestException,
  ForbiddenException,
  Injectable
} from '@nestjs/common';
import { EventCrudService } from './event_crud.service';
import { EventEnum, EventEnumType } from 'typing';
import { CardDbService } from '../card';
import { User } from '../user/entity';
import { defineUserAbility } from 'casl';
import { UserDbService } from '../user';
import { LocationDbService } from '../location/location_db.service';
import { ReviewDbService } from '../review/review_db.service';
import { EventDbService } from './event_db.service';
import { OrganizationService } from '../organization';

@Injectable()
export class AnalyticsService {
  constructor(
    private readonly eventCrudService: EventCrudService,
    private readonly eventDbService: EventDbService,
    private readonly userDbService: UserDbService,
    private readonly orgService: OrganizationService,
    private readonly locationDbService: LocationDbService,
    private readonly reviewDbService: ReviewDbService,
    private readonly cardDbService: CardDbService
  ) {}

  async newEvent(shortLinkCode: string, eventType: EventEnumType) {
    const card = await this.cardDbService.getByShortLinkCode(shortLinkCode);
    if (!card) throw new BadRequestException();

    await this.eventCrudService.create({
      data: { card: card.id, eventType }
    });
  }

  async getAdminDashboardData(admin: User) {
    const userAbility = defineUserAbility(admin);
    if (userAbility.cannot('manage', 'all')) throw new ForbiddenException();

    const nonAdminUsersCountPromise = this.userDbService.getNonAdminUsersCount();
    const allLocationsCountPromise =
      this.locationDbService.getAllLocationsCount();
    const allCardsCountPromise = this.cardDbService.getAllCardsCount();
    const allReviewsCountPromise = this.reviewDbService.getAllReviewsCount();
    const todayExtFolEventsCountPromise =
      this.eventDbService.todayExternalFollowedEventsCount();
    const adminClicksChartDataPromise = this.getAdminClicksChartData();

    const [
      nonAdminUsersCount,
      allLocationsCount,
      allCardsCount,
      allReviewsCount,
      todayExtFolEventsCount,
      adminClicksChartData
    ] = await Promise.all([
      nonAdminUsersCountPromise,
      allLocationsCountPromise,
      allCardsCountPromise,
      allReviewsCountPromise,
      todayExtFolEventsCountPromise,
      adminClicksChartDataPromise
    ]);

    return {
      nonAdminUsersCount,
      allLocationsCount,
      allCardsCount,
      allReviewsCount,
      todayExtFolEventsCount,
      adminClicksChartData
    };
  }

  getChartNameOfDate(date: Date) {
    let dayOfMonth: number | string = date.getDate();
    if (dayOfMonth.toString().length === 1) dayOfMonth = '0' + dayOfMonth;
    let month: number | string = 1 + date.getMonth();
    if (month.toString().length === 1) month = '0' + month;

    return dayOfMonth + '.' + month;
  }

  async getAdminClicksChartData(days = 7) {
    const nowTs = new Date().getTime();
    const data = [];
    for (let minus = days - 1; minus >= 0; minus--) {
      const date = new Date(nowTs - minus * 86400000);
      data.push({
        name: this.getChartNameOfDate(date),
        followExternal: await this.eventDbService.countEventsByTypeAndDay(
          EventEnum.followExternalLink,
          date
        ),
        submitBadForm: await this.eventDbService.countEventsByTypeAndDay(
          EventEnum.submitReviewFormWithBad,
          date
        )
      });
    }
    return data;
  }

  async getClientDashboardData(client: User) {
    const organization = await this.orgService.getOrganizationByClient(client);

    const externalFollowEventsCntPromise =
      this.eventDbService.countEventsByTypeAndOrg(
        EventEnum.followExternalLink,
        organization
      );
    const submitBadFormEventsCntPromise =
      this.eventDbService.countEventsByTypeAndOrg(
        EventEnum.submitReviewFormWithBad,
        organization
      );
    const clientClicksChartDataPromise = this.getAdminClicksChartData();

    const [
      externalFollowEventsCnt,
      submitBadFormEventsCnt,
      clientClicksChartData
    ] = await Promise.all([
      externalFollowEventsCntPromise,
      submitBadFormEventsCntPromise,
      clientClicksChartDataPromise
    ]);

    return {
      externalFollowEventsCnt,
      submitBadFormEventsCnt,
      clientClicksChartData
    };
  }
}
