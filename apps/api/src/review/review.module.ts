import { forwardRef, Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';

import { MikroCrudModule } from '../nestjs-crud';
import { Review } from './entity';
import { ReviewCrudService } from './review_crud.service';
import { ReviewController } from './review.controller';

@Module({
  imports: [MikroCrudModule, MikroOrmModule.forFeature([Review])],
  controllers: [ReviewController],
  providers: [ReviewCrudService],
  exports: []
})
export class ReviewModule {}
