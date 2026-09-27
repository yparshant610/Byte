# Food Bytes Ecosystem — Master Implementation Plan (All Milestones)

## 1. System Ecosystem & Architectural Overview

The **Food Bytes** ecosystem is a distributed food delivery platform consisting of **four distinct client applications** communicating with a unified **Nest.js backend**, powered by **PostgreSQL (Supabase)**, **Redis (Geospatial & In-Memory State)**, **AWS S3**, and **Razorpay Split Payments**.

```
                                  +-------------------------------------------------------------+
                                  |                        Client Layer                         |
                                  |   [Food Byte]     [Drive Byte]    [Food Byters]   [Byte Add]|
                                  |  (React Native)  (React Native)   (React + MUI)  (React+MUI)|
                                  |    (Consumer)       (Driver)       (Restaurant)    (Admin)  |
                                  +------------------------------+------------------------------+
                                                                 |
                                                                 | HTTPS / REST + GraphQL + WS
                                                                 v
                                  +-------------------------------------------------------------+
                                  |                  Nest.js Backend (Docker)                   |
                                  |             Swagger / OpenAPI as Formal Contract            |
                                  +----+----------------+---------------+-------------+---------+
                                       |                |               |             |
                   +-------------------+                v               v             +-----------------+
                   v                              +-----------+  +-------------+                        v
           +---------------+                      |   Redis   |  |  Razorpay   |                  +-----------+
           |    Supabase   |                      | (Cart,    |  |   (Split    |                  |  AWS S3   |
           | (Postgres DB  |                      |  Geo &    |  |  Payments:  |                  |  (Media & |
           |    + Auth)    |                      |  Session) |  |   80 / 20)  |                  |   Docs)   |
           +---------------+                      +-----------+  +-------------+                  +-----------+
```

---

## Milestone 1: Data Modeling, Relational Architecture & Mock Datasets

### Objective
Establish the relational data foundations, entity relationships, identity structures, and synthetic geospatial datasets.

### Detailed Scope & Tasks
1. **Relational Database Modeling (Supabase / PostgreSQL)**:
   - **User & RBAC**: `User`, `Role` (`CONSUMER`, `DRIVER`, `RESTAURANT_OWNER`, `ADMIN`), `UserProfile`, `UserAddress`.
   - **Restaurant & Menu Hierarchy**:
     - `Restaurant`: dossier details, business hours, contact, base geolocation (`latitude`, `longitude`, `geog` PostGIS point), operational status (`PENDING_APPROVAL`, `ACTIVE`, `SUSPENDED`).
     - `MenuCategory`: display order, active status.
     - `MenuItem`: title, description, base price, image URL, dietary flags (vegan, gluten-free, spicy), availability.
     - `MenuItemOptionGroup` & `MenuItemOption`: customizable options (e.g. Size, Crust, Add-on toppings with incremental pricing, minimum/maximum selection constraints).
   - **Orders & Financial Transactions**:
     - `Order`: consumer ID, restaurant ID, driver ID, status, delivery address, order breakdown (subtotal, delivery fee, taxes, platform fee, tip, total).
     - `OrderItem` & `OrderItemOption`: snapshot of items and selected customization at time of purchase.
     - `PaymentTransaction`: Razorpay payment ID, order ID, split distribution (80% vendor/driver, 20% admin commission), payment status.
   - **Reviews, Disputes & KYC**:
     - `Review`: order ID, food rating (1–5), driver rating (1–5), comments, compliment tags.
     - `DriverKYC`: vehicle details, license, insurance, onboarding status (`PENDING`, `APPROVED`).
     - `Dispute`: order ID, raised by, reason, evidence URLs, resolution status.

2. **Synthetic Data Generation & Spatial Seeding**:
   - Seed realistic restaurant clusters centered in test cities with real coordinates.
   - Seed menu trees with prices, options, and photo URLs matching the `stitch_full_project_revamp` visual catalog.
   - Seed drivers with initial GPS coordinates within a 1–10 km range of restaurant nodes.

---

