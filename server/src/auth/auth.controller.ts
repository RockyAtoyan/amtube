import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/sign-up')
  signUp(@Body() dto: SignUpDto) {
    return this.authService.signUp(dto);
  }

  @Post('sign-in')
  async signIn(@Body() dto: SignInDto, @Res({ passthrough: true }) res) {
    const { refreshToken, ...result } = await this.authService.signIn(dto);
    await this.authService.addTokenToResponse(res, refreshToken);
    return result;
  }

  @Post('/logout')
  logout(@Res({ passthrough: true }) res) {
    this.authService.removeTokenFromResponse(res);
  }

  @Get('/access-token')
  refreshAccessToken(@Req() req, @Res({ passthrough: true }) res) {
    return this.authService.refreshAccessToken(req, res);
  }
}
