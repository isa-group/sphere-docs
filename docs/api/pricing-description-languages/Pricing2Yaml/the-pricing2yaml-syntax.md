---
sidebar_position: 1
custom_edit_url: null
---

# The Pricing2Yaml Syntax

:::tip Pricing2Yaml Editor
A real-time [Pricing2Yaml editor](https://sphere.score.us.es/editor) is available, allowing you to render and visualize changes instantly. It provides an interactive way to explore the syntax and experiment with modifications. It also serves as a foundamental tool for designing real-world pricings.
:::

## Overview

**Pricing2Yaml** (originally introduced as *Yaml4SaaS*) is a **YAML-based serialization format** designed to operationalize the [iPricing metamodel](../../core-concepts/iPricing.md). As modern SaaS pricings have grown from a few simple options to **thousands of potential configurations** [^1], manual management has become increasingly **time-consuming and error-prone**. Pricing2Yaml addresses this challenge by providing a formalized, structured representation of pricing information that is both **human-readable** and **machine-processable**. It does so through a **concise yet expressive syntax** capable of capturing:  

- **Features**, covering functional and extra-functional aspects (e.g., support, SLA guarantees)  
- **Usage limits**, both *renewable* and *non-renewable*
- **Plans**
- **Add-ons**, including availability rules and dependencies  

By providing this standardized representation, Pricing2Yaml enables:  

1. **Design** — facilitating the creation, sharing, and evolution of pricings among diverse stakeholders.
2. **Self-adaptation** – enabling systems to dynamically adjust configurations based on user subscriptions and usage patterns.
3. **Testing** – supporting the generation of test cases to validate pricing constraints and behavior.
4. **Analysis** — serving as the input for tools that analyze, validate, and optimize pricings.
5. **Integration** — acting as the bridge between business-oriented pricing pages and technical self-adaptation workflows.

In essence, Pricing2Yaml represents the **pragmatic layer** of the pricing-driven development and operation vision: a **lightweight, portable, and developer-friendly format** that encapsulates the full variability of SaaS offerings while remaining accessible to non-expert stakeholders.  

## Specification Details

At the top level, each *Pricing2Yaml* file includes general metadata about the SaaS offering (`saasName`, `syntaxVersion`, `version`, `currency`, `createdAt`), followed by the core components of a pricing. Namely: **features**, **usageLimits**, **plans**, and **addOns**.

### Features  

The `features` section enumerates all functionalities included in the pricing, either **functional** –i.e. those features that are translated into code within the service– or **extra-functional** –i.e. those that aren't, such as guarantees like "support priority". Each feature is classified into one of the predefined **feature types** supported by iPricings:

- `INFORMATION` – allow to see, use, visualize or extract additional data from other features.
- `INTEGRATION` – permit users to interact with the system through its API, or to use functionalities from external third-party software within the system.
- `DOMAIN` – provide functionality related to the domain of the system, allowing to perform new operations or using exclusive services.
- `AUTOMATION` – they allow to configure the system in order to perform some actions autonomously or track thresholds and notify the user if anyone is exceeded. It also includes any task performed by a bot or AI, such as predictions, generative AI, etc...
- `MANAGEMENT` – these are focused on team leaders and system administrators. They ease the supervision, organization and guidance of projects, and allow the configuration of accounts and organization-based restrictions and rules.
- `GUARANTEE` – technical commitments of the company that operates the system towards the users.
- `SUPPORT` – expose the granularity of customer support offered within the plans.
- `PAYMENT` – specify payment conditions and possibilities.

For every feature, the following fields are defined:  

- `description`: A human-readable explanation of the feature.  
- `valueType`: Either `BOOLEAN` or `TEXT`.  
- `defaultValue`: Must match the `valueType`.  
- `type`: One of the feature types listed above.
- `expression`: A boolean expression defining the conditions under which the feature is enabled. This expression can reference other features and usage limits using the `pricingContext` and `subscriptionContext` objects (see [SPACE evaluation](../../space/evaluation.md) for more information).
- `serverExpression` (optional): Similar to `expression`, but intended for server-side evaluation. If not provided, it defaults to the value of `expression`.

Additional fields extend expressiveness depending on the feature type:  

- **Integration**: `integrationType` may specify the integration kind (e.g., `WEB_SAAS`), and SaaS pricing URLs can be attached.  
- **Automation**: May include an `automationType` describing the automated action.  
- **Guarantee**: Can reference external documentation via `docURL`.  

:::tip
Numeric values are should not be used as values in features; they are modeled as **usage limits**.

See [Pricing2Yaml good practices](./good-practices.md) for more details.
:::

### Usage Limits  

The `usageLimits` section specifies additional constraints associated with features for a given configuration. Each usage limit is categorized into one of two types:

- `NON_RENEWABLE` – fixed limits that do not reset during the subscription period (e.g., total storage capacity).
- `RENEWABLE` – limits that reset after a defined period (e.g., monthly API calls).

Each usage limit defines the following fields:  

- `description`: A human-readable description.  
- `valueType`: Either `BOOLEAN` or `NUMERIC`.  
- `defaultValue`: Must match the `valueType` (boolean or integer/decimal).  
- `unit`: The measurement unit (e.g., `pet`, `visit`, `GB`).
- `type`: Either `RENEWABLE` or `NON_RENEWABLE`.  
- `trackable`: A boolean indicating whether the system must track usage levels related to this limit. For example, considering the feature *cloud storage*, the system should track the storage consumed.
- `period` (only for `RENEWABLE` limits): An object defining the reset interval. It consists of two fields:
  - `value`: An integer specifying the number of units.
  - `unit`: The time unit for the period: `SEC`, `MIN`, `HOUR`, `DAY`, `WEEK`, `MONTH`, `YEAR`.
- `linkedFeatures`: A list of features impacted by the limit.

### Plans  

The `plans` section details the distinct subscription tiers offered by the SaaS. Each plan is identified by a unique name and includes:  

- `description`: A human-readable description.  
- `price`: A numeric value representing the cost of the plan.
- `unit` (commonly expressed as `user/month`)

Plans may redefine **features** or **usage limits**, but only if their values differ from the defaults declared in the global `features` and `usageLimits` sections. Unlisted features or limits inherit their global `defaultValue`.  

### Add-Ons  

The `addOns` section specifies optional elements that can be purchased in addition to plans. Each add-on may:

- Provide access to new **features**.
- Redefine **usage limits**, i.e. setting higher limits than those included in the subscribed plan.
- Extend **usage limits** (e.g., purchasing more storage or additional seats). These add-ons could be contracted multiple times within the same subscription. These can be expressed through the `usageLimitsExtensions` field, whose values are the same as `usageLimits`, but their impact on operation differ.

:::warning
Add-ons do not consider default values. All features and usage limits not explicitly listed will not be included in the add-on.
:::

This capability is particularly useful for modeling **overage costs** or **pay-per-use strategies**, since add-ons can extend existing usage limits as demand grows.

In addition, add-ons also support the following fields:

- `description`: A human-readable description.
- `price`: A numeric value representing the cost of the add-on.
- `unit`: The billing unit (e.g., `user/month`, `GB/month`,
  `pet/month`).
- `subscriptionConstraints` (optional): An object defining constraints on how many times the add-on can be subscribed within a single subscription. It includes:
  - `min`: Minimum number of subscriptions (default is 1).
  - `max`: Maximum number of subscriptions (default is 1).
  - `step`: Increment step for the number of subscriptions (default is 1).
- `availableFor` (optional): A list of plan names indicating which plans the add-on is available for. If omitted, the add-on is available for all plans.
- `dependsOn` (optional): A list of other add-ons that must be subscribed to in order to purchase this add-on. This is particularly relevant for validating subscriptions.
- `excludes` (optional): A list of other add-ons that cannot be subscribed to if this add-on is selected. This is particularly relevant for validating subscriptions.

:::info
This guide does not include all the fields and options available in the Pricing2Yaml syntax (e.g. billing periods, tags, rendering options, etc). For a comprehensive specification, please refer to the [complete Pricing2Yaml specification](./versions/pricing2yaml-v30-specification.mdx).
:::

## Example  

To better illustrate the syntax, consider the following **PetClinic** pricing model.  

![PetClinic pricing](../../../static/img/pricing-description-languages/pricing2yaml/petclinic.png)  

This example demonstrates how a complete SaaS pricing can be described using **Pricing2Yaml**. 

### Features

The `features` section enumerates all available functionalities. For instance:  

- **pets** and **visits** are modeled as **domain features** with associated usage limits. As can be seen in the [pricing2yaml representation](#pricing2yaml-representation), their expressions depend on the corresponding usage levels associated with the limits.
- **supportPriority** represents an extra-functional feature (more specifically a **support** feature), specifying the level of customer support.  
- All features –except for **pets** and **visits**– are enabled or disabled based on the subscribed plan.

### Usage Limits

The `usageLimits` section introduces constraints on feature availability:  

- `maxPets`: A **non-renewable** limit controlling the maximum number of pets per subscription.  
- `maxVisitsPerMonthAndPet`: A **renewable** monthly limit defining how many visits can be scheduled per pet.  

Each limit references the features it affects via `linkedFeatures`.  

### Plans

Three plans are defined:  

- **BASIC**: A free plan with minimal functionality.  
- **GOLD**: An intermediate plan that increases usage limits and unlocks features like `calendar` and `vetSelection`.  
- **PLATINUM**: The most advanced plan, enabling premium features such as `consultations` and offering higher limits.

Plans only override feature values or usage limits when they differ from the global defaults (see [pricing2yaml representation](#pricing2yaml-representation)).

### Add-Ons

The `addOns` section extends the core pricing with optional upgrades:

- **extraPet** extends the `maxPets` limit and, as a scalable add-on (i.e. only provides `usageLimitsExtensions`), it can be contracted up to 20 times (see `subscriptionConstraints`).
- **petsDashboard** is only available for the `PLATINUM` plan and unlocks a dashboard feature.  
- **smartClinicReports** depends on `petsDashboard` and adds advanced reporting.
- **petAdoptionCentre** introduces an additional domain-specific service.

These add-ons demonstrate how Pricing2Yaml supports **scalable add-ons** and **dependencies**.

### Pricing2Yaml Representation

:::tip
You can experiment with this example directly in the [online Pricing2Yaml editor](https://sphere.score.us.es/editor?pricing=M4QxwORBbBTAuABABVgFwMIBsCWA7HAYwChgBPPNEADwDVYAnYHAezyQCIBmAOgAYOxAG6NmbTlhBpYwNIMINYU2ABMAgmk4AmPloCsAWj4BOAwEZj8gK4NFeQmSQBRAKoAlYgDMlaGzPjEiIgADujAAUFBKjIKOMForOwoYYjRwLHxiYGRQiBYVrAAKmShSABCAPIVADJOahDZUbCeIFZYaLR5BUhoDAWNiLDUwYrAYknAVgBG6QxxCWwYbNLUaADaAOShaMAbALqIADwhc4T4AOZLlEPrG1ag57DVONA4O-ub0DSo73sDwIwRAwnMNRuMkJMZhkFngritbttdgdDgBeE5EC5wm6be4gR7PV6-T7fML7AZoEoIRAAEQqAFk1ABJBpBIQ4Zg7CKRNLQxJINkc4CpGJzTJsAa5fJFSnlKq1eoDaItNodLpU3r9SKDUEycGISGzeaJLGrTYCt5Io7os54S7LbF3B5PF4Wj4bL50dkW1AMOnLAAWajwKh+ZK1FNKNPpTJZ+qswWCLAYaGQcyTb0cipFRvEcYTSZTabmFOFhrFeAlauKkcKTgAGoUs8r2p0pUhqhUAOrkmWIADKLmQyAqbkbQUIeVgwZADC5TTLMKQ-pAIgwk+nDFLvPFWslBWrVMqNTqsaazdVbcQLSwAIGQxGur51sx9tNG28Uj8SM2y9X65UM5hpEEZUsytYAOJuGohSMhUp6IPg0jnAwUiJAeSCdk4ZQAPp9moah9tkIhoH2sBYLAhCLlmC5Pr+sD0CRZEUTCW6ijClZSuhiBHvK8FKq0LZqkg163lq95gk+IwYraJq3B+vijG6dEMaR5GUYkQFBCBSC0gyzLZIQbCTO0qFGXOrE5kkhl4MZVAwkKPJsVku5Vr2PEnk2AkXt0V55KJkTiY+uZSTadrXG+8lfm61m2aZNmaYg2lRnpsbbGoKgsOWGBTr0CDUduSRpRlWU5YoFnlhx+5uXKHlavxKqtj5ImwD2ka6TG2SItS4D+lMLAzio5mOZZS4rrAPzAN1wC9f1DAqOV7EuZx1XHgqdXNF5jVUs1d46mMkmnC+4VyT4UV7D+Y0TVNM0DQlSXMgAYiODIwXB2TAF8ybYPgRBuLAibJuE+VObmH0zpguAEIQf0AzsC3OTkrmRu5a3chtDVCb5N4teGvaPc90GwQ0uL4i6nLZB6E1Ddm5ZIBsGyVdKkYQC4dJOG4jIYJ5GOXloAxWAQmghOgrVUhAcHYW4TgQE4nZqGUtTkihhAANYgFM5E9H0OORJDKuqA9p2jOZBjCzsFM0LQXo7D6fqUIGwY-NTNG5vTjNcSzbMc1z63nltSBmPzgv8tbotIFLMtywrTgDKEaaDQMrKY4HWpBALbxIHScGFAAEgMesG0b-gDKb5rm8Ekg2VyZQEZzzsFeU4BECElex6cVJ8PwQcZ4g9yMAA9NAAYDJFxuIHgbRYPzToEhaSAT1gU9BOBNTUvXINJOluT2KoLcgBWWohVSehd1q6dC33DCD8PWqj8Xqd5rDqasMWmYP0nl5s9SjKs4niATuRDc5klo+Q1DrXc6BVLMT5H-D+oDtZ-xiiqOKQN36ID3NtPy4De4zzJqg1OlMwjAMRpeAALH-D0VtBS2wDEGEM6BiFwKpFwbIyBqiE09uvEaKAGAsD3gfSIR8A6dz4N3C+AIr5D3tiPIu+CtSTHzMmZ+6YKSMPQZjHOjJwJ5wfgAqcAFZywPUZeMBf9iJQPUuIIxGCtaalTkgky9k1E2MSggs+uDCRyMiIQ8maCXEAHYKGW2tsAGh9s6FO2sZjAAbMQEAKgVAVCrtkG4KFInrRdkkVJIAfjwx3II9uSAtA8GMHoMRSBtjX2kfI6YmSriyBQohLxQRXhJBTgQmgRTREP1kP9AO088TOk8cQnxzSSE+XaV1HqfUBpcNpmbSa0zZrzWGhVLUK4QA4EkBrWAD0kzENNmwjhv9D6FMQCfUp5ScEDykWgf0MjPzGz-lM6aMy5rOMxqYoIYMvqQ1+v9AsXjVmLn1J9CGP1oYAsBnkgRTRQjBmAEkg5CzrpvJUG3IgzCSllLPsHa5kib6RDvmMn54KoYw0BR8kxbizbpUyjCbKlBFBzJBUVelxpSqwBhRiwgVIzAXJxZEc+SBL5VLuQ8hS99U5spKkyvKfjPkIKAA) — a playground where you can modify the YAML, explore changes in real time, and get familiar with the syntax and its terminology.
:::

```yaml
saasName: PetClinic
syntaxVersion: "3.0"
version: "latest"
createdAt: "2025-09-19"
currency: EUR
features:
  pets:
    description: Pets description
    valueType: BOOLEAN
    defaultValue: true
    expression: subscriptionContext['pets'] < pricingContext['usageLimits']['maxPets']
    serverExpression: subscriptionContext['pets'] <= pricingContext['usageLimits']['maxPets']
    type: DOMAIN
  visits:
    description: visits description
    valueType: BOOLEAN
    defaultValue: true
    expression: subscriptionContext['visits'] < pricingContext['usageLimits']['maxVisitsPerMonthAndPet']
    type: DOMAIN
  supportPriority:
    description: supportPriority description
    valueType: TEXT
    defaultValue: LOW
    type: SUPPORT
  calendar:
    description: haveCalendar description
    valueType: BOOLEAN
    defaultValue: false
    expression: pricingContext['features']['haveCalendar']
    type: INTEGRATION
    integrationType: WEB_SAAS
  vetSelection:
    description: haveVetSelection description
    valueType: BOOLEAN
    defaultValue: false
    expression: pricingContext['features']['haveVetSelection']
    type: DOMAIN
  consultations:
    description: consultations description
    valueType: BOOLEAN
    defaultValue: false
    expression: pricingContext['features']['consultations']
    type: DOMAIN
  petAdoptionCentre:
    description: petAdoptionCentre description
    valueType: BOOLEAN
    defaultValue: false
    type: DOMAIN
  petsDashboard:
    description: havePetsDashboard description
    valueType: BOOLEAN
    defaultValue: false
    expression: pricingContext['features']['havePetsDashboard']
    type: INFORMATION
  smartClinicReports:
    description: smartClinicReports description
    valueType: BOOLEAN
    defaultValue: false
    type: INFORMATION
usageLimits:
  maxPets:
    description: ''
    valueType: NUMERIC
    defaultValue: 2
    unit: pet
    type: NON_RENEWABLE
    trackable: true
    linkedFeatures:
    - pets
  maxVisitsPerMonthAndPet:
    description: ''
    valueType: NUMERIC
    defaultValue: 1
    unit: visit
    type: RENEWABLE
    period:
      value: 1
      unit: MONTH
    linkedFeatures:
    - visits
plans:
  BASIC:
    description: Basic plan
    price: 0.0
    unit: user/month
    features: null
    usageLimits: null
  GOLD:
    description: Advanced plan
    price: 5.0
    unit: user/month
    features:
      supportPriority:
        value: MEDIUM
      calendar:
        value: true
      vetSelection:
        value: true
      consultations:
        value: false
    usageLimits:
      maxPets:
        value: 4
      maxVisitsPerMonthAndPet:
        value: 3
  PLATINUM:
    description: Pro plan
    price: 10.0
    unit: user/month
    features:
      supportPriority:
        value: HIGH
      calendar:
        value: true
      vetSelection:
        value: true
      consultations:
        value: true
    usageLimits:
      maxPets:
        value: 7
      maxVisitsPerMonthAndPet:
        value: 6
addOns:
  extraPet:
    description: extraPet description
    price: 2.95
    unit: pet/month
    subscriptionConstraints:
      min: 1
      max: 20
      step: 1
    usageLimits:
      maxPets:
        value: 1
  petsDashboard:
    description: petsDashboard description
    availableFor:
      - PLATINUM
    price: 5.95
    unit: user/month
    features:
      petsDashboard:
        value: true
  smartClinicReports:
    description: smartClinicReports description
    dependsOn:
      - petsDashboard
    price: 3.95
    unit: user/month
    features:
      smartClinicReports:
        value: true
  petAdoptionCentre:
    description: petAdoptionCentre description
    price: 15.95
    unit: user/month
    features:
      petAdoptionCentre:
        value: true
```

### Takeaways

This example highlights the expressive power of **Pricing2Yaml**:  

1. **Features** capture both functional and extra-functional aspects of the system.
2. **Usage limits** define quantitative or temporal constraints to further restrict access to features.
3. **Plans** build upon global defaults to define tiers of service.  
4. **Add-ons** extend the pricing dynamically, enabling more flexible business models.  

:::warning
Using a lot of add-ons in a pricing can generate a massive configuration space, which can be difficult to manage, especially if no pricing-driven self-adaptation solutions are employed. It is recommended to use them wisely and only when necessary. See [pricing design tutorial](../../../docs/pricing-design.mdx) for more information.
:::

In summary, the PetClinic example shows how SaaS pricings can be described in a **concise, structured, and machine-processable way**, while remaining human-readable.