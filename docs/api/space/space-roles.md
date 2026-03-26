---
sidebar_position: 5
title: 🔐 Roles & Permissions
custom_edit_url: null
---

# 🔐 Access Control in SPACE

SPACE implements a hierarchical **Role-Based Access Control (RBAC)** model. The system distinguishes between platform-level access (**User API Keys**) and tenant-level access (**Organization API Keys** and **Member Roles**).

:::info **Core Architecture**
Access is managed through two distinct credential types:
1. **User API Keys**: Assigned to individuals for manual management via the SPACE UI.
2. **Organization API Keys**: Assigned to microservices or components for programmatic integration.
:::

---

## 🔑 Authentication Types

All requests to the SPACE API (excluding healthchecks and authentication endpoints) must include the `x-api-key` header.

### 1. User API Keys (`usr_...`)

Obtained via `POST /users/authenticate` using a username and password. These keys are used to manage the platform infrastructure.

- **Purpose**: Manage user accounts, organizations, services and pricing from the SPACE UI.
- **Obtaining**: Authenticate via `POST /users/authenticate` endpoint with username and password
- **Usage**: Include in `x-api-key` header for requests
- **Accessible Roles**: 
  - `ADMIN`: Global system access. Can manage all users, organizations, and system-wide configurations (e.g., cache).
  - `USER`: Restricted access. Can manage their own account and organizations where they hold a membership.
- **Access Pattern**: Can access `/users/**` and `/organizations/**` routes
- **Example Use Cases**:
  - Creating services
  - Managing organizations and their members
  - Viewing analytics

### 2. Organization API Keys (`org_...`)

Generated within an organization's settings for service-to-service communication. They are restricted to the context of a single organization.

- **Purpose**: Perform programmatic operations within an organization's context
- **Obtaining**: Created by organization owners/admins/managers via `POST /organizations/:organizationId/api-keys`
- **Usage**: Include in `x-api-key` header for requests
- **Accessible Scopes**: 
  - `ALL`: Full access to organization resources and management operations
  - `MANAGEMENT`: Full access to organization resources and limited management operations
  - `EVALUATION`: Read-only access to services/pricings and feature evaluation
- **Access Pattern**: Can access `/services/**`, `/contracts/**`, `/features/**` routes

---

## 👥 Organization Member Roles

When a platform `USER` is added to an organization, they are assigned one of the following roles. These roles determine UI permissions and User-Key API access within that organization.

| Role | Permissions |
| :--- | :--- |
| **OWNER** | **Absolute control**: Add/remove members, manage all API keys, delete the organization, and transfer ownership. |
| **ADMIN** | **Full control**: Same as OWNER, except cannot transfer organization ownership. |
| **MANAGER** | **Operational control**: Manage services and contracts. Can add/remove members with `MANAGER` or `EVALUATOR` roles. |
| **EVALUATOR** | **Read-only access**: View services, pricings, and perform feature evaluations. |

---

## 📊 Permission Matrix by Category

### 👤 User Management
*Requires a **User API Key**.*

| Endpoint | Public | USER Role | ADMIN Role |
| :--- | :---: | :---: | :---: |
| `POST /users/authenticate` | ✅ | ✅ | ✅ |
| `POST /users` | ❌ | ❌ | ✅ |
| `GET /users` (List) | ❌ | ❌ | ✅ |
| `GET /users/me` | ❌ | ✅ | ✅ |
| `GET /users/{username}` | ❌ | ❌ | ✅ |
| `PUT /users/{username}/api-key` | ❌ | ❌ | ✅ |
| `PUT /users/{username}/role` | ❌ | ❌ | ✅ |
| `DELETE /users/{username}` | ❌ | ❌ | ✅ |

---

### 🏢 Organization Management

*Requires a **User API Key**.*

| Endpoint | Public | USER Role | ADMIN Role |
| :--- | :---: | :---: | :---: |
| `GET /organizations` | ❌ | ✅ (Own) | ✅ (All) |
| `POST /organizations` | ❌ | ✅ | ✅ |
| `GET /organizations/{id}` | ❌ | ✅ (Own) | ✅ (All) |
| `PUT /organizations/{id}` | ❌ | ✅ (Own$^1$) | ✅ (All) |
| `DELETE /organizations/{id}` | ❌ | ✅ (Own$^2$) | ✅ (All) |

$^1$ Only if the user is an OWNER, ADMIN or MANAGER of that organization.

