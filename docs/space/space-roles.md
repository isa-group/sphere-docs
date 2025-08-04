# SPACE Role based Access Control

Space restricts the API operations based on the role of the user. SPACE distinguishes three different roles:

- EVALUATOR
- MANAGER
- ADMIN

:::info
Every request to SPACE API, except `POST /users/authenticate`, must include a header called `x-api-key`
with the value of the `apiKey` of the corresponding user.

Example of an authenticated request:

```http
POST /api/v1/features
Host: example.org:5403
Accept: application/json
Content-Type: application/json
// highlight-next-line
x-api-key: <your_api_key>
```

You can get your API Key by calling making a request to `POST /users/authenticate` and specifying your credentials,
that is your username and password.

Login request to SPACE:

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

Login response body:

```json
{
  "username": "<your_username>",
  // highlight-next-line
  "apiKey": "<your_api_key>",
  "role": "EVALUATOR"
}
```

:::

## API operations access by role

Here is a matrix breaking down every API operation access by user role

### Users endpoints role access

| **Endpoint\Role**               | **Unauthenticated user** | **EVALUATOR**      | **MANAGER**            | **ADMIN**              |
| ------------------------------- | ------------------------ | ------------------ |------------------------|------------------------|
| POST `/users/authenticate`      | :white_check_mark:       | :white_check_mark: | :white_check_mark:     | :white_check_mark:     |
| GET `/users`                    | :x:                      | :x:                | :white_check_mark:     | :white_check_mark:     |
| POST `/users`                   | :x:                      | :x:                | :white_check_mark: (1) | :white_check_mark: (2) |
| GET `/users/{username}`         | :x:                      | :x:                | :white_check_mark:     | :white_check_mark:     |
| PUT `/users/{username}`         | :x:                      | :x:                | :white_check_mark:     | :white_check_mark:     |
| DELETE `/users/{username}`      | :x:                      | :x:                | :x:                    | :white_check_mark:     |
| PUT `/users/{username}/api-key` | :x:                      | :x:                | :white_check_mark:     | :white_check_mark:     |
| GET `/users/{username}/role`    | :x:                      | :x:                | :white_check_mark:     | :white_check_mark:     |

1) User accounts with `MANAGER` role can create users with `EVALUATOR` and `MANAGER` role.
2) accounts with `ADMIN` role can create users with `EVALUATOR`, `MANAGER` and `ADMIN` role.


### Services endpoints role access

| **Endpoint\Role**                                          | **Unauthenticated user** | **EVALUATOR**      | **MANAGER**        | **ADMIN**          |
| ---------------------------------------------------------- | ------------------------ | ------------------ | ------------------ | ------------------ |
| GET `/services`                                            | :x:                      | :white_check_mark: | :white_check_mark: | :white_check_mark: |
| POST `/services`                                           | :x:                      | :x:                | :white_check_mark: | :white_check_mark: |
| DELETE `/services`                                         | :x:                      | :x:                | :x:                | :white_check_mark: |
| GET `/services/{serviceName}`                              | :x:                      | :x:                | :white_check_mark: | :white_check_mark: |
| PUT `/services/{serviceName}`                              | :x:                      | :x:                | :white_check_mark: | :white_check_mark: |
| DELETE `/services/{serviceName}`                           | :x:                      | :x:                | :x:                | :white_check_mark: |
| GET `/services/{serviceName}/pricings`                     | :x:                      | :x:                | :white_check_mark: | :white_check_mark: |
| POST `/services/{serviceName}/pricings`                    | :x:                      | :x:                | :white_check_mark: | :white_check_mark: |
| GET `/services/{serviceName}/pricings/{pricingVersion}`    | :x:                      | :x:                | :white_check_mark: | :white_check_mark: |
| PUT `/services/{serviceName}/pricings/{pricingVersion}`    | :x:                      | :x:                | :white_check_mark: | :white_check_mark: |
| DELETE `/services/{serviceName}/pricings/{pricingVersion}` | :x:                      | :x:                | :x:                | :white_check_mark: |

### Contracts endpoints role access

| **Endpoint\Role**                       | **Unauthenticated user** | **EVALUATOR** | **MANAGER**        | **ADMIN**          |
| --------------------------------------- | ------------------------ | ------------- | ------------------ | ------------------ |
| GET `/contracts`                        | :x:                      | :x:           | :white_check_mark: | :white_check_mark: |
| POST `/contracts`                       | :x:                      | :x:           | :white_check_mark: | :white_check_mark: |
| DELETE `/contracts`                     | :x:                      | :x:           | :x:                | :white_check_mark: |
| GET `/contracts/{userId}`               | :x:                      | :x:           | :white_check_mark: | :white_check_mark: |
| PUT `/contracts/{userId}`               | :x:                      | :x:           | :white_check_mark: | :white_check_mark: |
| DELETE `/contracts/{userId}`            | :x:                      | :x:           | :x:                | :white_check_mark: |
| PUT `/contracts/{userId}/usageLevels`   | :x:                      | :x:           | :white_check_mark: | :white_check_mark: |
| PUT `/contracts/{userId}/userContract`  | :x:                      | :x:           | :white_check_mark: | :white_check_mark: |
| PUT `/contracts/{userId}/billingPeriod` | :x:                      | :x:           | :white_check_mark: | :white_check_mark: |

### Features endpoints role access

| **Endpoint\Role**                       | **Unauthenticated user** | **EVALUATOR**      | **MANAGER**        | **ADMIN**          |
| --------------------------------------- | ------------------------ | ------------------ | ------------------ | ------------------ |
| GET `/features`                         | :x:                      | :white_check_mark: | :white_check_mark: | :white_check_mark: |
| POST `/features/{userId}`               | :x:                      | :white_check_mark: | :white_check_mark: | :white_check_mark: |
| POST `/features/{userId}/pricing-token` | :x:                      | :white_check_mark: | :white_check_mark: | :white_check_mark: |
| POST `/features/{userId}/{featureId}`   | :x:                      | :white_check_mark: | :white_check_mark: | :white_check_mark: |

### Analytics endpoints role access

| **Endpoint\Role**            | **Unauthenticated user** | **EVALUATOR** | **MANAGER**        | **ADMIN**          |
| ---------------------------- | ------------------------ | ------------- | ------------------ | ------------------ |
| GET `/analytics/api-calls`   | :x:                      | :x:           | :white_check_mark: | :white_check_mark: |
| GET `/analytics/evaluations` | :x:                      | :x:           | :white_check_mark: | :white_check_mark: |
