import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';

import { MikroCrudModule } from '../nestjs-crud';
import { Subscription } from './entity';
import { SubscriptionCrudService } from './subscription_crud.service';
import { SubscriptionController } from './subscription.controller';

@Module({
  imports: [MikroCrudModule, MikroOrmModule.forFeature([Subscription])],
  controllers: [SubscriptionController],
  providers: [SubscriptionCrudService],
  exports: [SubscriptionCrudService]
})
export class SubscriptionModule {}
