---
title: Integrate SCORETech Identity
sidebar_position: 1
---

Use SCORETech Identity as the OpenID Connect (OIDC) provider for user sign-in in your application.

## Request a client

Email [garcia29@us.es](mailto:garcia29@us.es) to request a client. The SCORETech team registers the application and issues its credentials. Include the following information:

- The application name and environment, such as staging or production.
- The application type. Specify whether the browser or your backend exchanges the authorization code.
- The exact HTTPS origin and callback URLs. For example, register the origin `https://app.example.org` and the callback `https://app.example.org/auth/callback`. Use absolute URLs on that origin without wildcards. Include any post-logout redirect URLs you need.
- The access permissions or groups of users who should be able to sign in.

| Application type | Credentials issued |
| --- | --- |
| Browser application (SPA) | A public Client ID. The browser uses Authorization Code with PKCE S256. |
| Backend application | A confidential Client ID and Client Secret. The backend authenticates at the token endpoint and uses Authorization Code with PKCE S256. |

If your web app has a backend that handles the code exchange, request a **backend application**. Store the secret in your backend's secret manager or environment. Never include it in a browser bundle, source control, or logs.

## Configure OpenID Connect

| Setting | Value |
| --- | --- |
| Issuer | `https://sphere.score.us.es/identity/auth/realms/score` |
| Discovery document | [OpenID configuration](https://sphere.score.us.es/identity/auth/realms/score/.well-known/openid-configuration) |
| Flow | Authorization Code, `response_type=code` |
| PKCE | `S256` |
| Scopes | `openid profile email` |
| Redirect URI | The exact callback URL registered for your client |
| Client authentication | Public clients send their Client ID. Confidential clients authenticate the token request with their Client Secret on the backend. |

1. Configure an OIDC library with the issuer and the credentials issued for your client. Let it discover the authorization, token, signing key and logout endpoints.
2. Start sign-in by redirecting the browser to the authorization endpoint. Use a fresh `state`, `nonce` and PKCE verifier for each login.
3. At the registered callback, check `state` and exchange the code with the original PKCE verifier. Validate the ID token's signature, issuer, audience, expiry and nonce. Use the issuer and `sub` together as the user's stable identifier in your application.
4. Create your application's session. If you use refresh tokens, let your OIDC library handle rotation and keep the latest token. Use an approved post-logout URL when redirecting users after central sign-out.

See the [Keycloak OIDC guide](https://www.keycloak.org/securing-apps/oidc-layers) and the [OpenID Connect specification](https://openid.net/specs/openid-connect-core-1_0.html).

## Apply application permissions

SCORETech Identity checks the permissions required by the registered client. The team assigns those permissions through roles. Ask for a test account with access when you request the client.

Your application still controls its own routes and resources. If your API accepts SCORETech access tokens, validate the signature, issuer, expiry and expected audience. For a managed client, the access token's `realm_access.roles` contains the scoped service permissions. Use an ID token to establish the login session and an access token to authorize API calls.
