---
title: Verify your integration
sidebar_label: Verification and troubleshooting
sidebar_position: 4
description: Test sign-in, permissions, token refresh and sign-out, and diagnose common setup errors.
---

## 1. Test the first login

1. **Check discovery.** Open the [discovery document](https://sphere.score.us.es/identity/auth/realms/score/.well-known/openid-configuration). Its `issuer` should exactly match your app's configuration. For a backend app, check that the document and token endpoint are reachable from the server that runs your app.
2. **Sign in.** In a private browser window, open your deployed app and click **Sign in**. Complete the SCORETech sign-in with the test account granted access. Check that the browser returns to your registered callback and opens the app in a signed-in state.
3. **Sign in again.** While the central session is active, start sign-in from a fresh app session and confirm it opens the same local user without asking for credentials again. For a browser app you can reload the page and select **Sign in**. If you're migrating an existing account, check that its app data and permissions still belong to that user.
4. **Test a denied login.** Use an account missing a required application permission and verify that the app creates no session.
5. **Check refresh.** If your app uses access tokens after login, keep it open until the token approaches expiry. Make a protected request and confirm refresh completes without changing the page or signing the user out.
6. **Sign out.** Confirm the app session ends. If you configured central sign-out, check the registered return page and start sign-in again to confirm a fresh SCORETech session is required.

## 2. Check authorization in your app

SCORETech Identity requires every permission configured for the client. The team grants these permissions through roles. Request the permissions needed to enter your application and confirm test users have them. Identity checks them during sign-in, token issuance and refresh.

Use the ID token to establish the login session and the issuer and subject claims (`iss` and `sub`) as the user key. If your API accepts SCORETech bearer tokens, validate each **access token** on the server. Check its signature with the issuer's signing keys, exact issuer, expiry and expected audience. Managed clients receive their own Client ID as an audience and scoped service permissions in `realm_access.roles`. Your API still decides which records and actions the user may access. An already issued access token validated offline can remain valid until expiry after a permission change. [Keycloak OIDC guide](https://www.keycloak.org/securing-apps/oidc-layers)

## 3. Troubleshoot

| Symptom | What to check |
| --- | --- |
| `invalid_redirect_uri` or `Invalid parameter: redirect_uri` | Compare the URL sent to SCORETech with the registered callback. Check scheme, host, port, path and trailing slash. Use the same URL in the code exchange. |
| The browser returns to a 404 | Serve the SPA entry point at the callback path or route that path to the backend handler. Check the public gateway configuration. |
| The browser blocks the token request | For a public client, compare the browser's origin with the application's registered origin. Include the port when present. |
| `invalid_client` at the token endpoint | Check the Client ID and client type. A backend should use its current secret and configured token authentication method. A browser application sends its Client ID without a secret. |
| State mismatch or `invalid_grant` | Start a fresh login. Check that the callback has the original session and PKCE verifier, sends the same redirect URI and exchanges the code only once. |
| SCORETech signs in the user but denies access to your app | Ask the SCORETech team to check that the client is enabled and that the user has every required permission. If the app receives tokens and then denies access, check its own authorization rules. |
| Discovery or the token exchange times out | Test HTTPS connectivity from the component making the request. Check that its outbound proxy, firewall and TLS trust allow the discovered endpoint. |
| Refresh fails or returns `invalid_grant` | Check whether the central session expired or the user's access changed. For a rotating refresh token, verify that the app saved the latest token and that only one refresh runs at a time per session. |
| Sign-out lands on an error page | Check that the post-logout URL exactly matches a registered URL and that the logout request identifies the client or its session. |

If you need help, send the Client ID, environment, failing step, timestamp with timezone and sanitized error to [agarcia29@us.es](mailto:agarcia29@us.es). Keep the secret, authorization codes, tokens and session cookies private.
