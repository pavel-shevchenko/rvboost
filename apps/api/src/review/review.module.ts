import { forwardRef, Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';

import { MikroCrudModule } from '../nestjs-crud';
import { FeedbackSettings, Review } from './entity';
import { ReviewCrudService } from './review_crud.service';
import { ReviewController } from './review.controller';
import { ReviewService } from './review.service';
import { ReviewDbService } from './review_db.service';
import { OrganizationModule } from '../organization';

@Module({
  imports: [
    MikroCrudModule,
    OrganizationModule,
    MikroOrmModule.forFeature([Review, FeedbackSettings])
  ],
  controllers: [ReviewController],
  providers: [ReviewCrudService, ReviewService, ReviewDbService],
  exports: []
})
export class ReviewModule {}
