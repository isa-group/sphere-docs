---
title: 
sidebar_position: 1
custom_edit_url: null
---

## Should I use `setUserId`, `token.update`, or both when integrating SPACE in the frontend?

Short answer: **these are two alternative integration strategies, not complementary mechanisms**. In a production-ready architecture, you should **choose one**. In most cases, the backend-driven approach based on `token.update` is the recommended option.

Below, we explain why.

### How feature evaluation works in SPACE client SDKs

Before comparing the two approaches, it is important to understand how feature evaluation works in the SPACE client SDKs.

When the frontend reaches a feature toggle (for example, rendering a paid feature or enabling a button):

1. The SPACE client SDK checks whether the `TokenService` currently holds a valid *pricing token*.
2. If a token is present, the SDK evaluates the requested feature based on the `eval` value stored in the token.
3. If no token is available, the evaluation fails and an error is raised.

Importantly, **the frontend does not call SPACE on every feature evaluation**. Instead, a *pricing token* is generated in advance and acts as a compact representation of all pricing decisions applicable to the user. This token is then reused locally to ensure efficient and low-latency evaluations.

As a result, the key difference between the integration strategies does **not** lie in how features are evaluated, but in **how the lifecycle of pricing tokens is managed**.


### Option 1: Backend-driven integration (recommended)

In this approach, the frontend does **not** connect directly to SPACE.

**How it works:**

- The backend (monolithic or microservice-based) is responsible for generating or refreshing pricing tokens.
- Each backend response includes a `Pricing-Token` HTTP header.
- The frontend configures an interceptor (for example, using Axios) to extract this header.
- The interceptor updates the token stored in the SPACE client SDK using `token.update`.

As long as the token is kept up to date in the client-side `TokenService`, all feature evaluations will work correctly.

**Why this approach is preferred:**

- SPACE is not exposed to the public Internet.
- Token generation remains a backend concern.
- The model scales well and avoids unnecessary network calls.
- Feature evaluation remains fast and deterministic.

This is the **recommended architecture for production environments**.


### Option 2: Direct frontend-to-SPACE connection

In this alternative approach, the frontend connects directly to a SPACE instance.

**How it works:**

- The SPACE client SDK is configured to allow direct communication with SPACE.
- The frontend calls `setUserId` to identify the user.
- The SDK generates a pricing token by calling SPACE and stores it in memory.

This option exists primarily to **simplify setup in academic, experimental, or low-complexity scenarios**, where introducing backend logic is undesirable.

However, from an architectural perspective, this approach is **not recommended** for production systems, as it requires exposing SPACE (or parts of it) externally.


### Should both approaches be combined?

Although the SPACE client SDK technically allows both approaches to coexist, **they should not be combined** in a well-designed system.

Using `setUserId` and `token.update` simultaneously introduces **two independent sources of truth** for the pricing token. These sources may overwrite each other, leading to unnecessary token refreshes and, in more complex scenarios, inconsistent behavior.

In academic or experimental contexts, the practical impact may be limited. In the worst case, the token is refreshed more often than required. Nevertheless, this pattern is discouraged in production systems.