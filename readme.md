# Finance Data Processing & Access Control Backend

A robust RESTful API built with MERN stack, designed to manage financial records with a granular Role-Based Access Control (RBAC) system. This backend serves as the backend for a finance dashboard, providing aggregated analytics and secure data management.

## Features

**Role-Based Access Control (RBAC):** Middleware-driven permission system (requirePermission) ensuring users only access authorized resources.

**Financial Record Management:** Full CRUD operations for income and expense tracking with filtering capabilities.

**Advanced Analytics:** Dedicated dashboard endpoints for monthly, quarterly, category-wise and transaction type financial summaries.

**User Lifecycle Management:** Support for user registration, role updates, account deactivation, and status management.

**Security:** JWT-based authentication and route guarding.

## Tech Stack

**Runtime:** Node.js

**Framework:** Express.js

**Language:** TypeScript

**Security:** JWT (JSON Web Tokens)

**Database:** MongoDB

**Validation:** Zod

## System Architecture

The application follows a modular controller-router-middleware pattern to ensure separation of concerns:

**Middleware:** Handles Authentication (JWT verification) and Authorization (Permission checks).

**Controllers:** Contains the business logic for data processing and aggregation.

**Routers:** Defines the API surface and maps endpoints to specific logic.

## Access Control Matrix

The system utilizes an AppAction enum to define granular permissions:
|Role (Example) |Permissions|
| --------------- | ------------------------------------------------------- |
|Admin |VIEW_USER, CREATE_USER, UPDATE_USER, DELETE_USER, VIEW_RECORD, CREATE_RECORD, UPDATE_RECORD, DELETE_RECORD, VIEW_DASHBOARD|
|Analyst |VIEW_RECORD, VIEW_DASHBOARD|
|Viewer | VIEW_DASHBOARD|

## API Documentation

### 1. Authentication

Endpoints for onboarding and session tokens.
|Method |Endpoint| Description|
| ------- | --------- | ---------------------------------------------- |
|POST |/auth/signup |Create a new account|
|POST |/auth/login |Authenticates and returns a JWT token|

### 2. User Management (/users)

Requires Authentication
|Method| Endpoint| Permission |Description|
| ------- | --------- | ---------------- | ---------------------------------------------- |
|GET |/users |VIEW_USER |List all users|
|POST |/users |CREATE_USER |Admin user creation|
|GET |/users/me |None| Get current profile|
|PATCH |/users/me| None| Update own profile|
|DELETE |/users/me| None| Self-deactivate account|
|GET |/users/:id| VIEW_USER| Get specific user detail|
|PATCH| /users/:id |UPDATE_USER |Change user details|
|DELETE| /users/:id |UPDATE_USER |Delete user|
|PATCH| /users/:id/role |UPDATE_USER |Change user permissions|
|PATCH| /users/:id/status| UPDATE_USER| Activate/Suspend user|

### 3. Financial Records (/records)

Requires Authentication
|Method| Endpoint| Permission |Description|
| ------- | --------- | ---------------- | ---------------------------------------------- |
|POST |/records |CREATE_RECORD |Create income/expense entry|
|GET |/records |VIEW_RECORD |List records (supports filtering)|
|GET |/records/:id |VIEW_RECORD |Get single record detail|
|PATCH |/records/:id |UPDATE_RECORD |Edit record details|
|DELETE| /records/:id |DELETE_RECORD |Remove a record|

### 4. Dashboard & Analytics (/dashboard)

Requires VIEW_DASHBOARD Permission
|Method |Endpoint| Description|
| ------- | --------- | ---------------------------------------------- |
|GET |/summary |Full dashboard overview|
|GET |/summary/mini| High-level KPIs (Total Balance, etc.)|
|GET |/summary/type |Income vs Expense breakdown|
|GET |/summary/category| Category-wise spending|
|GET |/summary/monthly |Monthly financial report|
|GET |/summary/quarterly |Quarterly financial report|
|GET |/summary/biannual |Biannual financial report|
|GET |/summary/annual |Yearly financial report|
