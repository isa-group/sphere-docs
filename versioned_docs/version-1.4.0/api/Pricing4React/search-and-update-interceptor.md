---
sidebar_position: 3
title: searchNewTokenAndUpdate
custom_edit_url: null
---

# searchNewTokenAndUpdate Function

The `searchNewTokenAndUpdate` function can be used within a response interceptor to search for the `New-Token` header in the response and, if present, update the pricing evaluation context. The following snippet shows an example of its use within an *Axios* interceptor:

```javascript

import axios from 'axios';
import { searchNewTokenAndUpdate } from 'pricing4react';

const instance = axios.create({
    baseURL: "http://mydomain/api/vX", // Your API baseURL
    headers: {
        // Add your default headers here...
    },
});

instance.interceptors.response.use(
    (response) => {
        searchNewTokenAndUpdate(newToken);
        return response;
    },
    (error) => {
        return Promise.reject(error);
    }
);

```

:::info

If the pricing evaluation context is updated due to the presence of a new token within the `New-Token` header, the website will reload in order to apply changes.

:::