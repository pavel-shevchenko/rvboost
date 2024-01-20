import { Controller, Get, Param } from '@nestjs/common';

@Controller('link-shorter')
export class AppController {
  @Get('redirect/:shortLinkCode')
  redirect(@Param('shortLinkCode') shortLinkCode: string) {
    return shortLinkCode;
  }
}
