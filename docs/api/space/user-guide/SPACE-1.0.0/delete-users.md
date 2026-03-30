---
sidebar_position: 16
title: "🗑️ Delete Users"
custom_edit_url: null
---

# 🗑️ Delete Users (ADMINS only)

As mentioned in the [Manage Users](./manage-users.md) guide, deleting a user is one of the operations available from the **Users Management** view in **SPACE**.

![Users Management Screen](../../../../static/img/space/user-guides/>=1.0.0/users-management.png)

However, there is important conditions to keep in mind before performing this action: **The last ADMIN cannot be deleted.** SPACE always requires at least one administrator user to remain active. If you attempt to delete the last administrator, the system will block the operation and return an error.  

:::warning Important
Once a user is deleted, their user-level **API key stops working immediately** and they are removed from any organization they are in. If they are the last user in an organization, that organization will be deleted as well (see [Delete Organization](./delete-organizations.md) to better understand the cascade effects of this operation).
:::