## Milestone 2: Core Backend Services, Redis Ephemeral State & Geospatial Engine

### Objective
Implement the high-performance Redis in-memory engine, the sub-millisecond cart, constant-time geospatial restaurant discovery ($\le 10\text{ km}$), proximity driver matching, and secure token-bucket authentication.

### Detailed Scope & Tasks

#### 2.1 Backend Scaffolding & Redis Infrastructure
- Standardized Nest.js modular architecture with TypeScript.
- Resilient Redis service (`ioredis`) supporting clustered/standalone Redis, environment configuration, and auto-reconnection.
- Unified key architecture:
  - `cart:{userId}`
  - `restaurants:geo`
  - `restaurant:{id}:meta`
  - `drivers:available:geo`
  - `driver:{id}:status`
  - `lock:order:dispatch:{orderId}`

#### 2.2 Redis Shopping Cart Engine (`/api/v1/cart`)
- **Key Pattern**: `cart:{userId}` with sliding 24-hour expiration (`EXPIRE 86400`).
- **Single-Merchant Integrity**: Throws a conflict exception if an item from another restaurant is added, requiring user confirmation (`clearExisting: true`).
- **Options Pricing Engine**: Dynamically calculates unit price based on base dish price + selected option increments.
- **Cart Mutation Endpoints**:
  - `GET /cart`: Retrieve current cart, computed subtotal, item counts.
  - `POST /cart/items`: Add line item with variant options and quantity.
  - `PATCH /cart/items/:itemId`: Increment/decrement quantity or adjust options.
  - `DELETE /cart/items/:itemId`: Remove specific item.
  - `DELETE /cart`: Clear the entire cart.

#### 2.3 Geospatial Restaurant Discovery Engine ($\le 10\text{ km}$)
- **Coordinate Indexing**:
  ```bash
  GEOADD restaurants:geo <longitude> <latitude> <restaurantId>
  ```
- **Metadata Cache**: `restaurant:{id}:meta` (JSON payload containing name, cuisine, rating, prep time, banner, status).
- **Proximity Discovery API (`GET /api/v1/restaurants/nearby?lat=...&lng=...&radiusKm=10`)**:
  - Primary execution via Redis:
    ```bash
    GEOSEARCH restaurants:geo FROMLONLAT <user_lon> <user_lat> BYRADIUS 10 km ASC WITHDIST WITHCOORD
    ```
  - Yields constant-time, sub-millisecond listings sorted strictly by ascending distance.
  - Fallback pipeline: Haversine mathematical query / PostGIS `ST_DWithin` from PostgreSQL to warm up cache if empty.
- **Admin/Merchant Sync (`POST /api/v1/restaurants/geo-index`)**: Automatically updates or invalidates coordinates when a restaurant's operational status or location changes.

#### 2.4 Delivery Partner (Driver) Geospatial Dispatch Engine
- **Telemetry Ingestion (`POST /api/v1/drivers/location`)**:
  - Driver mobile app sends GPS pings every 10–15 seconds.
  - Updates `drivers:available:geo` and sets heartbeat `driver:{driverId}:status` (`ONLINE`, `BUSY`, `OFFLINE`).
- **Proximity Driver Matching (`POST /api/v1/dispatch/assign-order/:orderId`)**:
  1. Retrieve restaurant coordinate via `GEOPOS restaurants:geo <restaurantId>`.
  2. Search for the nearest $K$ available drivers within $3\text{ km} - 5\text{ km}$ of the restaurant:
     ```bash
     GEOSEARCH drivers:available:geo FROMLONLAT <rest_lon> <rest_lat> BYRADIUS 5 km ASC WITHDIST COUNT 5
     ```
  3. **Atomic Claim & Race-Condition Guard**:
     - Remove the assigned driver from `drivers:available:geo` (`ZREM`) and set status to `RESERVED_FOR_ORDER_{orderId}`.
     - Prevents multiple concurrent orders from being assigned to the same driver.

