---
sidebar_position: 5
title: 🔐 Roles & Permissions
custom_edit_url: null
---

# 🔐 SPACE Role-based Access Control

SPACE enforces **role-based access control (RBAC)** to determine which API operations each service can perform.  

:::warning **Important distinction**

The **users declared in SPACE are *not end-users of your SaaS***.

Instead, they represent the **components** that will interact with SPACE.

Each `apiKey` maps to a SPACE user, and that user is assigned a role.  

This model is particularly powerful in **microservice architectures**:  

- 🛠️ For example, your **Authentication microservice** could have the `MANAGER` role, allowing it to create and manage contracts.  
- 🎛️ While other microservices that only need to check if a feature is available for a user can be assigned the `EVALUATOR` role. This ensures they cannot create or modify contracts.

This separation improves **security** and **clarity** in large-scale deployments.
:::

---

## 👥 Available Roles

SPACE defines three roles:

- **EVALUATOR** → Can only evaluate features and retrieve allowed services.

:::warning **Important**
An evaluator **cannot** log into the SPACE UI.
::: 

- **MANAGER** → Can manage contracts and pricings, in addition to evaluator permissions.  
- **ADMIN** → Full access, including user management and deletion.  

---

## 🔑 Authentication

Every request to SPACE API (except `POST /users/authenticate`) must include an `x-api-key` header with the corresponding user’s API key.

📌 Example of an authenticated request:

```http
POST /api/v1/features
Host: example.org:5403
Accept: application/json
Content-Type: application/json
// highlight-next-line
x-api-key: <your_api_key>
```

To obtain an API key, you first authenticate with your SPACE username and password:

```http
POST /api/v1/user/authenticate
Host: example.org:5403
Accept: application/json
Content-Type: application/json

// highlight-start
{
  "username": "<your_username>",
  "password": "<your_password>"
}
// highlight-end
```

Example response:

```json
{
  "username": "<your_username>",
  "apiKey": "<your_api_key>",
  "role": "EVALUATOR"
}
```

---

## 📊 API Operations by Role

Below is a detailed matrix showing which endpoints each role can access.  

---

### 👤 Users endpoints

| **Endpoint\Role**               | **Unauthenticated user** | **EVALUATOR** | **MANAGER**            | **ADMIN**              |
| -------------------------------- | ------------------------ | ------------- | ---------------------- | ---------------------- |
| POST `/users/authenticate`      | ✅                       | ✅            | ✅                     | ✅                     |
| GET `/users`                    | ❌                       | ❌            | ✅                     | ✅                     |
| POST `/users`                   | ❌                       | ❌            | ✅ (1)                 | ✅ (2)                 |
| GET `/users/{username}`         | ❌                       | ❌            | ✅                     | ✅                     |
| PUT `/users/{username}`         | ❌                       | ❌            | ✅                     | ✅                     |
| DELETE `/users/{username}`      | ❌                       | ❌            | ❌                     | ✅                     |
| PUT `/users/{username}/api-key` | ❌                       | ❌            | ✅                     | ✅                     |
| GET `/users/{username}/role`    | ❌                       | ❌            | ✅                     | ✅                     |

1. `MANAGER` can create users with roles: `EVALUATOR` and `MANAGER`.  
2. `ADMIN` can create users with roles: `EVALUATOR`, `MANAGER`, and `ADMIN`.  

---

### 🛠️ Services endpoints

| **Endpoint\Role**                                          | **Unauthenticated user** | **EVALUATOR** | **MANAGER** | **ADMIN** |
| ---------------------------------------------------------- | ------------------------ | ------------- | ----------- | --------- |
| GET `/services`                                            | ❌                       | ✅            | ✅          | ✅        |
| POST `/services`                                           | ❌                       | ❌            | ✅          | ✅        |
| DELETE `/services`                                         | ❌                       | ❌            | ❌          | ✅        |
| GET `/services/{serviceName}`                              | ❌                       | ❌            | ✅          | ✅        |
| PUT `/services/{serviceName}`                              | ❌                       | ❌            | ✅          | ✅        |
| DELETE `/services/{serviceName}`                           | ❌                       | ❌            | ❌          | ✅        |
| GET `/services/{serviceName}/pricings`                     | ❌                       | ❌            | ✅          | ✅        |
| POST `/services/{serviceName}/pricings`                    | ❌                       | ❌            | ✅          | ✅        |
| GET `/services/{serviceName}/pricings/{pricingVersion}`    | ❌                       | ❌            | ✅          | ✅        |
| PUT `/services/{serviceName}/pricings/{pricingVersion}`    | ❌                       | ❌            | ✅          | ✅        |
| DELETE `/services/{serviceName}/pricings/{pricingVersion}` | ❌                       | ❌            | ❌          | ✅        |

---

### 📄 Contracts endpoints

| **Endpoint\Role**                       | **Unauthenticated user** | **EVALUATOR** | **MANAGER** | **ADMIN** |
| --------------------------------------- | ------------------------ | ------------- | ----------- | --------- |
| GET `/contracts`                        | ❌                       | ❌            | ✅          | ✅        |
| POST `/contracts`                       | ❌                       | ❌            | ✅          | ✅        |
| DELETE `/contracts`                     | ❌                       | ❌            | ❌          | ✅        |
| GET `/contracts/{userId}`               | ❌                       | ❌            | ✅          | ✅        |
| PUT `/contracts/{userId}`               | ❌                       | ❌            | ✅          | ✅        |
| DELETE `/contracts/{userId}`            | ❌                       | ❌            | ❌          | ✅        |
| PUT `/contracts/{userId}/usageLevels`   | ❌                       | ❌            | ✅          | ✅        |
| PUT `/contracts/{userId}/userContract`  | ❌                       | ❌            | ✅          | ✅        |
| PUT `/contracts/{userId}/billingPeriod` | ❌                       | ❌            | ✅          | ✅        |

---

### 🎛️ Features endpoints

| **Endpoint\Role**                       | **Unauthenticated user** | **EVALUATOR** | **MANAGER** | **ADMIN** |
| --------------------------------------- | ------------------------ | ------------- | ----------- | --------- |
| GET `/features`                         | ❌                       | ✅            | ✅          | ✅        |
| POST `/features/{userId}`               | ❌                       | ✅            | ✅          | ✅        |
| POST `/features/{userId}/pricing-token` | ❌                       | ✅            | ✅          | ✅        |
| POST `/features/{userId}/{featureId}`   | ❌                       | ✅            | ✅          | ✅        |

---

### 📈 Analytics endpoints

| **Endpoint\Role**            | **Unauthenticated user** | **EVALUATOR** | **MANAGER** | **ADMIN** |
| ---------------------------- | ------------------------ | ------------- | ----------- | --------- |
| GET `/analytics/api-calls`   | ❌                       | ❌            | ✅          | ✅        |
| GET `/analytics/evaluations` | ❌                       | ❌            | ✅          | ✅        |