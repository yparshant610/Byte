# Food Delivery Ecosystem Architecture & System Specifications

## 1. System Ecosystem & Target Platforms

The ecosystem consists of four independent client applications catering to distinct user roles:

| Application Name | Target User                 | Platform               | Core Stack / UI Library      | Notes                                 |
| :--------------- | :-------------------------- | :--------------------- | :--------------------------- | :------------------------------------ |
| **Food Byte**    | End Consumer                | Mobile (iOS / Android) | React Native                 | Independent Mobile App                |
| **Drive Byte**   | Delivery Fleet / Driver     | Mobile (iOS / Android) | React Native                 | Independent Mobile App                |
| **Food Byters**  | Restaurant Partner          | Web Application        | React.js + Material-UI (MUI) | Merchant Portal for menu & order prep |
| **Byte Add**     | Platform Operations / Admin | Web Application        | React.js + Material-UI (MUI) | Central governance & ops dashboard    |

---

## 2. Technical Stack & Infrastructure Architecture

```
                  +----------------------------------------------+
                  |                 Client Layer                 |
                  |  [Food Byte]  [Drive Byte]  [Food Byters]    |
                  |  (React Native)             (React.js + MUI) |
                  +----------------------+-----------------------+
                                         |
                                         | HTTPS / REST + GraphQL
                                         v
                  +----------------------------------------------+
                  |         Backend Application (Docker)         |
                  |                   Nest.js                    |
                  |     (OpenAPI / Swagger Contract as SRS)      |
                  +----+------------+------------+----------+----+
                       |            |            |          |
         +-------------+      +-----+-----+      |          +------------+
         v                    v           v      v                       v
   +------------+       +-----------+  +----+  +----------+       +-------------+
   |  Supabase  |       |   Redis   |  | S3 |  | Razorpay |       | Google Maps |
   |  (PG DB +  |       |  (Cart &  |  |Blob|  | (Split   |       | SDK / Ola   |
   |   Auth)    |       |  Session) |  |Store  | Payment) |       | (Tracking)  |
   +------------+       +-----------+  +----+  +----------+       +-------------+
```

### 2.1 Backend Services

- **Framework**: Nest.js (TypeScript) exposing dual interfaces via HTTP REST and GraphQL.
- **Contract & Specification**: OpenAPI / Swagger documentation acts as the formal Software Requirements Specification (SRS) and contract between backend and frontend teams.
- **Containerization**: 100% of backend services and dependencies run inside Docker containers.
- **Hosting / Deployment**: AWS EC2 / AWS MAX infrastructure.

### 2.2 Storage & Persistence

- **Primary Database**: Supabase (PostgreSQL) handling relational schemas, referential integrity, and identity management.
- **Temporary State & Caching**: Redis cluster dedicated to:
  - Active shopping cart operations (`add to cart`).
  - Session caching and fast access state.
- **Blob / Media Storage**: AWS S3 buckets for vendor images, food item assets, user KYC documents, and proof-of-delivery uploads.

### 2.3 Third-Party Integrations

- **Payment Processing**: Razorpay supporting multi-way variable split payments:
  $$\text{Payout Ratio} = 0.8\ (\text{Restaurant} + \text{Driver}) + 0.2\ (\text{Byte Add Admin Commission})$$
- **Geospatial & Navigation**: Google Maps SDK (with Ola Maps as an operational alternative/fallback).
- **Communication & Notifications**:
  - **Transactional Emails**: NodeMailer (OTP verification, credentials, dispute resolutions).
  - **In-App Notifications**: Firebase In-App Messaging and Supabase In-App notification pipelines.

---

## 3. End-to-End User Lifecycle & Journey

```
[ User App ] ---> [ Byte Add (Admin) ] ---> [ Restaurant App ] ---> [ Driver App ]
```

### 3.1 Onboarding & Permissions

1. **Authentication**: Consumer signs up or logs into `Food Byte` via Supabase Auth.
2. **System Permissions**: Upon first post-authentication load, the application immediately requests:
   - Precise GPS Location access.
   - Push Notification permissions.
3. **Restaurant Discovery**: Dashboard triggers a geospatial query to fetch all active restaurants within a **$10\text{ km}$ operational radius** of the user's current coordinates.

### 3.2 Ordering, Fulfillment & Feedback

1. **Curation**: Browse listings, save products to Wishlist (❤️), or commit to Cart (stored in Redis).
2. **Order Placement**: Cart converted to Order with payment secured via Razorpay.
3. **Dispatch Routing**: Order is routed from the User App $\rightarrow$ Byte Add Admin $\rightarrow$ Restaurant App (`Food Byters`) $\rightarrow$ Assigned Driver (`Drive Byte`).
4. **Live Fulfillment**: Turn-by-turn routing, real-time driver tracking via Google Maps SDK.
5. **Post-Order**: Two-way rating and review submission for the order, driver, and food quality.

---

## 4. Admin Operations (`Byte Add`)

The administrative portal serves as the operational headquarters:

- **Merchant Management**: Review submitted restaurant dossiers, approve new restaurant listings, and manage operational status.
- **Live Fleet Tracking**: Monitor active deliveries and fleet distribution in real time.
- **Driver Onboarding**: Driver verification and validation through a structured **Pay + Accept** onboarding gate.
- **Dispute Resolution**: Dedicated tools to review, manage, and settle consumer, driver, and merchant claims.
- **Commission Management**: Dynamic configuration of platform take-rates and split commissions.

---

## 5. Security & Authentication Architecture

### 5.1 Endpoint Classification

- **Public Endpoints**:
  - `/auth/signup`
  - `/auth/login`
  - `/auth/forgot-password`
  - `/auth/reset-password`
- **Private Endpoints**:
  - All functional endpoints require a valid Bearer JWT.

### 5.2 Registration & Rate-Limiting Mechanics

- **Signup Sequence**:
  $$\text{Email Submission} \longrightarrow \text{NodeMailer OTP} \longrightarrow \text{OTP Verification} \longrightarrow \text{Password Creation}$$
- **Rate-Limiting Strategy**: Implemented using a **Token Bucket Algorithm** applied to:
  - OTP dispatch endpoints.
  - Login attempts (preventing brute-force attacks).
  - Password reset queries.
- **Session Termination / Logout**:
  - Immediate invalidation of both Access Token and Refresh Token server-side.
  - Complete removal of credentials from client secure storage (cookies/SecureStore).

---

## 6. Implementation Milestones & Data Strategy

1. **Schema Design & Database Modeling**:
   - Model entities for Users, Roles, Restaurants, Categories, Menu Items, Add-ons, Carts, Orders, Payments, and Reviews before API construction.
2. **Mock Data Generation**:
   - Populate synthetic restaurant datasets with varied geo-coordinates within test radii.
   - Structure menu item hierarchies (categories, customization options, pricing).
3. **API Contract Finalization**:
   - Publish Swagger/OpenAPI schemas for frontend teams to begin mock integration concurrently with backend Docker builds.
