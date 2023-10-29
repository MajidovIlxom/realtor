import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from '../prisma/prisma.module';
import { AccessTokenStrategy } from './strategies/access-token-strateges';
import { RefreshTokenSFromCookisrategy } from './strategies/refresh-token-cookie-strategy';
import { RefreshTokenFromBearerSrategy } from './strategies/refresh-token-bearer-strategy';
import { AccessTokenGuard } from '../common/guards';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [JwtModule.register({}), PrismaModule],
  controllers: [AuthController],
  providers: [
    AuthService,
    AccessTokenStrategy,
    RefreshTokenFromBearerSrategy,
    RefreshTokenSFromCookisrategy,
    {
      provide: APP_GUARD,
      useClass: AccessTokenGuard
    },
  ],
})
export class AuthModule {}
