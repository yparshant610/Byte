import { Field, Float, ID, ObjectType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';

@ObjectType()
export class OrderType {
  @Field(() => ID)
  @ApiProperty({ example: 'ord_987654' })
  id: string;

  @Field(() => ID)
  @ApiProperty({ example: 'r0000001-0000-0000-0000-000000000001' })
  restaurantId: string;

  @Field()
  @ApiProperty({ example: 'ACCEPTED' })
  status: string;

  @Field(() => Float)
  @ApiProperty({ example: 32.98 })
  subtotal: number;

  @Field(() => Float)
  @ApiProperty({ example: 2.49 })
  deliveryFee: number;

  @Field(() => Float)
  @ApiProperty({ example: 3.00 })
  driverTip: number;

  @Field(() => Float)
  @ApiProperty({ example: 38.47 })
  totalAmount: number;

  @Field(() => Float)
  @ApiProperty({ example: 7.69, description: '20% platform commission' })
  adminCommission: number;

  @Field(() => Float)
  @ApiProperty({ example: 30.78, description: '80% vendor + driver payout' })
  vendorDriverPayout: number;
}
