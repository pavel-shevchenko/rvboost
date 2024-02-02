import { Module } from '@nestjs/common';
import * as minio from 'minio';

import { MinioService } from './minio.service';
import { MINIO_CLIENT } from './minio_client.token';

const minioClientFactory = {
  provide: MINIO_CLIENT,
  useFactory: function () {
    // На свойстве обработчика инстанс клиента потому что он должен оказаться в old_space области Node.js
    if (!this.minioConnection) {
      this.minioConnection = new minio.Client({
        endPoint: 'minio',
        port: 9000,
        useSSL: false,
        accessKey: process.env?.MINIO_ROOT_USER,
        secretKey: process.env?.MINIO_ROOT_PASSWORD
      });
    }

    return this.minioConnection;
  }
};

@Module({
  providers: [MinioService, minioClientFactory],
  exports: [MinioService]
})
export class MinioModule {}
