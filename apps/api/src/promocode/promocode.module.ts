import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';

import { MikroCrudModule } from '../nestjs-crud';
import { Promocode } from './entity';
import { PromocodeCrudService } from './promocode_crud.service';
import { PromocodeController } from './promocode.controller';

@Module({
  imports: [MikroCrudModule, MikroOrmModule.forFeature([Promocode])],
  controllers: [PromocodeController],
  providers: [PromocodeCrudService],
  exports: []
})
export class PromocodeModule {}
