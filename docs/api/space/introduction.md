# What is SPACE?

Subscription and Pricing Access Control Engine (SPACE) is a modular platform for
managing users, services, contracts, and pricing strategies for SaaS
applications.

## Goals

Space main goal is to enable services to adapt autonomoulsy to:

- Contract changes (also know as _novations_ in legal terms)
- Pricing updates (plan additions, plan removals, usage limits updates, etc...)

:::info What are contract novations?

The word _novate_ means to replace an old obligation with a new one [^1]. In the
context of a SaaS a novation takes place when two parties renegotiate the terms
of a contract. For example when a client upgrades from a free subscription to a
paid, higher-tier plan with new features and usage limits.

:::

Space simplifies subscription management with its REST API. This API not only
provides real-time user feature availability but also dynamically reacts to
contract and pricing changes. With Space, you simply provide a Pricing2Yaml
configuration, and it handles all subscription and pricing compliance for you,
freeing your host system from complex implementation details.

## Features

- Dashboard UI to manage pricings
- Powerfull RESTfull API to manage user subscription states:
  - Retrieve user feature configuration at runtime
  - Evaluate user features at runtime
  - Notify your services about pricing updates
  - Notify your services about contract changes
- Node HTTP REST client for SPACE API

:::info Why externalizing subscription state?

We've learned that integrating subscription state logic into the host
application leads to significant complexity and ongoing maintenance issues.
Managing additional plans and add-ons requires a proportional increase in
subscription state code. Our solution to these technical issues is to offload
this functionality to a REST API. It'll be responsible for providing the user's
current subscription state, which covers their features and usage limits.

| Advantages                        | Disadvantages                                                                 |
| --------------------------------- | ----------------------------------------------------------------------------- |
| Low coupling with the host system | You have to keep in sync your system state with the subscription system state |
| Ease plans and add-ons changes    | Introduces network latency                                                    |

:::

[^1]:
    Hollenbeck, S. 2025-02-17. Novation Agreement Process: Step-by-Step Guide
    for Businesses. Retrieved from
    https://www.lexology.com/library/detail.aspx?g=77e34291-8595-4d73-9f1c-777db936ae17
