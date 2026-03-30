---
sidebar_position: 10
title: "🔄 Manage API Keys"
custom_edit_url: null
---

# 🔑 Manage Organizations API keys

As explained in the [Retrieve API Key](./retrieve-api-key.md) guide, each organization in SPACE has its own set of API keys that can be managed according to the user's role and permissions. This keys are used to authenticate requests to the SPACE API and SDKs, and allow to perform different operations programatically over the resources of the organization.

The set of API keys a use can manage depends on their role:

| Scope | ALL | MANAGEMENT | EVALUATION |
|------|:----------:|:----------:|:---------:|
| OWNER | ✅ | ✅ | ✅ |
| ADMIN | ✅ | ✅ | ✅ |
| MANAGER | ✅ | ✅ | ❌ |
| EVALUATOR | ❌ | ❌ | ❌ |

You can find more details about the different API key scopes in the [SPACE roles](../../space-roles.md) guide.

---

To create, update the scope or delete API keys, you just have to visit the **API Keys** page by selecting it on the left sidebar.

![API Keys Screen](../../../../static/img/space/user-guides/>=1.0.0/api-keys.png)