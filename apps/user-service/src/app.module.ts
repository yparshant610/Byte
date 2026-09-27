import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { AuthModule } from './modules/auth/auth.module';
import { CartModule } from './modules/cart/cart.module';
import { DispatchModule } from './modules/dispatch/dispatch.module';
import { OrderModule } from './modules/order/order.module';
import { MailModule } from './modules/mail/mail.module';
import { RedisProviderModule } from './modules/redis/redis-provider.module';
import { RestaurantModule } from './modules/restaurant/restaurant.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '.env.local'],
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      playground: true,
      path: '/graphql',
      context: ({ req, res }: any) => ({ req, res }),
    }),
    RedisProviderModule,
    MailModule,
    AuthModule,
    RestaurantModule,
    CartModule,
    DispatchModule,
    OrderModule,
  ],
})
export class AppModule {}
