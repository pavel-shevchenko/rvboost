import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { AppModule } from './app/app.module';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import passport from '@fastify/passport';
import fastifySecureSession from '@fastify/secure-session';
import fastifyMultipart from '@fastify/multipart';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter()
  );

  await app.register(fastifySecureSession, {
    secret: process.env?.SECURE_SESSIONS_SECRET,
    salt: process.env?.SECURE_SESSIONS_SALT
  });
  await app.register(passport.initialize());
  await app.register(passport.secureSession());

  await app.register(fastifyMultipart, {
    limits: {
      fieldNameSize: 1024, // Max field name size in bytes
      fieldSize: 65535, // Max field value size in bytes
      fields: 100, // Max number of non-file fields
      fileSize: 2 * 1024 * 1024, // For multipart forms, the max file size
      files: 100, // Max number of file fields
      headerPairs: 2000, // Max number of header key=>value pairs
      parts: 1000 // For multipart forms, the max number of parts (fields + files)
    }
  });

  app.setGlobalPrefix('api');
  // CORS: Allow `*`
  app.enableCors({
    allowedHeaders: '*',
    origin: '*'
  });
  // Global DTO validation setup
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      exceptionFactory: (errors) => {
        const response = Object.fromEntries(
          errors.map((i) => [i.property, Object.values(i.constraints)[0]])
        );

        throw new BadRequestException(response);
      }
    })
  );

  await app.listen(3001, '0.0.0.0');
}
bootstrap();
