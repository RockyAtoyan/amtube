import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UsersService } from 'src/users/users.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  controllers: [AuthController],
  providers: [AuthService, UsersService, JwtStrategy],
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
    }),
    PassportModule,
  ],
})
export class AuthModule {}
