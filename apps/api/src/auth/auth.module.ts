import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { UserModule } from '../user';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/passport_jwt';
import { LocalStrategy } from './strategies/passport_local';
import { AuthController } from './auth.controller';
import { AuthSerializer } from './serialization.provider';
import { MailModule } from '../mail';
import { PassportModule } from '../fastify-passport';

@Module({
  imports: [
    JwtModule.register({
      signOptions: { expiresIn: process.env?.JWT_EXPIRES_IN_HOURS + 'h' },
      secret: process.env?.JWT_SECRET
    }),
    forwardRef(() => UserModule),
    PassportModule,
    MailModule
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy, AuthSerializer],
  exports: [AuthService]
})
export class AuthModule {}
