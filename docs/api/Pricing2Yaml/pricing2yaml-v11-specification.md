---
sidebar_position: 5
custom_edit_url: null
---

# Pricing2Yaml 1.1 Specification

:::info
We use [yaml type](https://yaml.org/type/) abbreviations to describe field supported types.
:::

## `saasName`

- **mandatory**
- Field type: `str`

Name of the pricing.

```yaml
saasName: Petclinic
```

## `version`

- **mandatory**
- Supported value: `1.1`

```yaml
version: "1.1"
```

## `createdAt`

- **mandatory**
- Field type: `tiemstamp` or `str` in [ISO 8601](https://www.iso.org/iso-8601-date-and-time-format.html) format

Date in which your pricing was modeled.

Timestamp:

```yaml
createdAt: 2024-11-14
```

String in ISO 8601:

```yaml
createdAt: "2024-11-14"
```

Date version

## `currency`

- **mandatory**
- Field type: `str`

Currency in which the pricing plans and addOns are selled. Use
preferably [currency codes](https://en.wikipedia.org/wiki/ISO_4217) for
better pricing standarization.

For example `USD` stands for USA dollars and `EUR` stands for Euros.

```yaml
currency: USD
```

## `hasAnnualPayment`

- **mandatory**
- Field type: `bool`

Setting `hasAnnualPayment` to `true` means that your pricing supports yearly billing.

```yaml
hasAnnualPayment: true
```

## `features`

- **mandatory**
- Field type: `map`

A map containing your pricing features. Each key of the map is the feature name and
its value is a map containing feature attributes.

```yaml
features:
  awesome_feature:
  cool_feature:
  nice_feature:
    # feature attributes
    description: ""
```

## `features.<name>.description`

- **optional**
- Field type: `str`

Brief summary of what features does and offers to your users. Feature descriptions
are usually in a collapsable element or in an icon hiding it, see
[Github pricing](https://github.com/pricing) descriptions for example.

```yaml
features:
  publicRepositories:
    description:
      Host open source projects in public GitHub repositories, accessible via
      web or command line. Public repositories are accessible to anyone at
      GitHub.com.
```

## `features.<name>.type`

- **mandatory**
- Field type: `str`
- Supported values: **one of** `AUTOMATION`, `DOMAIN`, `GUARANTEE`,
  `INFORMATION`, `INTEGRATION`, `MANAGEMENT`, `PAYMENT` or `SUPPORT`

**Automation**: they permit to configure the system in order to perform some actions
autonomously or track thresholds and notify the user if anyone is exceeded.
It also includes any task performed by a bot or AI, such as predictions, generative AI, etc...

```yaml
features:
  codeOwners:
    description:
      Automatically request reviews or require approval by selected contributors
      when changes are made to sections of code that they own.
    type: AUTOMATION
    automationType: TRACKING
```

**Domain**: provide functionality related to the domain of the system,
allowing to perform new operations or using exclusive services.

```yaml
features:
  publicRepositories:
    description: >-
      Host open source projects in public GitHub repositories, accessible via
      web or command line. Public repositories are accessible to anyone at
      GitHub.com.
    type: DOMAIN
```

**Guarantee**: technical commitments of the company that operates the system towards the users.

```yaml
features:
  dataCypher:
    description: Data encryption at rest and in transit.
    type: GUARANTEE
```

**Information**: allow to see, use, visualize or extract additional data from your features.

```yaml
features:
  auditLogs:
    description:
      Audit logs: Audit logs provide a record of changes and usage in the
      Enterprise Grid plan. You can view audit logs directly in Slack, export
      them in CSV format, and use the audit logs API to create custom monitoring
      tools.
    type: INFORMATION
```

**Integration**: permit users to interact with the system through its API,
or to use functionalities from external third-party software within the system.

```yaml
features:
  adminAnalyticsAPI:
    description: >-
      Admin analytics API: Retrieve analytics data for a specific date in a
      compressed JSON file format.
    type: INTEGRATION
    integrationType: API
```

**Management**: are focused on team leaders and system administrators. They ease
the supervision, organization and guidance of projects, and allow the configuration of
accounts and organization-based restrictions and rules.

```yaml
features:
  customUserGroups:
    description:
      Custom user groups: Facilitate receiving notifications and communicating
      with entire teams, departments, and groups.
    type: MANAGEMENT
```

**Support**: expose the granularity of customer support offered within the plans.

```yaml
features:
  enterpriseSupport:
    description: Custom support for our business partners
    type: SUPPORT
```

**Payment**: specify payment conditions and possibilities.

```yaml
features:
  paymentMethod:
    type: PAYMENT
    defaultValue:
      - INVOICE
      - OTHER
```

## `features.<name>.valueType`

- **mandatory**
- Field type: `str`
- Supported values: **one of** `BOOLEAN`, `NUMERIC` or `TEXT`

Field `valueType` sets the `defaultValue` type signature of the feature you are
modeling. For example, if your feature `valueType` is `BOOLEAN` you must put
`true` or `false` in the `defaultValue` field, if `valueType` is `NUMERIC` you must put
a number and in the case of `TEXT` then `defaultValue` has to be a string or a list of string.

```yaml
features:
  boolean-feature:
    valueType: BOOLEAN
    defaultValue: false
  numeric-feature:
    valueType: NUMERIC
    defaultValue: 0
  text-feature:
    valueType: TEXT
    defaultValue: Pricing2Yaml is awesome!
```

## `features.<name>.defaultValue`

- **mandatory**
- Field type is `bool` if `valueType` is set to `BOOLEAN`
- Field type is `int` if `valueType` set to `NUMERIC`
- Field type is `str` or `seq` of **payment methods** if `valueType` is set to `TEXT`

This field holds the default value of your feature. All default values are shared in your plan and addons. You can
override your features values in `plans.<plan_name>.features` or in `addOns.<addOn_name>.features`
section of your pricing.

Supported **payment methods** are: `CARD`, `GATEWAY`, `INVOICE`, `ACH`, `WIRE_TRANSFER` or `OTHER`.

To help you understand how overriding features works, imagine you have the following pricing
matrix:

|                 | SILVER | GOLD   | PLATINUM |
| --------------- | ------ | ------ | -------- |
| supportPriority | LOW    | MEDIUM | HIGH     |

If you want your `supportPriority` to be different in your `GOLD` and `PLATINUM` plans you
will do the following using Pricing2Yaml syntax:

```yaml
features:
  supportPriority:
    valueType: TEXT
    defaultValue: LOW
plans:
  SILVER:
    features: null
  GOLD:
    features:
      supportPriority:
        value: MEDIUM
  PLATINUM:
    features:
      supportPriority:
        value: HIGH
```

Notice that `SILVER` features are `null`, meaning that, `supportPriority`
will have the value `LOW` as you have previously define it in the `features` block.

## `features.<name>.expression`

See [Feature Evaluation](./feature-evaluation.md) for details.

## `features.<name>.serverExpression`

See [Feature Evaluation](./feature-evaluation.md) for details.

## `features.<name>.automationType`

- If feature `type` is `AUTOMATION` this field is **mandatory**
- Field type: `str`
- Supported values: **one of** `BOT`, `FILTERING`, `TRACKING` or `TASK_AUTOMATION`

Type of the automation feature.

**BOT**: every automation feature that depends on machine learning algorithms or LLMs.

```yaml
features:
  postbot:
    description: "https://learning.postman.com/docs/getting-started/basics/about-postbot/"
    type: AUTOMATION
    automationType: BOT
```

**FILTERING**: every automation feature that filters information. For example, spam filtering
of mail clients.

```yaml
features:
  emailSpamFilter:
    description: "Help protect your business against spam and malware with cloud-based email filtering"
    type: AUTOMATION
    automationType: FILTERING
```

**TRACKING**: every automation feature that monitors a metric and notify the user
when reaching his threshold. For example, features that triggers some kind of event
in the system like reaching the limit of API calls.

```yaml
features:
  dependabotAlerts:
    description: "Get notified when there are new vulnerabilities affecting dependencies in your repositories."
    type: AUTOMATION
    automationType: TRACKING
```

**TASK_AUTOMATION**: every automation feature that permit users to automate tasks. For example,
automatically moving the issues to "Done" when thery are closed in the Github kanban board.

```yaml
features:
  dependabotVersionUpdates:
    description: "Keep projects up-to-date by automatically opening pull requests that update out-of-date dependencies."
    valueType: BOOLEAN
    defaultValue: true
    type: AUTOMATION
    automationType: TASK_AUTOMATION
```

## `features.<name>.docUrl`

- If feature `type` is `GUARANTEE` this is **mandatory**
- Field type: `str`

URL redirecting to the guarantee or compliance documentation.

```yaml
features:
  enterpriseGradeSecurity:
    description: "https://www.wrike.com/features/admin-security/"
    type: GUARANTEE
    docUrl: "https://www.wrike.com/features/admin-security/"
```

## `features.<name>.integrationType`

- If feature `type` is `INTEGRATION` this is **mandatory**
- Field type: `str`
- Supported values: **one of** `API`, `EXTENSION`, `IDENTITY_PROVIDER`, `WEB_SAAS`, `MARKETPLACE` or `EXTERNAL_DEVICE`

Type of the integration feature.

**API**: every feature that includes an internal API that developers can consume.

```yaml
adminAnalyticsAPI:
  description: "Admin analytics API: Retrieve analytics data for a specific date in a compressed JSON file format."
  type: INTEGRATION
  integrationType: API
```

**EXTENSION**: every integration feature that extends your SaaS using an external system. For example a browser extension
or code editor extension like VSCode.

```yaml
features:
  copilotIDEIntegration:
    description: "Get IDE integration from Copilot in your IDE and mobile devices."
    type: INTEGRATION
    integrationType: EXTENSION
```

**IDENTITY_PROVIDER**: every integration feature, that involves a process to authenticate users
internally or externally. For example Single Sign On (SSO) or LDAP.

```yaml
features:
  ldap:
    description: Access GitHub Enterprise Server using your existing accounts and centrally manage repository access.
    type: INTEGRATION
    integrationType: IDENTITY_PROVIDER
```

**WEB_SAAS**: every integration feature that involves an external SaaS. For example,
sync your calendar with Outlook. Usage of `features.<name>.pricingUrls` is mandatory.

```yaml
features:
  githubIntegration:
    description: "Link your Overleaf projects directly to a GitHub repository that
    acts as a remote repository for your overleaf project. This allows you to
    share with collaborators outside of Overleaf, and integrate Overleaf into more complex workflows."
    type: INTEGRATION
    integrationType: WEB_SAAS
    pricingsUrls:
      - https://github.com/pricing
```

**MARKETPLACE**: every integration feature that offers many posibilities to integrate with other systems.
For example a marketplace that offers widgets.

```yaml
features:
  githubApps:
    description: Install apps that integrate directly with GitHub's API to improve
    development workflows or build your own for private use or publication in the GitHub Marketplace."
    type: INTEGRATION
    integrationType: MARKETPLACE
```

**EXTERNAL_DEVICE**: every integration feature that involves interactiing with an outer device, like
a mobile, a computer desktop. For example a 2FA feature.

```yaml
features:
  apps:
    description: "Track time using a mobile app, desktop app, and browser extension."
    type: INTEGRATION
    integrationType: EXTERNAL_DEVICE
```

## `features.<name>.pricingUrls`

- If feature `type` is `INTEGRATION` and `integrationType` is `WEB_SAAS` this field is **mandatory**
- Field type: `seq` of `str`

You can specify a list of URLs linking to the associated pricing page of
third party integrations that you offer in your pricing.

```yaml
features:
  googleWorkspaceIntegration:
    type: INTEGRATION
    integrationType: WEB_SAAS
    pricingURLs:
      - https://workspace.google.com/pricing
```

## `usageLimits`

- **optional**
- Field type: `map`

A map containing the usage limits of your pricing. Each entry of this map
will be the name of the corresponding usage limit.

```yaml
usageLimits:
  collaborators:
  githubActionsQuota:
    # usage limit attributes
```

## `usageLimits.<name>.description`

- **optional**
- Field type: `str`

Brief summary of what the usage limit restricts.

```yaml
usageLimits:
  useMessagesAccess:
    description: "The number of days you can access message and file information."
```

## `usageLimits.<name>.type`

- **mandatory**
- Field type: `str`
- Supported values: **one of** `NON_RENEWABLE`
  `RENEWABLE` , `RESPONSE_DRIVEN` or `TIME_DRIVEN`

Field that indicates the type of usage limit based on our clasification of usage limits.

**NON_RENEWABLE**: define a static limit towards which the user approaches, and that will
remain until the end of the subscription.

```yaml
usageLimits:
  uploadSizeLimit:
    type: NON_RENEWABLE
```

**RENEWABLE**: their limit is reset after a period of time, could be a day, week, month...

```yaml
usageLimits:
  githubCodepacesCoreHours:
    type: RENEWABLE
```

**RESPONSE_DRIVEN**: represent a limit where user consumes more or less of his quota depending
on the computational cost of the SaaS associated with the request.

```yaml
usageLimits:
  flowCredits:
    description: "Number of flows executions steps included per month"
    unit: credit/month
    type: RESPONSE_DRIVEN
```

**TIME_DRIVEN**: with this type the quota is consumed by usage time, and is normally
combined with a non-renewable limit.

```yaml
compileTimeoutLimit:
  description: >-
    This is how much time you get to compile your project on the Overleaf servers.
    You may need additional time for longer or more complex projects.
  type: TIME_DRIVEN
```

## `usageLimits.<name>.valueType`

- **mandatory**
- Field type: `str`
- Supported values: **one of** `BOOLEAN`, `NUMERIC` or `TEXT`

Field `valueType` sets the `defaultValue` type signature of the usage limit you are
modeling. For example, if your usageLimit `valueType` is `BOOLEAN` you must put
`true` or `false` in the `defaultValue` field, if `valueType` is `NUMERIC` you must put
a number and in the case of `TEXT` then `defaultValue` has to be a string.

```yaml
features:
  boolean-feature:
    valueType: BOOLEAN
    defaultValue: false
  numeric-feature:
    valueType: NUMERIC
    defaultValue: 0
  text-feature:
    valueType: TEXT
    defaultValue: Pricing2Yaml is awesome!
```

## `usageLimits.<name>.defaultValue`

- **mandatory**
- Field type is `bool` if `valueType` is set to `BOOLEAN`
- Field type is `int` if `valueType` set to `NUMERIC`
- Field type is `str` if `valueType` is set to `TEXT`

This field holds the default value of your usage limit. All default values are shared in your plan and addons. You can
override your usage limits values in `plans.<plan_name>.usageLimits` or in `addOns.<addOn_name>.usageLimits`
section of your pricing.

To help you understand how overriding usage limits works, imagine you have the following pricing
matrix:

|               | SILVER | GOLD | PLATINUM |
| ------------- | ------ | ---- | -------- |
| collaborators | 1      | 6    | 10       |

If you want your `collaborators` usage limit to be different in your `GOLD` and `PLATINUM` plans you
will do the following using Pricing2Yaml syntax:

```yaml
usageLimits:
  collaborators:
    valueType: NUMERIC
    defaultValue: 1
plans:
  SILVER:
    usageLimits: null
  GOLD:
    usageLimits:
      collaborators:
        value: 6
  PLATINUM:
    usageLimits:
      collaborators:
        value: 10
```

## `usageLimits.<name>.unit`

- **mandatory**
- Field type: `str`

Measure of the usage limit.

Here is an example using unit from Github pricing:

```yaml
features:
  githubActions:
usageLimits:
  githubActionsQuota:
    unit: minute/month
```

## `usageLimits.<name>.linkedFeatures`

- **mandatory**
- Field type: `seq` of feature names (`str`)

Bounds your usageLimit to a one or multiple features by adding your
feature name to the list.

```yaml
features:
  feature1:
  feature2:
  feature3:
  feature4:
usageLimits:
  usageLimit1:
    linkedFeatures:
      - feature1
      - feature2
      - feature3
  usageLimit2:
    linkedFeatures:
      - feature4
```

## `plans`

- **optional**
- Field type: `map`

A map containing the plans of your pricing. Each entry of this map
will be the name of the corresponding plan.

```yaml
saasName: Petclinic
plans:
  BASIC:
  GOLD:
  PLATINUM:
```

## `plans.<name>.description`

- **optional**
- Field type: `str`

An overview describing the plan's purpose.

```yaml
plans:
  FREE:
    description: "All the basics for businesses that are just getting started."
```

## `planes.<name>.monthlyPrice`

- **mandatory**
- Field type: `float`

Price of your plan when billing is set to monthly.

:::info
You have to specify at least `monthlyPrice` or `annualPrice`. A combination
of both also works.
:::

## `plans.<name>.annualPrice`

- **mandatory**
- Field type: `float`

Price of your plan when billing is set to annual.

:::info
You have to specify at least `monthlyPrice` or `annualPrice`. A combination
of both also works.
:::

## `plans.<name>.unit`

- **mandatory**
- Field type: `str`

Measure of the plan subscription.

```yaml
plans:
  TEAM:
    unit: user/month
```

## `plans.<name>.features`

- **optional** when leaving the field blank or `null`, loads every `defaultValue` of your features
- Field type: `map`

A map containing the keys of your features you want to override.

```yaml
features:
  awesome_feature:
  cool_feature:
  nice_feature:
plans:
  my_plan:
    features:
      cool_feature:
      nice_feature:
        # other features to override
```

## `plans.<name>.features.<name>.value`

- **optional**
- Field type: `bool`, `int` or `str` depending on the `valueType` of the feature

Every plan that you model will have by default all features `defaultValue`. You
can customize it by putting a value in it.

```yaml
features:
  supportPriority:
    defaultValue: LOW
plans:
  SILVER:
    features: null
  GOLD:
    features:
      supportPriority:
        value: 6
  PLATINUM:
    features:
      supportPriority:
        value: 10
```

## `plans.<name>.usageLimits`

- **optional** when leaving the field blank or `null` it loads every `defaultValue` of your usage limits
- Field type: `map`

A map containing the keys of your usage limits you want to override.

```yaml
usageLimits:
  usageLimit1:
  usageLimit2:
plans:
  my_plan:
    usageLimits:
      usageLimit1:
      usageLimit2:
        # ...
```

## `plans.<name>.usageLimits.<name>.value`

- **optional**
- Field type: `bool`, `int` or `str` depending on the `valueType` of the usage limit

Every plan that you model will have by default all usage limits `defaultValue`. You
can customize it by putting a value in it.

In the following example `collaborators` usage limit are overridden by `STANDARD` and `PROFESSIONAL`.

```yaml
usageLimits:
  collaborators:
    defaultValue: 1
addOns:
  BASIC:
    usageLimits: null
  STANDARD:
    usageLimits:
      collaborators:
        value: 6
  PROFESSIONAL:
    usageLimits:
      collaborators:
        value: 10
```

## `addOns`

- **optional**
- Field type: `map`

A map containing the addons of your pricing. Each entry of this map
will be the name of the corresponding addon.

```yaml
addOns:
  awesome_addOn:
  cool_addOn:
    # ...
```

:::info
You have to specify at least `plans` or `addOns`. A combination
of both also works.
:::

## `addOns.<name>.description`

- **optional**
- Field type: `str`-

An overview describing the addon purpose.

## `addOns.<name>.availableFor`

- **mandatory**
- Field type: `seq` of plan names

Your addon is available for the plans that you specify in this list.

```yaml
plans:
  SILVER:
  GOLD:
  PLATINUM:
    # ...
addOns:
  RUBY:
    availableFor:
      - GOLD
      - SILVER
```

## `addOns.<name>.dependsOn`

- **optional**
- Field type: `seq` of addon names

A list of addon to be subscribed in order to purchase the current addon.

Imagine that your addon `SECURITY` depends on `ENTERPRISE` addon. That
means that in order to include in your subscription the `SECURITY` addon you also have to include
`ENTERPRISE` addon.

That way you can subscribe to `ENTERPRISE` or `ENTERPRISE` and `SECURITY` but no exclusively to
`SECURITY` addon.

```yaml
addOns:
  ENTERPRISE:
  SECURITY:
    dependsOn:
      - ENTERPRISE
```

## `addOns.<name>.monthlyPrice`

- **mandatory**
- Field type: `float`

Price of your addon when billing is set to monthly.

```yaml
addOns:
  postmanFlowsBasic:
    monthlyPrice: 15.00
    annualPrice: 12.00
```

:::info
You have to specify at least `monthlyPrice` or `annualPrice`. A combination
of both also works.
:::

## `addOns.<name>.annualPrice`

- **mandatory**
- Field type: `float`

Price of your addon when billing is set to annual.

```yaml
addOns:
  postmanFlowsBasic:
    monthlyPrice: 15.00
    annualPrice: 12.00
```

:::info
You have to specify at least `monthlyPrice` or `annualPrice`. A combination
of both also works.
:::

## `addOns.<name>.unit`

- **mandatory**
- Field type: `str`

Measure of the addon subscription.

```yaml
addOns:
  gitLFSDataPack:
    unit: user/month
```

## `addOns.<name>.features`

- **optional** when leaving the field blank or `null`, loads every `defaultValue` of your features
- Field type: `map`

A map containing the keys of your features you want to override.

```yaml
features:
  awesome_feature:
  cool_feature:
  nice_feature:
addOns:
  my_addOn:
    features:
      cool_feature:
      nice_feature:
        # ...
```

## `addOns.<name>.features.<name>.value`

- **optional**
- Field type: `bool`, `int` or `str` depending on the `valueType` of the feature

Every addon that you model will have by default all features `defaultValue`. You
can customize it by putting a value in it.

```yaml
features:
  supportPriority:
    defaultValue: LOW
addOns:
  A:
    features: null
  B:
    features:
      supportPriority:
        value: 6
  C:
    features:
      supportPriority:
        value: 10
```

## `addOns.<name>.usageLimits`

- **optional** when leaving the field blank or `null` it loads every `defaultValue` of your usage limits
- Field type: `map`

A map containing the keys of your usage limits you want to override.

```yaml
usageLimits:
  usageLimit1:
  usageLimit2:
addOns:
  my_addOn:
    usageLimits:
      usageLimit1:
      usageLimit2:
        # ...
```

## `addOns.<name>.usageLimits.<name>.value`

- **optional**
- Field type: `bool`, `int` or `str` depending on the `valueType` of the usage limit

Every addon that you model will have by default all usage limits `defaultValue`. You
can customize it by putting a value in it.

In the following example `collaborators` usage limit are overridden by `B` and `C`:

```yaml
usageLimits:
  collaborators:
    defaultValue: 1
addOns:
  A:
    usageLimits: null
  B:
    usageLimits:
      collaborators:
        value: 6
  C:
    usageLimits:
      collaborators:
        value: 10
```

## `addOns.<name>.usageLimitsExtensions`

- **optional**
- Field type: `map`

A map containing the keys of your usage limits that you want to extend with this addon.

```yaml
usageLimits:
  my_usage_limit:
    defaultValue: 5
addOns:
  my_addOn:
    usageLimits:
      my_usage_limit:
        value: 10
    usageLimitsExtensions:
      my_usage_limit:
        value: 30
```

## `addOns.<name>.usageLimitsExtensions.<name>.value`

- **optional**
- Field type: `bool`, `int` or `str` depending on the `valueType` of the usage limit

Specify the quantity in which you want to extend your usage limit

In the following example `collaborators` usage limit is extended by 10 units:

```yaml
usageLimits:
  collaborators:
    defaultValue: 1
addOns:
  B:
    usageLimits:
      collaborators:
        value: 6
    usageLimitsExtensions:
      collaborators:
        value: 10
```
