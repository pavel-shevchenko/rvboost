import { forwardRef, Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';

import { MikroCrudModule } from '../nestjs-crud';
import { Card } from './entity';
import { CardCrudService } from './card_crud.service';
import { CardController } from './card.controller';
import { CardService } from './card.service';
import { MinioModule } from '../minio';
import { CardDbService } from './card_db.service';

@Module({
  imports: [MinioModule, MikroCrudModule, MikroOrmModule.forFeature([Card])],
  controllers: [CardController],
  providers: [CardCrudService, CardService, CardDbService],
  exports: [CardCrudService, CardDbService]
})
export class CardModule {}
