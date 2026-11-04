# Dovhopolskiy-IT — API Contract
## 1. Overview

This document defines the proposed REST API contract between the Frontend and Backend of the Dovhopolskiy-IT repair management application.

The Frontend currently uses Mock Data stored in browser localStorage. The Backend will replace Mock Data with real HTTP requests and persistent PostgreSQL storage.

All API requests and responses use JSON unless stated otherwise.

**Important:** All endpoints in this document are proposed and must be agreed upon by the Frontend and Backend teams before implementation.

## 2. User Roles

The system supports three user roles:

| Role | Permissions |
|---|---|
| Customer | Register, log in, create repair requests, view own requests |
| Technician | View repair requests, update repair status |
| Administrator | View all requests, manage users, create staff accounts |

Role-based access control must be enforced by the Backend.

## 3. API Endpoints

| Method | Endpoint | Access |
|---|---|---|
| POST | `/api/auth/register` | Public |
| POST | `/api/auth/login` | Public |
| GET | `/api/auth/me` | Authenticated |
| POST | `/api/auth/logout` | Authenticated |
| GET | `/api/requests` | Authenticated |
| POST | `/api/requests` | Customer |
| PATCH | `/api/requests/{id}/status` | Technician |
| GET | `/api/users` | Administrator |
| PATCH | `/api/users/{id}/role` | Administrator |
| PATCH | `/api/users/{id}/status` | Administrator |
| DELETE | `/api/users/{id}` | Administrator |
| POST | `/api/admin/staff` | Administrator |

## 4. Authentication API

### 4.1 Register Customer

**POST** `/api/auth/register`

Request:

```json
{
  "firstName": "Anna",
  "lastName": "Kowalska",
  "email": "anna@example.com",
  "password": "example12345"
}
```

Expected response: `201 Created`

```json
{
  "id": "u5",
  "firstName": "Anna",
  "lastName": "Kowalska",
  "email": "anna@example.com",
  "role": "Customer",
  "active": true
}
```

Rules:
- Email must be unique among non-deleted accounts.
- The minimum password length is 8 characters.
- New public registrations always receive the Customer role.
- Passwords must never be returned in API responses.

### 4.2 Login

**POST** `/api/auth/login`

Request:

```json
{
  "email": "anna@example.com",
  "password": "example12345"
}
```

Expected response: `200 OK`

Returns the authenticated user object without the password.

The Backend creates an authenticated session using a secure cookie.

Inactive or deleted accounts cannot log in.

### 4.3 Current User

**GET** `/api/auth/me`

Expected response: `200 OK`

```json
{
  "id": "u5",
  "firstName": "Anna",
  "lastName": "Kowalska",
  "email": "anna@example.com",
  "role": "Customer",
  "active": true
}
```

If no valid session exists, return `401 Unauthorized`.

### 4.4 Logout

**POST** `/api/auth/logout`

Invalidates the current session.

Expected response: `200 OK`

```json
{
  "success": true
}
```

## 5. Repair Requests API

### 5.1 Get Repair Requests

**GET** `/api/requests`

Expected response: `200 OK`

```json
[
  {
    "id": "REQ-1043",
    "userId": "u5",
    "device": "Laptop",
    "description": "Laptop overheating during work.",
    "phone": "+48 123 456 789",
    "createdAt": "2026-11-04",
    "status": "New",
    "customer": {
      "firstName": "Anna",
      "lastName": "Kowalska",
      "email": "anna@example.com"
    }
  }
]
```

Access rules:
- Customer receives only their own requests.
- Technician receives all repair requests.
- Administrator receives all repair requests.
- For Technician and Administrator, the `customer` field contains customer information when that account is available.
- If the account has been deleted, `customer` may be `null`.
- Customers must not receive other customers' private data.

### 5.2 Create Repair Request

**POST** `/api/requests`

Access: Customer

Request:

```json
{
  "device": "Laptop",
  "description": "Laptop overheating during work.",
  "phone": "+48 123 456 789"
}
```

Expected response: `201 Created`

```json
{
  "id": "REQ-1043",
  "userId": "u5",
  "device": "Laptop",
  "description": "Laptop overheating during work.",
  "phone": "+48 123 456 789",
  "createdAt": "2026-11-04",
  "status": "New"
}
```

Rules:
- `userId` is determined by the authenticated session.
- Initial status is always `New`.
- Description must contain between 10 and 2000 characters.
- Phone must contain between 7 and 15 digits, allowing basic international formatting.

### 5.3 Update Repair Status

**PATCH** `/api/requests/{id}/status`

Access: Technician

Request:

```json
{
  "status": "In Progress"
}
```

