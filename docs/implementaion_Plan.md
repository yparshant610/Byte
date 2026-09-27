# Monorepo Backend Implementation Plan: Food Delivery Platform

This plan outlines the step-by-step implementation for building the backend services inside a **Turborepo** monorepo managed with **pnpm workspaces**. It enforces an **MVC (Model-View-Controller / Model-Resolver-Service)** pattern across services, starting with the **User Application (`Food Byte`) Backend**.

---

## 1. Monorepo Architecture Setup

### 1.1 Tooling & Workspace Layout

- **Build System**: [Turborepo](https://turbo.build/repo?utm_source=gemini)
- **Package Manager**: `pnpm` (with workspaces enabled via `pnpm-workspace.yaml`)
- **Base Architecture**: Monorepo with dedicated apps per domain service and shared packages for contracts, database schema, configs, and utilities.

### 1.2 Directory Structure

```text
food-delivery-monorepo/
├── apps/
│   ├── user-service/           # User App Backend (Food Byte) - NestJS [GraphQL & REST]
│   ├── restaurant-service/     # Restaurant App Backend (Food Byters) - NestJS [REST]
│   ├── driver-service/         # Driver App Backend (Drive Byte) - NestJS [GraphQL & REST]
│   └── admin-service/          # Admin App Backend (Byte Add) - NestJS [REST]
├── packages/
│   ├── database/               # Supabase / Prisma / Drizzle schema, migrations & seed scripts
│   ├── openapi-specs/          # Swagger / OpenAPI yaml/json specifications (Contract source of truth)
│   ├── graphql-types/          # Shared GraphQL schema, types, and codegen
│   ├── redis-cache/            # Shared Redis clients, cart helpers & rate-limiting logic
│   ├── shared-utils/           # Common utilities, logger, custom exceptions, JWT guards
│   ├── tsconfig/               # Shared TypeScript configurations
│   └── eslint-config/          # Shared linting configs
├── docker/
│   ├── docker-compose.yml      # Local development environment (Supabase/Postgres, Redis)
│   └── Dockerfile.*            # Per-service production Dockerfiles
├── pnpm-workspace.yaml
├── turbo.json
└── package.json

```

---

## 2. Architecture & Design Principles

### 2.1 MVC Architecture Standard

To avoid ad-hoc code structures, every NestJS service must adhere strictly to a clean **MVC / Resolver-Service-Model** separation:

- **Model (`models/` / `entities/`)**:
- Data definitions, database entities, validation rules, and DTOs (Data Transfer Objects).

- **Controller / Resolver (`controllers/` / `resolvers/`)**:
- **Controllers (HTTP / REST)**: Handle incoming HTTP requests, route management, parameter extraction, and status codes.
- **Resolvers (GraphQL)**: Handle queries, mutations, subscriptions, and GraphQL input types for mobile clients.
- _Rule_: No business logic in controllers/resolvers. They only parse inputs, call services, and return responses.

- **Service / Business Logic (`services/`)**:
- Core domain workflows, external integrations (Razorpay, Google Maps, S3, NodeMailer), transactional boundaries, and repository calls.

### 2.2 Dual API Strategy

- **GraphQL**: Primary interface for **Mobile Clients** (`Food Byte`, `Drive Byte`) to minimize payload sizes, avoid over-fetching, and handle nested relations (e.g., cart $\rightarrow$ items $\rightarrow$ addons).
- **REST (HTTP/HTTPS)**: Primary interface for **Web/Browser Clients** (`Food Byters`, `Byte Add`) and standard webhook integrations (Razorpay, third-party callbacks).

---

## 3. Phase-by-Phase Implementation Plan

### Phase 1: Monorepo Bootstrapping & Shared Packages

1. **Initialize Turborepo & pnpm workspace**:

- Create `pnpm-workspace.yaml`, `turbo.json`, and root `package.json`.
- Configure caching pipelines for `build`, `lint`, `test`, `codegen`, and `dev`.

2. **Setup Shared Packages**:

- `@repo/tsconfig` & `@repo/eslint-config`.
- `@repo/shared-utils`: Reusable JWT handlers, standard error filters, and Token Bucket rate-limiting algorithm.
- `@repo/redis-cache`: Shared Redis connection abstraction for cart persistence and rate limits.

3. **Local Docker Environment**:

- Configure `docker/docker-compose.yml` for local PostgreSQL (or local Supabase CLI) and Redis.

---

### Phase 2: User Backend (`Food Byte`) — Data Modeling & Schemas

_Target Service: `apps/user-service` + `packages/database_`

1. **Entity & Schema Design**:

- **User & Auth**: ID, email, password hash, role (`user`), location coordinates (`latitude`, `longitude`, `geog`), permissions flag, timestamps.
- **Restaurants & Menus**: Restaurant profile, lat/long geohash, active status, menu categories, menu items, prices, add-on groups.
- **Cart & Wishlist**: Wishlist entities in DB; active cart session models mapped to Redis structures.
- **Orders & Payments**: Order status, order line items, payment status, Razorpay transaction ID, platform commission split fields.
- **Tracking & Delivery**: Order tracking states, driver allocation reference, delivery destination coordinates.

2. **Setup Schema Migrations**:

- Implement migrations in `packages/database` against Supabase / PostgreSQL.
- Enable PostGIS extension for geospatial queries (calculating $\le 10\text{ km}$ radius).

---

### Phase 3: Swagger API Contracts & Verification (Contract-First Design)

_Target: `packages/openapi-specs` & Swagger UI verification_

1. **Define OpenAPI / Swagger Specification**:

- Document all REST endpoints in `packages/openapi-specs/user-api.yaml`:
- Public Auth: `/auth/signup`, `/auth/verify-otp`, `/auth/signin`, `/auth/forgot-password`, `/auth/reset-password`.
- User Profile & Permissions: `/user/location`, `/user/notification-consent`.
- Webhooks: `/payments/razorpay-webhook`.

2. **Verification & Review**:

- Spin up Swagger UI mock server or NestJS Swagger module (`@nestjs/swagger`).
- Validate schema compliance, request payloads, response bodies, HTTP status codes, and error formats against the functional requirements.

---

### Phase 4: Seed Data & Database Initialization

_Target: `packages/database/seeds_`

1. **Create Seed Scripts**:

- Seed test user profiles.
- Seed sample restaurants with realistic GPS coordinates (clustered around test locations).
- Seed hierarchical menus (Categories: _Starters, Mains, Beverages_; Items: _Variants, Add-ons, Pricing_).

2. **Run & Verify Seed Migrations**:

- Execute seeds via `pnpm --filter @repo/database seed`.
- Test spatial query: verify restaurants query correctly returns items strictly within a 10 km bounding radius.

---

### Phase 5: GraphQL Implementation for User Mobile Application (`Food Byte`)

_Target: `apps/user-service` (MVC Architecture)_

1. **NestJS GraphQL Module Configuration**:

- Configure code-first or schema-first GraphQL engine in `apps/user-service`.

2. **Model Layer (`src/modules/*/models/`)**:

- GraphQL Object Types, Input Types, and Arguments matching the database models.

3. **Service Layer (`src/modules/*/services/`)**:

- `AuthService`: NodeMailer OTP generation, Token Bucket rate-limiting, password hashing, Supabase/JWT auth token issue.
- `RestaurantService`: PostGIS radius search ($\le 10\text{ km}$), menu browsing.
- `CartService`: Redis operations (`HSET`, `HGET`, `EXPIRE`) for fast add/remove/update cart actions.
- `WishlistService`: Persistent wishlist operations.
- `OrderService`: Order initiation, Razorpay checkout order generation, delivery status transition.

4. **Resolver Layer (`src/modules/*/resolvers/`)**:

- **Queries**:
- `nearbyRestaurants(lat: Float!, lng: Float!, radiusKm: Float = 10)`
- `restaurantDetails(id: ID!)`
- `getCart`
- `getWishlist`
- `orderStatus(orderId: ID!)`

- **Mutations**:
- `requestOtp(email: String!)`
- `verifyOtpAndSignup(email: String!, otp: String!, password: String!)`
- `login(email: String!, password: String!)`
- `updateUserLocation(lat: Float!, lng: Float!)`
- `addToCart(input: CartItemInput!)`
- `removeFromCart(itemId: ID!)`
- `createOrder(cartId: ID!, deliveryAddressId: ID!)`
- `submitReview(orderId: ID!, rating: Int!, comment: String)`

---

### Phase 6: REST Endpoints & Authentication Guards

_Target: `apps/user-service_`

1. **Authentication Middleware & Guards**:

- Public routes: Bypass authentication.
- Private routes / private GraphQL operations: Protected via `JwtAuthGuard`.
- Logout handling: Blacklist / revoke tokens in Redis and clear client-side auth cookies.

2. **REST Controllers**:

- Expose webhook receivers (e.g., Razorpay payment verification webhooks).
- Ensure standard HTTP status handling and input validation pipes (`ValidationPipe`, `class-validator`).

---

### Phase 7: Subsequent Application Services (Phased Rollout)

Once the User Backend is functional and verified:

1. **Restaurant Backend (`apps/restaurant-service`)**:

- REST-based MVC service for menu management, order acceptance/rejection, and preparation status updates.

2. **Driver Backend (`apps/driver-service`)**:

- GraphQL + WebSocket/REST service for location pinging, delivery assignment acceptance (`pay + accept`), and live routing.

3. **Admin Backend (`apps/admin-service`)**:

- REST-based MVC service for merchant approval, fleet onboarding, dispute resolution, and commission tracking.

---

## 4. Immediate Next Steps

To begin execution:

1. Initialize the Turborepo workspace with `pnpm` and create the base folder structure.
2. Create `packages/database` and establish the initial PostgreSQL schema / migrations for User, Restaurant, and Menu entities.
3. Generate the Swagger / OpenAPI specification for the User Backend to lock down the contracts.
