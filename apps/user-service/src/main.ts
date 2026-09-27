import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global HTTP API Prefix
  app.setGlobalPrefix('api/v1', {
    exclude: ['graphql'],
  });

  // Global Validation Pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: false,
    }),
  );

  // Global Exception Filter
  app.useGlobalFilters(new HttpExceptionFilter());

  // CORS
  app.enableCors();

  // Swagger / OpenAPI Specification Configuration
  const config = new DocumentBuilder()
    .setTitle('Food Byte - User Backend API')
    .setDescription(
      'Living SRS & OpenAPI Specification for the Food Byte consumer client application. Covers Authentication, Redis Cart, Geospatial Restaurant Discovery (under 10 km), and Fleet Dispatch.',
    )
    .setVersion('1.0.0')
    .addBearerAuth()
    .addTag('Authentication', 'Consumer onboarding, NodeMailer OTP & Token Bucket rate limiting')
    .addTag('Restaurants', 'Redis Geospatial discovery within constant 10 km radius')
    .addTag('Shopping Cart', 'Redis active cart, single-restaurant validation, and options pricing')
    .addTag('Fleet Dispatch & Telemetry', 'Driver real-time location indexing & proximity assignment')
    .addTag('Orders & Payments', 'Razorpay split payment (80/20) and webhooks')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    customSiteTitle: 'Food Byte API Documentation',
  });

  const port = process.env.PORT || 4000;
  await app.listen(port);

  console.log(`\n======================================================`);
  console.log(`🚀 Food Byte User Backend running successfully!`);
  console.log(`📡 REST API Base:     http://localhost:${port}/api/v1`);
  console.log(`📑 Swagger / OpenAPI: http://localhost:${port}/api/docs`);
  console.log(`🔮 GraphQL Endpoint:  http://localhost:${port}/graphql`);
  console.log(`======================================================\n`);
}

bootstrap();
