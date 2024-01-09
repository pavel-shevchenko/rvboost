import { Inject, Injectable } from '@nestjs/common';
import { Client } from 'minio';
import { Readable } from 'node:stream';

import { MINIO_CLIENT } from './minio_client.token';

@Injectable()
export class MinioService {
  constructor(@Inject(MINIO_CLIENT) private readonly minioClient: Client) {}

  getObject = (objectName: string) =>
    this.minioClient.getObject(process.env?.MINIO_DEFAULT_BUCKET, objectName);

  putObject = (objectName: string, stream: string | Readable) =>
    this.minioClient.putObject(
      process.env?.MINIO_DEFAULT_BUCKET,
      objectName,
      stream
    );

  removeObjects = (objectsList: string[]) =>
    this.minioClient.removeObjects(
      process.env?.MINIO_DEFAULT_BUCKET,
      objectsList
    );
}