#### 2.5 Security, Authentication & Rate Limiting
- **Authentication**: Supabase Auth integration, JWT Bearer passport strategy.
- **Signup Flow with NodeMailer OTP**:
  $$\text{Email Submission} \longrightarrow \text{NodeMailer OTP} \longrightarrow \text{OTP Verification} \longrightarrow \text{Password Creation}$$
- **Token Bucket Rate Limiting**: Redis-backed token bucket algorithm applied to OTP dispatch, login attempts, and password reset endpoints.
- **Logout / Invalidation**: Server-side JWT blacklisting in Redis upon logout.

#### 2.6 Living SRS Contract (Swagger / OpenAPI)
- Complete OpenAPI 3.0 specification exposed at `/api/docs`.
- Decorated DTOs with validation rules (`class-validator`) and schemas.

---

## Milestone 3: Order Lifecycle, Dispatch Orchestration & Split Payments

### Objective
Construct the order processing engine, integrate Razorpay multi-split payments ($80/20$), build the state machine, and establish real-time socket events.

### Detailed Scope & Tasks

#### 3.1 Order State Machine
- Lifecycle stages:
  $$\text{PENDING} \longrightarrow \text{ACCEPTED} \longrightarrow \text{PREPARING} \longrightarrow \text{OUT\_FOR\_DELIVERY} \longrightarrow \text{DELIVERED} \ (\text{or } \text{CANCELLED})$$
- State transitions strictly guarded by actor role (e.g. only Merchant can trigger `PREPARING`, only Driver can trigger `OUT_FOR_DELIVERY` and `DELIVERED`).

#### 3.2 Razorpay Variable Split Payment Integration
- Integration of Razorpay Route API for automated vendor payouts:
  $$\text{Total Paid} = \text{Subtotal} + \text{Taxes} + \text{Delivery Fee} + \text{Tip}$$
  $$\text{Vendor + Driver Payout} = 80\% \quad \big| \quad \text{Byte Add Commission} = 20\%$$
- Webhook signature validation (`payment.captured`, `payment.failed`, `refund.processed`).
- Refund & dispute reconciliation mechanics.

#### 3.3 Real-Time Dispatch & WebSocket Gateway
- WebSocket / Socket.io gateway for live updates:
  - Event `order:status_updated` $\rightarrow$ broadcast to Customer and Merchant.
  - Event `driver:location_broadcast` $\rightarrow$ push live driver GPS coordinates to Customer tracking map.
  - Event `courier:message_sent` $\rightarrow$ bidirectional chat between Customer and Driver.

#### 3.4 Feedback, Rating & Tipping
- Endpoints for submitting dual star ratings (Restaurant Food & Driver Delivery).
- Driver tip disbursement directly mapped to driver's payout ledger.

---

## Milestone 4: Client Applications Implementation

### Objective
Develop the four dedicated client applications, connecting them directly to the backend APIs.

```
┌────────────────────────────────────────────────────────────────────────┐
│                        4 CLIENT APPLICATIONS                           │
├───────────────────┬───────────────────┬────────────────────────────────┤
│ App Name          │ Target Audience   │ Platform & Primary Stack       │
├───────────────────┼───────────────────┼────────────────────────────────┤
│ 1. Food Byte      │ Consumer          │ React Native (iOS / Android)   │
│ 2. Drive Byte     │ Delivery Driver   │ React Native (iOS / Android)   │
│ 3. Food Byters    │ Restaurant Owner  │ React.js + Material-UI (MUI)   │
│ 4. Byte Add       │ Admin / Ops Team  │ React.js + Material-UI (MUI)   │
└───────────────────┴───────────────────┴────────────────────────────────┘
```

