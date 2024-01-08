import { Module } from '@nestjs/common';
import * as minio from 'minio';

import { MinioService } from './minio.service';
import { MINIO_CLIENT } from './minio_client.token';

let minioConnection: minio.Client;

const minioClientFactory = {
  provide: MINIO_CLIENT,
  useFactory: () => {
    if (!minioConnection) {
      minioConnection = new minio.Client({
        endPoint: 'minio',
        port: 9000,
        useSSL: false,
        accessKey: process.env?.MINIO_ROOT_USER,
        secretKey: process.env?.MINIO_ROOT_PASSWORD
      });
    }
    return minioConnection;
  }
};

@Module({
  providers: [MinioService, minioClientFactory],
  exports: [MinioService]
})
export class MinioModule {}
