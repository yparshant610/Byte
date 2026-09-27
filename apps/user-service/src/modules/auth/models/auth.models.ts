import { Field, ID, InputType, ObjectType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

@ObjectType()
export class UserType {
  @Field(() => ID)
  id: string;

  @Field()
  email: string;

  @Field({ nullable: true })
  fullName?: string;

  @Field()
  role: string;
}

@ObjectType()
export class AuthPayload {
  @Field()
  accessToken: string;

  @Field(() => UserType)
  user: UserType;
}

@ObjectType()
export class OtpResponse {
  @Field()
  success: boolean;

  @Field()
  message: string;
}

@InputType()
export class RequestOtpInput {
  @Field()
  @ApiProperty({ example: 'consumer@foodbytes.app' })
  @IsEmail()
  email: string;
}

@InputType()
export class VerifyOtpSignupInput {
  @Field()
  @ApiProperty({ example: 'consumer@foodbytes.app' })
  @IsEmail()
  email: string;

  @Field()
  @ApiProperty({ example: '123456' })
  @IsNotEmpty()
  @IsString()
  otp: string;

  @Field()
  @ApiProperty({ example: 'SecurePassword123!' })
  @MinLength(8)
  password: string;

  @Field({ nullable: true })
  @ApiProperty({ example: 'Alex Johnson', required: false })
  fullName?: string;
}

@InputType()
export class LoginInput {
  @Field()
  @ApiProperty({ example: 'consumer@foodbytes.app' })
  @IsEmail()
  email: string;

  @Field()
  @ApiProperty({ example: 'SecurePassword123!' })
  @IsNotEmpty()
  password: string;
}
