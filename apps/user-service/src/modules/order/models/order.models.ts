import { Field, Float, ID, InputType, Int, ObjectType, registerEnumType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEnum, IsIn, IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';

export enum OrderStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  PREPARING = 'PREPARING',
  READY_FOR_PICKUP = 'READY_FOR_PICKUP',
  OUT_FOR_DELIVERY = 'OUT_FOR_DELIVERY',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
}

registerEnumType(OrderStatus, { name: 'OrderStatus' });

@ObjectType()
export class OrderItemOptionType {
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
export class OrderItemType {
  @Field(() => ID)
  @ApiProperty({ example: 'item_01' })
  itemId: string;

  @Field()
  @ApiProperty({ example: 'Margherita Classica' })
  name: string;

  @Field(() => Int)
  @ApiProperty({ example: 2 })
  quantity: number;

  @Field(() => Float)
  @ApiProperty({ example: 12.99 })
  unitPrice: number;

  @Field(() => Float)
  @ApiProperty({ example: 32.98 })
  totalPrice: number;

  @Field(() => [OrderItemOptionType], { nullable: true })
  @ApiProperty({ type: [OrderItemOptionType], required: false })
  options?: OrderItemOptionType[];
}

@ObjectType()
export class OrderSplitBreakdownType {
  @Field(() => Float)
  @ApiProperty({ example: 7.69, description: '20% Byte Add Platform Commission' })
  platformCommission: number;

  @Field(() => Float)
  @ApiProperty({ example: 25.00, description: 'Restaurant Net Payout' })
  restaurantPayout: number;

  @Field(() => Float)
  @ApiProperty({ example: 5.78, description: 'Driver Payout (Base fee + 100% tip)' })
  driverPayout: number;

  @Field(() => Float)
  @ApiProperty({ example: 30.78, description: 'Combined 80% Vendor + Driver Payout' })
  vendorDriverTotalPayout: number;
}

@ObjectType()
export class OrderType {
  @Field(() => ID)
  @ApiProperty({ example: 'ord_987654' })
  id: string;

  @Field(() => ID)
  @ApiProperty({ example: '10000000-0000-0000-0000-000000000001' })
  userId: string;

  @Field(() => ID)
  @ApiProperty({ example: '30000000-0000-0000-0000-000000000001' })
  restaurantId: string;

  @Field({ nullable: true })
  @ApiProperty({ example: "Tony's Artisan Pizza", required: false })
  restaurantName?: string;

  @Field(() => ID, { nullable: true })
  @ApiProperty({ example: '80000000-0000-0000-0000-000000000001', required: false })
  driverId?: string;

  @Field(() => OrderStatus)
  @ApiProperty({ enum: OrderStatus, example: OrderStatus.ACCEPTED })
  status: OrderStatus;

  @Field(() => [OrderItemType])
  @ApiProperty({ type: [OrderItemType] })
  items: OrderItemType[];

  @Field(() => Float)
  @ApiProperty({ example: 32.98 })
  subtotal: number;

  @Field(() => Float)
  @ApiProperty({ example: 1.65 })
  taxAmount: number;

  @Field(() => Float)
  @ApiProperty({ example: 2.49 })
  deliveryFee: number;

  @Field(() => Float)
  @ApiProperty({ example: 3.00 })
  driverTip: number;

  @Field(() => Float)
  @ApiProperty({ example: 40.12 })
  totalAmount: number;

  @Field(() => OrderSplitBreakdownType)
  @ApiProperty({ type: OrderSplitBreakdownType })
  split: OrderSplitBreakdownType;

  @Field({ nullable: true })
  @ApiProperty({ example: 'Penthouse 4B, MG Road Boulevard', required: false })
  deliveryAddress?: string;

  @Field({ nullable: true })
  @ApiProperty({ example: 'Leave at front door', required: false })
  deliveryNotes?: string;

  @Field(() => Float)
  @ApiProperty({ example: 1727435000000 })
  createdAt: number;

