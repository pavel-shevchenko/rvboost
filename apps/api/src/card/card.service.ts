import { ForbiddenException, Injectable } from '@nestjs/common';
import { Transform } from 'stream';
import * as qrcode from 'qrcode';
import * as contentDisposition from 'content-disposition';
import { MinioService } from '../minio';
import { getS3qrCodeFullKey } from '../common/helpers/domainLogic';
import { CardDbService } from './card_db.service';
import { FastifyReply } from 'fastify';

@Injectable()
export class CardService {
  constructor(
    private readonly minioService: MinioService,
    private readonly cardDbService: CardDbService
  ) {}

  async generateQR(s3shortKey: string, link: string) {
    const stream = new Transform({
      transform(chunk, encoding, callback) {
        this.push(chunk);
        callback();
      }
    });
    qrcode.toFileStream(stream, link);
    this.minioService.putObject(getS3qrCodeFullKey(s3shortKey), stream);
  }

  async getQrCodeImage(response: FastifyReply, shortLinkCode: string) {
    const card = await this.cardDbService.getByShortLinkCode(shortLinkCode);
    if (!card?.location) throw new ForbiddenException();

    response.header('Content-Type', 'image/png');
    response.header(
      'Content-Disposition',
      contentDisposition(`${card.location.name}.png`)
    );
    response.send(
      await this.minioService.getObject(getS3qrCodeFullKey(shortLinkCode))
    );
  }
}