$^2$ Only if the user is an OWNER of that organization, and the organization is not the default one.

### 👥 Organization Members & 🔑 API Keys  
*Requires a **User API Key***  

#### 1. Permissions Matrix (Who can call what)

| Endpoint | EVALUATOR | MANAGER | OWNER / ADMIN | SPACE ADMIN |
| :--- | :---: | :---: | :---: | :---: |
| `POST /organizations/{id}/members` | ❌ | ✅ | ✅ | ✅ |
| `PUT /organizations/{id}/members/{username}` | ❌ | ✅ | ✅ | ✅ |
| `POST /organizations/{id}/api-keys` | ❌ | ✅ | ✅ | ✅ |
| `DELETE /organizations/{id}/api-keys/{apiKeyId}` | ❌ | ✅ | ✅ | ✅ |

#### 2. Role-Specific Constraints (What each role is allowed to do)

**MANAGER**
- Can manage only `MANAGER` and `EVALUATOR` members  
- Cannot assign `ADMIN` or `OWNER` roles  
- API keys:
  - Can create keys with `EVALUATION` and `MANAGEMENT` scopes  
  - Can delete only non-`ALL` scope keys  

**ADMIN**
- Can manage non-`OWNER` members  
- Cannot assign `ADMIN` or `OWNER` roles  
- Can add: `MANAGER`, `EVALUATOR`  
- API keys:
  - Can create and delete any key  

**OWNER**
- Can manage all members except themselves  
- Can assign any role except `OWNER`  
- Can add: `ADMIN`, `MANAGER`, `EVALUATOR`  
- API keys:
  - Can create and delete any key  

**SPACE ADMIN**
- Can manage any organization  
- Cannot assign or modify `OWNER` role  
- API keys:
  - Can create and delete any key  

#### 3. Endpoint-Specific Rules

**`POST /organizations/{id}/members`**
- Target roles must comply with caller permissions  

**`PUT /organizations/{id}/members/{username}`**
- Target user must already belong to the organization  
- New role must differ from current role  
- `OWNER` role cannot be assigned  
- Existing `OWNER` cannot be modified  

**`POST /organizations/{id}/api-keys`**
- Scope must comply with caller permissions  

**`DELETE /organizations/{id}/api-keys/{apiKeyId}`**
- `MANAGER` can only delete API keys that do not have `ALL` scope  
- All other roles with access can delete any API key  

### 🛠️ Services & 📄 Contracts  
*User API Key → `/organizations/{id}/**` · Organization API Key → `/services/**`, `/contracts/**`*

