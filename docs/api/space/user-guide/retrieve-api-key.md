---
sidebar_position: 3
custom_edit_url: null
---

# 🔑 Retrieve API Key

To interact with **SPACE** —whether through its API or via its SDKs— you need an `apiKey` tied to a user account.  
This key acts as the **authentication token** for all requests.

Each SPACE user automatically receives a **unique API key** when their account is created.

---

## 📥 How to Retrieve Your API Key

1. **Login** into SPACE.  
2. Go to the **Access Control** section in the left sidebar.  
3. Locate the user account you want to use for authentication.  
4. Copy the corresponding **API key** and use it in your service or SDK configuration.

![Access Control Screen](../../../static/img/space/user-guides/access-control.png)

---

:::warning Important
- Keep your API key **secret** — it grants access based on the user’s role (`EVALUATOR`, `MANAGER`, or `ADMIN`).  
- If an API key is compromised, revoke it by deleting the user account.  
- Never expose your API key directly in client-side code.
:::