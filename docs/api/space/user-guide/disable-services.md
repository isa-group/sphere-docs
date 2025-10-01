---
custom_edit_url: null
---

# 🗑️ Disable Services

Disabling a service in **SPACE** is a terminal operation that should only be performed when the service is no longer intended to operate.

As explained in the [pricing management guide](./pricings-availability.md), **each service must always have at least one active pricing version**. This ensures that active customers remain subscribed to a valid configuration.  

However, if the service itself is being phased out —meaning there is no longer a need for any active pricing— you can proceed to disable it. Once disabled:

- The service will **no longer appear in the list of services** in the SPACE UI.  
- **No new contracts** can be created for it.  
- Existing **contracts will not be able to operate** within the service.  
- The **service will only be accessible through the SPACE API** using the endpoints documented in the [API Reference](../space-api.mdx).  

This guide will walk you through the process of disabling a service.

---

## 1. Open the Services Management Panel

Go to the **Services Management** tab in the left sidebar.  

Select the service you want to update (in this example, **PetClinic**).

![Services Management View With PetClinic](../../../static/img/space/user-guides/services-management-with-service.png)

## 2. Access the Service Details

Click on the **service card** to open its details.

Here you’ll find the list of existing pricing versions for that service.

![Disable service button](../../../static/img/space/user-guides/add-pricing-version.png)

## 3. Add a New Version

Click the **⋮ (three-dot menu)** at the top-right corner and select **Disable Service**. Then confirm the action.


:::danger Requirements
This action will make the service disappear from the services list and prevent any new contracts from being created for it. Existing contracts will remain active until they expire or are cancelled.
:::

---

## 🔄 Re-enabling a Disabled Service

If you later create a "new service" with a pricing that coincides in `saasName` with a disabled service, SPACE will automatically bring that service back online —under the following conditions:

- The uploaded pricing must have the **same `saasName`** as the disabled service.  
- The pricing’s `version` must be **different** from any versions that were already archived for that service.  

When this happens:

- The new pricing version will be set as the **only active version**.  
- All previously archived versions will remain archived and attached to the service.  

This mechanism allows you to safely revive services if their pricing strategy changes in the future.