Expected response: `200 OK`

Returns the updated repair request.

Allowed statuses:
- `New`
- `In Progress`
- `Completed`

The Backend must reject unsupported statuses.

Rules for allowed transitions between statuses require agreement between the teams.

## 6. User Management API

### 6.1 Get Users

**GET** `/api/users`

Access: Administrator

Expected response: `200 OK`

```json
[
  {
    "id": "u1",
    "firstName": "Anna",
    "lastName": "Kowalska",
    "email": "anna@example.com",
    "role": "Customer",
    "active": true
  },
  {
    "id": "u2",
    "firstName": "Marek",
    "lastName": "Nowak",
    "email": "technician@demo.test",
    "role": "Technician",
    "active": false
  }
]
```

Deleted users must not be included in this list.

### 6.2 Change User Role

**PATCH** `/api/users/{id}/role`

Access: Administrator

Request:

```json
{
  "role": "Technician"
}
```

Expected response: `200 OK`

Returns the updated user object.

Rules:
- Administrators cannot change their own role through this operation.
- Deleted accounts cannot be modified.
- The last active Administrator must not lose the Administrator role.

### 6.3 Activate or Deactivate User

**PATCH** `/api/users/{id}/status`

Access: Administrator

Deactivate request:

```json
{
  "active": false
}
```

Activate request:

```json
{
  "active": true
}
```

Expected response: `200 OK`

Returns the updated user object.

Rules:
- Administrators cannot deactivate themselves.
- The last active Administrator cannot be deactivated.
- Deleted accounts cannot be reactivated.
- Deactivated accounts must lose access to protected resources.

### 6.4 Delete User

**DELETE** `/api/users/{id}`

Access: Administrator

Expected response: `200 OK`

```json
{
  "id": "u5",
  "deleted": true
}
```

Deletion uses Soft Delete.

Rules:
- The account is marked as deleted and becomes inactive.
- The user disappears from the active user list.
- The deleted user cannot log in.
- Existing repair requests remain stored.
- Administrators cannot delete their own account.
- The last active Administrator cannot be deleted.

A production data retention and personal data deletion policy must be defined separately.

### 6.5 Create Staff Account

**POST** `/api/admin/staff`

Access: Administrator

Request:

```json
{
  "firstName": "Jan",
  "lastName": "Nowak",
  "email": "jan@example.com",
  "password": "example12345",
  "role": "Technician"
}
```

Expected response: `201 Created`

```json
{
  "id": "u6",
  "firstName": "Jan",
  "lastName": "Nowak",
  "email": "jan@example.com",
  "role": "Technician",
  "active": true
}
```

Rules:
- Only Administrator can create staff accounts.
- Allowed staff roles are Technician and Administrator.
- Email must be unique among non-deleted accounts.
- Passwords must be securely hashed in the Backend.
- A future production implementation should support staff invitations for setting passwords securely.

## 7. Error Responses

All errors should use a consistent JSON structure.

Example:

```json
{
  "message": "Email is already registered."
}
```

Required HTTP status codes:

| Status | Meaning |
|---|---|
| 400 | Invalid request data |
| 401 | User is not authenticated |
| 403 | User does not have permission |
| 404 | Requested resource does not exist |
| 409 | Conflict, such as duplicate email |
| 500 | Internal server error |

Backend errors must not expose passwords, password hashes, database credentials or internal stack traces.

## 8. Database Requirements

### Table: users

Suggested fields:

- `id` — primary key
- `first_name`
- `last_name`
- `email`
- `password_hash`
- `role`
- `active`
- `deleted_at`
- `created_at`

### Table: repair_requests

Suggested fields:

- `id` — primary key
- `user_id` — foreign key referencing users
- `device`
- `description`
- `phone`
- `created_at`
- `status`

The Backend should generate unique IDs.

The users table must allow reuse of an email after Soft Delete while preventing duplicate emails among non-deleted accounts.

Repair requests must remain associated with their original user ID after account deletion.

Session storage may require additional infrastructure or database tables depending on the Spring Security configuration.

## 9. Security Requirements

The Backend must implement:

- Server-side authentication and authorization.
- Secure password hashing using BCrypt or Argon2id.
- Protected session cookies.
- Appropriate CORS settings when Frontend and Backend use different origins.
- CSRF protection for cookie-based authentication.
- Input validation on the server.
- Restrictions on access to customer data.
- Protection of the last active Administrator.
- Prevention of unauthorized account changes.

The Frontend currently uses `credentials: "include"` for Backend requests.

The exact CSRF token exchange mechanism must be agreed upon before enabling real Backend requests.