import { forwardRef, Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';

import { MikroCrudModule } from '../nestjs-crud';
import { Location } from './entity';
import { LocationCrudService } from './location_crud.service';
import { LocationController } from './location.controller';
import { LocationDbService } from './location_db.service';

@Module({
  imports: [MikroCrudModule, MikroOrmModule.forFeature([Location])],
  controllers: [LocationController],
  providers: [LocationCrudService, LocationDbService],
  exports: [LocationDbService]
})
export class LocationModule {}
