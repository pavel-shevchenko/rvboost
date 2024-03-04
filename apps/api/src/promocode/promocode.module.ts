import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';

import { MikroCrudModule } from '../nestjs-crud';
import { Promocode } from './entity';
import { PromocodeDbService } from './promocode_db.service';
import { PromocodeCrudService } from './promocode_crud.service';
import { PromocodeController } from './promocode.controller';

@Module({
  imports: [MikroCrudModule, MikroOrmModule.forFeature([Promocode])],
  controllers: [PromocodeController],
  providers: [PromocodeCrudService, PromocodeDbService],
  exports: [PromocodeDbService]
})
export class PromocodeModule {}
