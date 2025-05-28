import { Body, Controller, Get, Post, Query, Req, Res } from '@nestjs/common';
import { type Response } from 'express';
import { AuthService } from './auth.service';
import { Auth } from './decorators/auth.decorator';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/sign-up')
  signUp(@Body() dto: SignUpDto) {
    return this.authService.signUp(dto);
  }

  @Get('activate')
  async activateAccount(
    @Query('token') token: string,
    @Res({ passthrough: true }) response: Response,
  ) {
    const res = await this.authService.activateAccount(token);
    if (!res.success) return res;
    this.authService.removeTokensFromResponse(response);
    const redirectLink = process.env.CLIENT_URL;
    return redirectLink ? response.redirect(redirectLink) : { success: true };
  }

  @Auth({ mustHaveAccess: true, withoutActivation: true })
  @Get('send-email')
  async sendActivateEmail(@Query('userId') userId: string) {
    return await this.authService.sendActivateEmail(userId);
  }

  @Post('sign-in')
  async signIn(@Body() dto: SignInDto, @Res({ passthrough: true }) res) {
    const { refreshToken, accessToken, ...result } =
      await this.authService.signIn(dto);
    await this.authService.addTokensToResponse(res, {
      refreshToken,
      accessToken,
    });
    return result;
  }

  @Auth()
  @Get('profile')
  async getProfile(@Req() req) {
    return this.authService.getProfile(req.user.sub);
  }

  @Post('logout')
  logout(@Res({ passthrough: true }) res) {
    this.authService.removeTokensFromResponse(res);
  }

  @Get('access-token')
  refreshAccessToken(@Req() req, @Res({ passthrough: true }) res) {
    return this.authService.refreshAccessToken(req, res);
  }
}
