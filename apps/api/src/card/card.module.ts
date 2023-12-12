import { forwardRef, Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';

import { MikroCrudModule } from '../nestjs-crud';
import { Card } from './entity';
import { CardCrudService } from './card_crud.service';
import { CardController } from './card.controller';

@Module({
  imports: [MikroCrudModule, MikroOrmModule.forFeature([Card])],
  controllers: [CardController],
  providers: [CardCrudService],
  exports: []
})
export class CardModule {}
