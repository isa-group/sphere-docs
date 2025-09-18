---
sidebar_position: 2
title: Migrating to Pricing2Yaml 3.0
custom_edit_url: null
---

# Migrating to Pricing2Yaml 3.0

This document outlines the changes introduced in Pricing2Yaml 3.0 and offers guidance on migrating your pricing files from previous versions. While the SDKs in the Pricing4SaaS suite remain backward compatible, we recommend reviewing this document carefully and performing the update manually to avoid unintended modifications caused by the automatic updaters.

## Breaking Changes

This section highlights the breaking changes introduced in Pricing2Yaml 3.0, meaning that they may require you to update your pricing files to ensure compatibility with the new version.

### 1. New syntax for expressions

In Pricing2Yaml 3.0, the syntax for defining expressions to perform pricing-driven feature toggling has been updated to better reflect key concepts from the pricing-driven development and operation research line –such as the subscription context. As a result, both the `expression` and `serverExpression` fields must be traslated as foolows:

**Pricing2Yaml 2.0**

```yaml
features:
  myFeature:
    ...
    expression: "planContext['features']['myFeature'] && userContext['myFeatureLimit'] < planContext['features']['myFeatureLimit']"
    serverExpression: "planContext['features']['myFeature'] && userContext['myFeatureLimit'] <= planContext['features']['myFeatureLimit']"
```

**Pricing2Yaml 3.0:**

```yaml
features:
  myFeature:
    ...
    expression: "pricingContext['features']['myFeature'] && subscriptionContext['myFeatureLimit'] < pricingContext['features']['myFeatureLimit']"
    serverExpression: "pricingContext['features']['myFeature'] && subscriptionContext['myFeatureLimit'] <= pricingContext['features']['myFeatureLimit']"
```

### 2. Reduced usage limit types

After careful consideration, we have decided to reduce the set of usage limit types to only two: `RENEWABLE` and `NON_RENEWABLE`. As a result, `TIME_DRIVEN` and `RESPONSE_DRIVEN` types have been removed. This change simplifies the classification of usage limits, as the removed types were rarely used and can be viewed as subcategories of the remaining two.

To apply this change to your pricing file(s), simply replace all `TIME_DRIVEN` and `RESPONSE_DRIVEN` usage limit types with `RENEWABLE` and `NON_RENEWABLE`. For example:

**Pricing2Yaml 2.0**

```yaml
usageLimits:
  maxTimePerMeeting:
    ...
    type: TIME_DRIVEN
```

**Pricing2Yaml 3.0:**

```yaml
usageLimits:
  maxTimePerMeeting:
    ...
    type: NON_RENEWABLE
```

:::warning
If you choose not to manually update your pricing files, SDKs supporting Pricing2Yaml 3.0 will automatically replace all `TIME_DRIVEN` usage limits with `RENEWABLE`, and all `RESPONSE_DRIVEN` limits with `NON_RENEWABLE`. This default behavior may not reflect your intended semantics, so we strongly recommend updating your files manually to ensure correctness.
:::

## Major Changes

This section highlights the major changes introduced in Pricing2Yaml 3.0. While these changes are not breaking, they may require you to update your pricing files to take advantage of the new features or improvements.

### 1. Trackable usage limits

In Pricing2Yaml 3.0, we introduced **trackable usage limits**. You can use them to tell pricing-driven self-adaptation solutions which usage levels should be tracked within a user subscription in order to perform feature access evaluations. In other words, you can specify which limits require user usage monitoring in order to get their linked features evaluated.

All `RENEWABLE` usage limits are trackable, as they represent quotas that reset periodically, thus requiring monitoring. In contrast, not all NON_RENEWABLE limits need to be tracked –only those directly tied to user-specific consumption. Let's clarify this with an example:

**EXAMPLE:** If you own an online conference service –like zoom– you may have this two NON_RENEWABLE limits:

- `maxMeetingDuration` (e.g. 1 hour)
- `maxRecordingsCloudStorage` (e.g. 10 GB)

The former do not need to be tracked within the user subscription, since it's a limit that affects meetings.
However, the latter must be tracked, since it affects users theirselves and their storage.

Now the theory is clear, let's see how to apply this in practice.

- `RENEWABLE` usage limits have been enriched with a new field: `period`. It allows to indicate the period of time after which the limit resets. This field is required and will be set by default with a period of **1 month**. Here is an example that overwrites the default value:

```yaml
usageLimits:
  myTestRenewableLimit:
    ...
    type: RENEWABLE
    period:
      value: 15
      unit: DAY
```

:::info
The `period` field is a map containing two fields: `value` and `unit`. The `value` field is an integer representing the period value, while the `unit` field is a string representing the period unit. Possible values for the `unit` field are: `SEC`, `MIN`, `HOUR`, `DAY`, `MONTH`, and `YEAR`. (you can find more info [here](./pricing2yaml-v30-specification.mdx))
:::

- `NON_RENEWABLE` usage limits have been enriched with a new field: `trackable`. It allows to indicate whether the usage of a feature linked to a "NON_RENEWABLE" usage limit must be tracked within the user’s subscription. If true, the system records usage to ensure the limit is not exceeded during feature evaluations. Here is an example that overwrites the default value:

```yaml
usageLimits:
  myTestNonRenewableLimit:
    ...
    type: NON_RENEWABLE
    trackable: true
```

### 2. Subscription Constraints

Recent literature on pricing-driven development and operation has introduced the concept of **scalable add-ons** —add-ons that can be contracted multiple times to extend usage limits (e.g., overage fees in APIs). In Pricing2Yaml 3.0, we’ve incorporated this idea through a new mechanism: **subscription constraints**.

Add-ons now support a `subscriptionConstraints` field, which allows you to define:

- The minimum number of instances required,
- The maximum allowed, and
- The step size (e.g., in packs of 2, 3, etc.).

By default, scalable add-ons use min: 1, max: .inf, and step: 1, meaning they can be contracted freely with no restrictions.

**EXAMPLE:** Given a scalable add-on called `myTestScalableAddon`, we can force to contract it in packs of 4, with a minimum of 4 (minimum should be the same as the step) and a maximum of 20:

```yaml
addOns:
  myTestScalableAddon:
    ...
    subscriptionConstraints:
      min: 4
      max: 20
      step: 4
```

:::info
The `subscriptionContraints` field is a map containing three fields: `min`, `max`, and `step`. The `min` field is an integer representing the minimum number of instances of the add-on that must be contracted, while the `max` field is an integer representing the maximum amount. The `step` field is an integer representing the step with which the add-on should be contracted.
:::

:::warning

- If a step > 1 is defined, the minimum value must be equal to the step.
- If the field is declared for non-scalable add-ons, it will be ignored.

:::