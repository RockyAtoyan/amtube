import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsStrongPassword,
  MaxLength,
  MinLength,
} from 'class-validator';

export class SignUpDto {
  @ApiProperty()
  @IsEmail({}, { message: 'Invalid email address!' })
  email: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Name is required!' })
  @MinLength(3, { message: 'Name must be at least 3 characters long!' })
  @MaxLength(15, { message: 'Name must be less than 15 characters long!' })
  name: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Password is required!' })
  @IsStrongPassword({}, { message: 'Password is not strong enough!' })
  password: string;
}
