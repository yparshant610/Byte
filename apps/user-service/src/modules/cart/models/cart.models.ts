import { Field, Float, ID, InputType, Int, ObjectType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString, Min, ValidateNested } from 'class-validator';

@ObjectType()
export class CartSelectedOptionType {
  @Field()
  @ApiProperty({ example: 'Size' })
  groupName: string;

  @Field()
  @ApiProperty({ example: '12 inch Medium' })
  choiceName: string;

  @Field(() => Float)
  @ApiProperty({ example: 3.50 })
  additionalPrice: number;
}

@ObjectType()
export class CartItemType {
  @Field(() => ID)
  @ApiProperty({ example: 'm0000001-0000-0000-0000-000000000001' })
  itemId: string;

  @Field()
  @ApiProperty({ example: 'Margherita Classica' })
  name: string;

  @Field(() => Int)
  @ApiProperty({ example: 2 })
  quantity: number;

  @Field(() => Float)
  @ApiProperty({ example: 12.99 })
  basePrice: number;

  @Field(() => [CartSelectedOptionType])
  @ApiProperty({ type: [CartSelectedOptionType] })
  selectedOptions: CartSelectedOptionType[];

  @Field(() => Float)
  @ApiProperty({ example: 16.49 })
  unitPrice: number;

  @Field(() => Float)
  @ApiProperty({ example: 32.98 })
  itemTotal: number;
}

@ObjectType()
export class CartType {
  @Field(() => ID)
  @ApiProperty({ example: 'u0000001-0000-0000-0000-000000000001' })
  userId: string;

  @Field(() => ID)
  @ApiProperty({ example: 'r0000001-0000-0000-0000-000000000001' })
  restaurantId: string;

  @Field()
  @ApiProperty({ example: "Tony's Artisan Pizza" })
  restaurantName: string;

  @Field(() => [CartItemType])
  @ApiProperty({ type: [CartItemType] })
  items: CartItemType[];

  @Field(() => Float)
  @ApiProperty({ example: 32.98 })
  subtotal: number;

  @Field(() => Int)
  @ApiProperty({ example: 2 })
  itemCount: number;

  @Field(() => Float)
  @ApiProperty({ example: 1727435000000 })
  updatedAt: number;
}

@InputType()
export class SelectedOptionInput {
  @Field()
  @ApiProperty({ example: 'Size' })
  @IsNotEmpty()
  @IsString()
  groupName: string;

  @Field()
  @ApiProperty({ example: '12 inch Medium' })
  @IsNotEmpty()
  @IsString()
  choiceName: string;

  @Field(() => Float)
  @ApiProperty({ example: 3.50 })
  @IsNumber()
  additionalPrice: number;
}

@InputType()
export class AddToCartInput {
  @Field(() => ID)
  @ApiProperty({ example: 'r0000001-0000-0000-0000-000000000001' })
  @IsNotEmpty()
  @IsString()
  restaurantId: string;

  @Field()
  @ApiProperty({ example: "Tony's Artisan Pizza" })
  @IsNotEmpty()
  @IsString()
  restaurantName: string;

  @Field(() => ID)
  @ApiProperty({ example: 'm0000001-0000-0000-0000-000000000001' })
  @IsNotEmpty()
  @IsString()
  itemId: string;

  @Field()
  @ApiProperty({ example: 'Margherita Classica' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @Field(() => Int)
  @ApiProperty({ example: 2 })
  @IsNumber()
  @Min(1)
  quantity: number;

  @Field(() => Float)
  @ApiProperty({ example: 12.99 })
  @IsNumber()
  basePrice: number;

  @Field(() => [SelectedOptionInput], { nullable: true })
  @ApiProperty({ type: [SelectedOptionInput], required: false })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SelectedOptionInput)
  selectedOptions?: SelectedOptionInput[];

  @Field({ nullable: true, defaultValue: false })
  @ApiProperty({ example: false, required: false, description: 'Set true to wipe existing cart from another restaurant' })
  @IsOptional()
  @IsBoolean()
  clearExisting?: boolean;
}

@InputType()
export class UpdateCartItemInput {
  @Field(() => Int)
  @ApiProperty({ example: 3 })
  @IsNumber()
  @Min(0)
  quantity: number;
}