### 4.1 Application 1: `Food Byte` (Consumer Mobile App)
* **Direct implementation of the 10 screen pairs in `stitch_full_project_revamp`**:
  1. **Auth / Onboarding**: Login, Signup, OTP input, password setup.
  2. **Home Discovery Feed**: Top delivery perks, category carousels, deals, bottom navigation bar.
  3. **Explore & Search**: Live query autocomplete, active filter chips, dietary tags.
  4. **Restaurant Menu Detail**: Hero cover, category tabs, dish item cards with quick-add.
  5. **Item Detail Customization**: Modal sheet with size, crust, and topping selection.
  6. **Cart & Order Summary**: Itemized list, promo code, tip pills, breakdown, Razorpay checkout.
  7. **Live Order Tracking**: Interactive map, stage timeline, delivery ETA, driver badge.
  8. **Courier In-App Chat**: Live messaging with quick-reply bubbles.
  9. **Rating & Feedback**: Post-order 5-star ratings, compliment chips, written review.
  10. **Profile & Settings**: Saved addresses, payment cards, past order history, light/dark mode switch.
* **Dual Design System Support**:
  - Light Mode: *Food Bites System* (Crimson `#FF1E38`, warm surfaces `#fcf9f8`, tactile pill shapes).
  - Dark Mode: *Midnight Gastronomy* (Obsidian `#121214`, dark surfaces `#1A1A1E`, neon crimson glow).

### 4.2 Application 2: `Drive Byte` (Driver Mobile App)
* **Onboarding & Verification**: Document upload (driver's license, vehicle RC, bank account).
* **Duty Status Toggle**: One-tap `Go Online` / `Go Offline` controlling Redis availability.
* **Order Dispatch & Acceptance**:
  - Modal incoming dispatch popup with pickup distance, delivery distance, and estimated earnings.
  - Acceptance countdown timer (30s) before dispatch falls back to next closest driver.
* **Turn-by-Turn Navigation**: Google Maps SDK route polyline to Restaurant and Customer.
* **Delivery Confirmation**: In-app OTP confirmation or Proof-of-Delivery camera capture.
* **Earnings & Payouts**: Real-time daily/weekly payout dashboard with Razorpay Route transaction history.

### 4.3 Application 3: `Food Byters` (Restaurant Merchant Portal)
* **Merchant Onboarding**: Restaurant dossier submission (business license, kitchen images, bank details).
* **Menu Management Suite**: Create/edit categories, menu items, addons, variant groups, and pricing.
* **Live Kitchen Display (KDS)**: Real-time incoming order Kanban board:
  - Columns: `Incoming New` $\rightarrow$ `Preparing` $\rightarrow$ `Ready for Pickup` $\rightarrow$ `Completed`.
  - Audio chime on new incoming order with one-click Accept/Reject.
* **Business Analytics**: Daily gross revenue, top-selling dishes, customer ratings.

### 4.4 Application 4: `Byte Add` (Admin & Operations Command Center)
* **Merchant Governance**: Dossier review, inspection approval/rejection, suspension controls.
* **Driver Fleet Management**: Document validation, approval gate, driver fleet live status monitor.
* **Live Fleet Geospatial Map**: Real-time map displaying all active drivers and ongoing deliveries.
* **Commission & Take-Rate Engine**: Dynamic configuration of platform commission percentages.
* **Dispute Resolution Center**: Case ticketing system for customer refunds, merchant claims, and driver reports.

---

## Milestone 5: Media Pipeline, Cloud Infrastructure, Docker & Production Readiness

### Objective
Configure blob storage, containerize services, execute comprehensive end-to-end integration tests, and prepare production deployment.

### Detailed Scope & Tasks
1. **AWS S3 Media Pipeline**:
   - Presigned URL generator for secure direct-to-S3 uploads.
   - Buckets for: restaurant banners, menu photography, KYC documents, and delivery proof photos.
2. **Containerization & Deployment Architecture**:
   - Multi-stage Dockerfile for Nest.js backend (minimal Alpine Node image).
   - Docker Compose orchestrating Nest.js, Redis, and local development tools.
   - Production deployment templates for AWS EC2 / AWS MAX.
3. **Comprehensive Test Suite**:
   - Unit tests for cart mutations, single-merchant constraints, and pricing math.
   - Geospatial integration tests validating the $\le 10\text{ km}$ boundary and driver assignment logic.
   - High-concurrency stress test simulating 100 simultaneous driver location broadcasts and order claims.