  @Field(() => Float)
  @ApiProperty({ example: 1727435000000 })
  updatedAt: number;
}

@InputType()
export class CheckoutInput {
  @Field({ nullable: true })
  @ApiProperty({ example: 'Penthouse 4B, MG Road Boulevard', required: false })
  @IsOptional()
  @IsString()
  deliveryAddress?: string;

  @Field(() => Float)
  @ApiProperty({ example: 12.9716 })
  @IsNumber()
  destinationLat: number;

  @Field(() => Float)
  @ApiProperty({ example: 77.5946 })
  @IsNumber()
  destinationLng: number;

  @Field({ nullable: true })
  @ApiProperty({ example: 'Ring the doorbell twice', required: false })
  @IsOptional()
  @IsString()
  deliveryNotes?: string;

  @Field(() => Float, { nullable: true, defaultValue: 0 })
  @ApiProperty({ example: 3.00, required: false, default: 0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  driverTip?: number;
}

@InputType()
export class UpdateOrderStatusInput {
  @Field(() => OrderStatus)
  @ApiProperty({ enum: OrderStatus, example: OrderStatus.PREPARING })
  @IsEnum(OrderStatus)
  status: OrderStatus;

  @Field({ nullable: true })
  @ApiProperty({ example: 'Order confirmed and ingredients prepped', required: false })
  @IsOptional()
  @IsString()
  reason?: string;
}

@InputType()
export class SubmitReviewInput {
  @Field(() => Int, { nullable: true })
  @ApiProperty({ example: 5, minimum: 1, maximum: 5, required: false })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(5)
  foodRating?: number;

  @Field(() => Int, { nullable: true })
  @ApiProperty({ example: 5, minimum: 1, maximum: 5, required: false })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(5)
  driverRating?: number;

  @Field({ nullable: true })
  @ApiProperty({ example: 'Authentic crust and perfect truffle aroma!', required: false })
  @IsOptional()
  @IsString()
  foodReview?: string;

  @Field({ nullable: true })
  @ApiProperty({ example: 'Delivered scorching hot and with care.', required: false })
  @IsOptional()
  @IsString()
  driverReview?: string;

  @Field(() => [String], { nullable: true })
  @ApiProperty({ example: ['Fast Delivery', 'Great Packaging', 'Fresh Food'], required: false })
  @IsOptional()
  @IsArray()
  complimentTags?: string[];
}

@InputType()
export class AddTipInput {
  @Field(() => Float)
  @ApiProperty({ example: 5.00, minimum: 1 })
  @IsNumber()
  @Min(1)
  tipAmount: number;
}

@InputType()
export class RefundOrderInput {
  @Field(() => Float, { nullable: true })
  @ApiProperty({ example: 40.12, required: false })
  @IsOptional()
  @IsNumber()
  @Min(0.01)
  amount?: number;

  @Field()
  @ApiProperty({ example: 'Customer reported missing item or cold packaging' })
  @IsNotEmpty()
  @IsString()
  reason: string;
}

export class ChatMessageDto {
  @ApiProperty({ example: 'ord_987654' })
  @IsNotEmpty()
  @IsString()
  orderId: string;

  @ApiProperty({ example: 'I am downstairs at the lobby.' })
  @IsNotEmpty()
  @IsString()
  message: string;
}

export class DriverLocationBroadcastDto {
  @ApiProperty({ example: 'ord_987654' })
  @IsNotEmpty()
  @IsString()
  orderId: string;

  @ApiProperty({ example: '80000000-0000-0000-0000-000000000001' })
  @IsNotEmpty()
  @IsString()
  driverId: string;

  @ApiProperty({ example: 12.9772 })
  @IsNumber()
  lat: number;

  @ApiProperty({ example: 77.6008 })
  @IsNumber()
  lng: number;

  @ApiProperty({ example: 180, required: false })
  @IsOptional()
  @IsNumber()
  bearing?: number;

  @ApiProperty({ example: 32.5, required: false })
  @IsOptional()
  @IsNumber()
  speed?: number;
}
