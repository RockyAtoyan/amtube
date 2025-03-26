import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import { MailService } from 'src/mail/mail.service';
import { DbService } from './../db/db.service';
import { UsersService } from './../users/users.service';
import { JwtPayload } from './auth.types';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';

@Injectable()
export class AuthService {
  private ACCESS_TOKEN_AGE = '1h';
  private REFRESH_TOKEN_AGE = 1000 * 60 * 60 * 24 * 7; // 7 days
  private REFRESH_TOKEN_DAYS_AGE =
    String(this.REFRESH_TOKEN_AGE / (1000 * 60 * 60 * 24)) + 'd';
  private REFRESH_TOKEN_COOKIE_NAME = 'REFRESH_TOKEN';

  constructor(
    private dbService: DbService,
    private usersService: UsersService,
    private jwtService: JwtService,
    private mailService: MailService,
  ) {}

  async signUp(dto: SignUpDto) {
    const userWithSameEmail = await this.usersService.findByEmail(dto.email);
    const userWithSameName = await this.usersService.findByName(dto.name);
    if (userWithSameEmail)
      throw new BadRequestException('User with this email already exists!');
    if (userWithSameName)
      throw new BadRequestException('User with this name already exists!');
    const password = bcrypt.hashSync(dto.password, 7);
    const newUser = await this.usersService.create({
      ...dto,
      password,
    });
    const activationToken = this.generateActivationToken(newUser.id);
    if (activationToken) {
      await this.mailService.sendActivationEmail(
        newUser.email,
        activationToken,
      );
    }
    return newUser;
  }

  async signIn(dto: SignInDto) {
    const candidate = await this.dbService.user.findUnique({
      where: { email: dto.email },
    });
    if (!candidate) throw new BadRequestException('User does not exist!');
    if (!bcrypt.compareSync(dto.password, candidate.password)) {
      throw new BadRequestException('Incorrect password!');
    }
    const payload: JwtPayload = {
      email: candidate.email,
      sub: candidate.id,
      role: candidate.role,
    };
    const tokens = this.generateTokens(payload);
    const { password, ...user } = candidate;
    return { user, ...tokens };
  }

  async refreshAccessToken(req: Request, res: Response) {
    const refreshToken = req.cookies[this.REFRESH_TOKEN_COOKIE_NAME];
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token should be passed!');
    }
    try {
      const payload = await this.jwtService.verifyAsync(refreshToken);
      if (!payload) throw 'error';
      const tokens = await this.generateTokens({
        sub: payload.sub,
        email: payload.email,
        role: payload.role,
      });
      return { accessToken: tokens.accessToken };
    } catch (err) {
      this.removeTokenFromResponse(res);
      throw new UnauthorizedException('Refresh token expired!');
    }
  }

  addTokenToResponse(res: Response, token: string) {
    res.cookie(this.REFRESH_TOKEN_COOKIE_NAME, token, {
      httpOnly: true,
      maxAge: this.REFRESH_TOKEN_AGE,
      secure: true,
    });
  }

  removeTokenFromResponse(res: Response) {
    res.clearCookie(this.REFRESH_TOKEN_COOKIE_NAME);
  }

  async sendActivateEmail(userId: string) {
    try {
      const user = await this.usersService.findById(userId);
      if (!user) throw new NotFoundException();
      const activationToken = this.generateActivationToken(user.id);
      if (!activationToken) throw new BadRequestException();
      await this.mailService.sendActivationEmail(user.email, activationToken);
      return { success: true };
    } catch {
      return { success: false };
    }
  }

  async activateAccount(token: string) {
    const payload = this.verifyActivationToken(token);
    if (!payload) {
      return {
        success: false,
        message: 'Link is expired, try again from settings!',
      };
    }

    const { isActivated } = await this.usersService.activateUser(
      payload.userId,
    );
    return {
      success: !!isActivated,
      message: !isActivated
        ? 'Something happened, try again from settings!'
        : '',
    };
  }

  generateActivationToken(userId: string) {
    try {
      return this.jwtService.sign({ userId }, { expiresIn: '1h' });
    } catch (err) {
      return null;
    }
  }

  verifyActivationToken(token: string) {
    try {
      return this.jwtService.verify(token);
    } catch (err) {
      return null;
    }
  }

  private generateTokens(payload: JwtPayload) {
    return {
      accessToken: this.jwtService.sign(payload, {
        expiresIn: this.ACCESS_TOKEN_AGE,
      }),
      refreshToken: this.jwtService.sign(payload, {
        expiresIn: this.REFRESH_TOKEN_DAYS_AGE,
      }),
    };
  }
}