| Endpoint | EVALUATOR / Scope EVAL | MANAGER / Scope MGMT | ADMIN / Scope ALL |
| :--- | :---: | :---: | :---: |
| `GET /organizations/{id}/services` | ✅ | ✅ | ✅ |
| `POST /organizations/{id}/services` | ❌ | ✅ | ✅ |
| `DELETE /organizations/{id}/services` | ❌ | ❌ | ✅ |
| `GET /organizations/{id}/services/{serviceName}` | ✅ | ✅ | ✅ |
| `PUT /organizations/{id}/services/{serviceName}` | ❌ | ✅ | ✅ |
| `DELETE /organizations/{id}/services/{serviceName}` | ❌ | ❌ | ✅ |
| `GET /organizations/{id}/services/{serviceName}/pricings` | ✅ | ✅ | ✅ |
| `POST /organizations/{id}/services/{serviceName}/pricings` | ❌ | ✅ | ✅ |
| `GET /organizations/{id}/services/{serviceName}/pricings/{pricingVersion}` | ✅ | ✅ | ✅ |
| `PUT /organizations/{id}/services/{serviceName}/pricings/{pricingVersion}` | ❌ | ✅ | ✅ |
| `DELETE /organizations/{id}/services/{serviceName}/pricings/{pricingVersion}` | ❌ | ❌ | ✅ |
| `GET /organizations/{id}/contracts` | ❌ | ✅ | ✅ |
| `POST /organizations/{id}/contracts` | ❌ | ✅ | ✅ |
| `PUT /organizations/{id}/contracts` | ❌ | ❌ | ✅ *(User ADMIN / Org Key)* |
| `DELETE /organizations/{id}/contracts` | ❌ | ❌ | ✅ |
| `GET /organizations/{id}/contracts/{userId}` | ❌ | ✅ | ✅ |
| `PUT /organizations/{id}/contracts/{userId}` | ❌ | ✅ | ✅ |
| `DELETE /organizations/{id}/contracts/{userId}` | ❌ | ❌ | ✅ |
| `GET /services` | ❌ *(User Key)* / ✅ *(Org Key)* | ❌ *(User Key)* / ✅ *(Org Key)* | ✅ *(User ADMIN / Org Key)* |
| `POST /services` | ❌ | ✅ *(Org Key)* | ✅ *(Org Key)* |
| `DELETE /services` | ❌ | ❌ | ✅ *(Org Key ALL / User ADMIN)* |
| `GET /services/{serviceName}` | ❌ | ✅ *(Org Key)* | ✅ *(Org Key)* |
| `PUT /services/{serviceName}` | ❌ | ✅ *(Org Key)* | ✅ *(Org Key)* |
| `DELETE /services/{serviceName}` | ❌ | ❌ | ✅ *(Org Key ALL)* |
| `GET /services/{serviceName}/pricings` | ❌ | ✅ *(Org Key)* | ✅ *(Org Key)* |
| `POST /services/{serviceName}/pricings` | ❌ | ✅ *(Org Key)* | ✅ *(Org Key)* |
| `GET /services/{serviceName}/pricings/{pricingVersion}` | ❌ | ✅ *(Org Key)* | ✅ *(Org Key)* |
| `PUT /services/{serviceName}/pricings/{pricingVersion}` | ❌ | ✅ *(Org Key)* | ✅ *(Org Key)* |
| `DELETE /services/{serviceName}/pricings/{pricingVersion}` | ❌ | ❌ | ✅ *(Org Key ALL)* |
| `GET /contracts` | ❌ | ✅ *(Org Key)* | ✅ *(Org Key / User ADMIN)* |
| `POST /contracts` | ❌ | ✅ *(Org Key)* | ✅ *(Org Key / User ADMIN)* |
| `PUT /contracts` | ❌ | ✅ *(Org Key)* | ✅ *(Org Key / User ADMIN)* |
| `DELETE /contracts` | ❌ | ❌ | ✅ *(Org Key ALL / User ADMIN)* |
| `PUT /contracts/billingPeriod` | ❌ | ✅ *(Org Key)* | ✅ *(Org Key / User ADMIN)* |
| `GET /contracts/{userId}` | ❌ | ✅ *(Org Key)* | ✅ *(Org Key / User ADMIN)* |
| `PUT /contracts/{userId}` | ❌ | ✅ *(Org Key)* | ✅ *(Org Key / User ADMIN)* |
| `DELETE /contracts/{userId}` | ❌ | ❌ | ✅ *(Org Key ALL / User ADMIN)* |
| `PUT /contracts/{userId}/usageLevels` | ❌ | ✅ *(Org Key)* | ✅ *(Org Key / User ADMIN)* |
| `PUT /contracts/{userId}/userContact` | ❌ | ✅ *(Org Key)* | ✅ *(Org Key / User ADMIN)* |
| `PUT /contracts/{userId}/billingPeriod` | ❌ | ✅ *(Org Key)* | ✅ *(Org Key / User ADMIN)* |

---

### 🎛️ Feature Evaluation
*Strictly restricted to **Organization API Keys** to ensure enforcement by the consuming SaaS components.*

| Endpoint | Scope EVALUATION | Scope MANAGEMENT | Scope ALL |
| :--- | :---: | :---: | :---: |
| `GET /features` | ✅ | ✅ | ✅ |
| `POST /features/{userId}` | ✅ | ✅ | ✅ |
| `POST /features/{userId}/pricing-token` | ✅ | ✅ | ✅ |
| `POST /features/{userId}/{featureId}` | ✅ | ✅ | ✅ |

---

## 📈 System & Analytics

* **Analytics**: Accessible by `USER`/`ADMIN` (User Keys) and all `Organization Keys`.
* **Cache Management**: Restricted exclusively to platform **ADMIN** roles.
* **Healthcheck & Events**: Public endpoints ✅.

---

:::important Quick Implementation Note
For backend microservices performing access evaluation, it is recommended to use an **Organization API Key** with `EVALUATION` scope by default.  

Exceptions apply to microservices responsible for subscription management or authentication, which require `MANAGEMENT` scope due to their need to perform state-modifying operations.  

This approach enforces the principle of least privilege by restricting write capabilities to only those components that strictly require them.
:::