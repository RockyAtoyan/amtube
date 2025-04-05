import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class SignInDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'Email is required!' })
  email: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Password is required!' })
  password: string;
}
