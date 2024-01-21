import { Module } from '@nestjs/common';
import { LinkShorterController } from './link-shorter.controller';
import { LinkShorterService } from './link-shorter.service';
import { OrganizationModule } from '../organization';

@Module({
  imports: [OrganizationModule],
  providers: [LinkShorterService],
  controllers: [LinkShorterController]
})
export class LinkShorterModule {}
