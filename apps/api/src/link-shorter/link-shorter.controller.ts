import { Controller, Get, Param, Res } from '@nestjs/common';
import { FastifyReply } from 'fastify';
import { LinkShorterService } from './link-shorter.service';

@Controller('link-shorter')
export class LinkShorterController {
  constructor(private readonly linkShorterService: LinkShorterService) {}

  @Get('redirect/:shortLinkCode')
  redirect(
    @Res() response: FastifyReply,
    @Param('shortLinkCode') shortLinkCode: string
  ) {
    return this.linkShorterService.redirect(response, shortLinkCode);
  }
}
