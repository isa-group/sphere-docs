---
title: Set up a browser application
sidebar_label: Browser application
sidebar_position: 2
description: Add SCORETech sign-in to a single-page application with a public client and PKCE.
---

This walkthrough adds sign-in and sign-out buttons to a single-page application (SPA). Start with a **Browser application** Client ID and exact URLs from [Getting started](./integration.md).

## 1. Serve the callback route

This example uses these registered URLs. Substitute your own throughout.

| Purpose | Example |
| --- | --- |
| Origin | `https://portal.example.org` |
| Sign-in callback | `https://portal.example.org/auth/callback` |
| After sign-out | `https://portal.example.org/` |

Configure your host to serve the SPA entry point at `/auth/callback` as well as at `/`. Open the callback directly in a browser before testing sign-in. It should load your app. Install the adapter in your existing frontend project. [Keycloak JavaScript adapter](https://www.keycloak.org/securing-apps/javascript-adapter)

```bash
npm install keycloak-js
```

## 2. Add sign-in and sign-out

Place these elements in the page where you want the controls to appear.

```html
<button id="sign-in" type="button" hidden>Sign in</button>
<button id="sign-out" type="button" hidden>Sign out</button>
<p id="auth-status" role="status"></p>
```

Add this module to your frontend entry point so it runs on both `/` and `/auth/callback`. If your app has a router, start it after the adapter processes the callback.

```js title="auth.js"
import Keycloak from 'keycloak-js';

const keycloak = new Keycloak({
  url: 'https://sphere.score.us.es/identity/auth',
  realm: 'score',
  clientId: 'REPLACE_WITH_YOUR_CLIENT_ID',
});
const callbackUrl = 'https://portal.example.org/auth/callback';
const afterLogout = 'https://portal.example.org/';

const signIn = document.querySelector('#sign-in');
const signOut = document.querySelector('#sign-out');
const status = document.querySelector('#auth-status');

try {
  const signedIn = await keycloak.init({
    flow: 'standard',
    pkceMethod: 'S256',
    scope: 'openid profile email',
    checkLoginIframe: false,
  });

  if (window.location.pathname === new URL(callbackUrl).pathname && signedIn) {
    window.history.replaceState(window.history.state, '', '/');
  }
  signIn.hidden = signedIn;
  signOut.hidden = !signedIn;
  status.textContent = signedIn ? 'Signed in' : 'Ready to sign in';

  signIn.addEventListener('click', () => {
    keycloak.login({ redirectUri: callbackUrl }).catch(() => {
      status.textContent = 'Could not start sign-in. Try again.';
    });
  });
  signOut.addEventListener('click', () => {
    keycloak.logout({ redirectUri: afterLogout }).catch(() => {
      status.textContent = 'Could not sign out. Try again.';
    });
  });
} catch {
  status.textContent = 'Could not complete sign-in. Return to the home page and try again.';
}
```

The adapter handles the redirect, PKCE, and token exchange. The example starts sign-in when the user clicks the button. If a SCORETech session is already active, that redirect can complete without another credential prompt.

## 3. Keep the session usable

- Keep tokens in the adapter's memory. A full page reload clears that memory. The next sign-in redirect can reuse the central session.
- Before calling a protected API, call `await keycloak.updateToken(30)` to refresh the access token if it has less than 30 seconds left. Then read the latest `keycloak.token` and send it as an `Authorization: Bearer` header to your API.
- Preserve the current view after a successful refresh. If refresh fails because the session has expired or been revoked, show a sign-in action. For a temporary network error, let the user retry.
- Have the API validate tokens and enforce access to its resources. See [Verify your integration](./verify.md).

## 4. Try the flow

Deploy the frontend at the registered origin, select **Sign in**, and authenticate with the test account. Confirm you land back in the app and see **Signed in**. Then select **Sign out** and confirm you return to the registered landing page.
