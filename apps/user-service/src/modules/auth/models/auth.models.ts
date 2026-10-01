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

  @Field({ nullable: true })
  phone?: string;

  @Field({ nullable: true })
  restaurantId?: string;

  @Field({ nullable: true })
  restaurantName?: string;
}

@ObjectType()
export class AuthPayload {
  @Field()
  accessToken: string;

  @Field(() => UserType)
  user: UserType;

  @Field(() => String, { nullable: true })
  restaurantId?: string;

  @Field(() => String, { nullable: true })
  restaurantName?: string;
}

@ObjectType()
export class OtpResponse {
  @Field()
  success: boolean;

  @Field()
  message: string;

  @Field({ nullable: true })
  debugOtp?: string;
}

@InputType()
export class RequestOtpInput {
  @Field()
  @ApiProperty({ example: 'tony@tonyspizza.com' })
  @IsEmail()
  email: string;

  @Field({ nullable: true })
  @ApiProperty({ example: 'RESTAURANT_OWNER', required: false })
  role?: string;
}

@InputType()
export class VerifyOtpSignupInput {
  @Field()
  @ApiProperty({ example: 'tony@tonyspizza.com' })
  @IsEmail()
  email: string;

  @Field()
  @ApiProperty({ example: '123456' })
  @IsNotEmpty()
  @IsString()
  otp: string;

  @Field()
  @ApiProperty({ example: 'SecurePassword123!' })
  @MinLength(6)
  password: string;

  @Field({ nullable: true })
  @ApiProperty({ example: 'Tony Romano', required: false })
  fullName?: string;

  @Field({ nullable: true })
  @ApiProperty({ example: '+1 555-010-1002', required: false })
  phone?: string;

  @Field({ nullable: true })
  @ApiProperty({ example: 'RESTAURANT_OWNER', required: false })
  role?: string;

  @Field({ nullable: true })
  @ApiProperty({ example: "Tony's Artisan Pizza", required: false })
  restaurantName?: string;
}

@InputType()
export class LoginInput {
  @Field()
  @ApiProperty({ example: 'tony@tonyspizza.com' })
  @IsEmail()
  email: string;

  @Field()
  @ApiProperty({ example: 'SecurePassword123!' })
  @IsNotEmpty()
  password: string;
}
