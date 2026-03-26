---
title: PricingToken Location
custom_edit_url: null
---

### Question 

Why can't I see the `pricingToken` in my browser's `localStorage` after calling `token.update()`?

### Answer

In the latest versions of the **SPACE React Client**, we have migrated from public browser persistence to an **internal state model**. 

While legacy libraries of the SPHERE ecosystem persisted the token in `localStorage` by default (like Pricing4React), the new SPACE client manages the token **in memory**. This design choice improves security by reducing the token's exposure to **Cross-Site Scripting (XSS)** attacks and removes the business logic's dependency on the host's global storage.

:::info
Even if the token is not visible in your browser tools under the Local Storage tab, the client maintains the state internally. You can still access methods like: `spaceClient.token.getPayload()`.
:::