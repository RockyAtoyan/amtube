import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import { DbService } from './../db/db.service';
import { FileService } from './../file/file.service';
import { UsersService } from './../users/users.service';
import { JwtPayload } from './auth.types';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';

@Injectable()
export class AuthService {
  private ACCESS_TOKEN_AGE = '15s'; // 7 days
  private REFRESH_TOKEN_AGE = 1000 * 60 * 60 * 24 * 7; // 7 days
  private REFRESH_TOKEN_DAYS_AGE =
    String(this.REFRESH_TOKEN_AGE / (1000 * 60 * 60 * 24)) + 'd';
  private REFRESH_TOKEN_COOKIE_NAME = 'REFRESH_TOKEN';

  constructor(
    private dbService: DbService,
    private usersService: UsersService,
    private fileService: FileService,
    private jwtService: JwtService,
  ) {}

  async signUp(dto: SignUpDto) {
    const userWithSameEmail = await this.usersService.findByEmail(dto.email);
    const userWithSameName = await this.usersService.findByName(dto.name);
    if (userWithSameEmail || userWithSameName)
      throw new BadRequestException('User already exists!');
    const password = bcrypt.hashSync(dto.password, 7);
    const newUser = await this.usersService.create({
      ...dto,
      password,
    });
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
