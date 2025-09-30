---
sidebar_position: 1
custom_edit_url: null
---

# The Pricing2Yaml Syntax

**Pricing2Yaml** (previously known as Yaml4SaaS) emerges as a pragmatic application of the _Pricing4SaaS model_, aligning with the overarching objective of formalizing and structuring pricing information for SaaS platforms. Building upon the foundational principles articulated in _Pricing4SaaS_, Pricing2Yaml embodies a simplified and versatile YAML-based syntax designed for serializing comprehensive details about SaaS offerings. The essence of Pricing2Yaml lies in its capacity to encapsulate pricing plans, add-ons, features and usage limits within a concise and human-readable YAML format. Here is a tempalte specification of the Pricing2Yaml syntax:

```yaml
saasName: GitHub
syntaxVersion: "3.0"
createdAt: "2025-10-01"
version: 2025
currency: USD
features:
  githubPackages:
    valueType: BOOLEAN
    defaultValue: true
    type: DOMAIN
    expression: planContext['features']['githubPackages'] && subscriptionContext['githubPackagesLimit'] < planContext['usageLimits']['githubPackagesLimit']
    serverExpression: #OPTIONAL: SPEL Expression to be evaluated on the server side
  standardSupport:
    valueType: BOOLEAN
    defaultValue: false
    type: SUPPORT
    expression: planContext['features']['standardSupport']
    serverExpression: #OPTIONAL: SPEL Expression to be evaluated on the server side
  #...
usageLimits:
  githubPackagesLimit:
    valueType: NUMERIC
    unit: GB
    defaultValue: 0.5
    trackable: true
    type: NON_RENEWABLE
    linkedFeatures:
      - githubPackages
  #...
plans:
  FREE:
    price: 0
    unit: user/month
  TEAM:
    price: 4
    unit: user/month
    features:
      standardSupport:
        value: true
    usageLimits:
      githubPackagesLimit:
        value: 2
  #...
addOns:
  extraGithubPackages:
    price: 0.5
    unit: GB/month
    features: null
    usageLimits: null
    usageLimitsExtensions:
      githubPackagesLimit:
        value: 1
  #...
```

Starting with the top-level placeholder, we can describe basic information about the pricing, features, usage limits, plans and add-ons.

**Features** enumerate all the functionalities encompassed in the pricing, classifying them into the types defined in Pricing4SaaS:

- INFORMATION
- INTEGRATION
- DOMAIN
- AUTOMATION
- MANAGEMENT
- GUARANTEE
- SUPPORT
- PAYMENT

detailing each feature's `description`, `valueType` (BOOLEAN or TEXT), and `defaultValue`, whose data type has to be aligned with the `valueType` defined:

- If the `type` is `BOOLEAN`, the `defaultValue` must be a Boolean.
- If the `type` is `TEXT`, the `defaultValue` must be a String.

Notably, features do not handle NUMERIC values, which are reserved for limits.

In addition, depending on each type of feature, the syntax extends expressiveness for each feature type with additional fields:

- For **integration** features, an `IntegrationType` can be specified through the `integrationType` field. If its value is WEB_SAAS, a list of SaaS pricing URLs can be included.
- **Automation** features do also allow to assign theirselves an `AutomationType`.
- For **guarantee** features can reference the corresponding documentation section describing them via the `docURL` field.
- **Payment** features differ from others, requiring values as a list of `PaymentTypes` for standardization.

Similar to features, **UsageLimits** expounds on limitations affecting plans, add-ons, or features in the pricing, tagging each with the corresponding Pricing4SaaS type:

- NON_RENEWABLE
- RENEWABLE

For each limit, similar to features, a `description`, `valueType` (BOOLEAN, or NUMERIC), and `defaultValue` are provided, accompanied by additional fields such as `unit` or `linkedFeatures`. The latter must be a list of previously described features affected by the limitation. In addition, if valueType === NUMERIC, `defaultValue` must be an integer or double.

The **plans** section provides comprehensive details about the distinct pricing plans offered within the SaaS. Each plan is identified by a unique `name`, allowing for easy reference and differentiation. For each one, essential information is specified, including a brief `description`, the `price` and the `unit` affected by them, typically expressed as "user/month".

In the `features` and `usageLimits` subsections of each plan, only those requiring a modification in their `defaultValue` should be explicitly listed. For those not mentioned, the `defaultValue` is understood to be equivalent to the `value`.

Within the **addOns** section, the focus is on delineating the specific details of additional offerings beyond the core plans. Each add-on is characterized by its unique features and usage limits, which have to be listed in the structure established in the `features` and `usageLimits` sections, but not included on plans. Similar to the approach taken in the previous section of the file, only those `features` or `usageLimits` necessitating an alteration in the `defaultValue` are explicitly outlined. As an extra field, add-ons also allow to extent a usageLimit. This is extremely powerful for modeling overage cost to some limits.

In conclusion, Pricing2Yaml stands as a practical implementation of the Pricing4SaaS model, providing a YAML-based syntax to formalize SaaS pricing structures in a human-readable format that enhances clarity and simplicity.
