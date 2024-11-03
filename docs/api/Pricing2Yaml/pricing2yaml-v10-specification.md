---
sidebar_position: 4
custom_edit_url: null
---

# Pricing2Yaml 1.0 Specification

:::info
We use [yaml type](https://yaml.org/type/) abbreviations to describe field supported types.
:::

## `saasName`

- Field requirement: **mandatory**
- Field type: `str`

Name of the pricing you want to modeled.

```yaml
saasName: Petclinic
```

## `day`

- Field requirement: **mandatory**
- Field type: `int`

Day of the date in which the pricing was modeled.

```yaml
day: 29
```

## `month`

- Field requirement: **mandatory**
- Field type: `int`

Month of the year that was modeled the pricing. Valid month integers
range goes from 1 (January) to 12 (December)

```yaml
month: 10
```

## `year`

- Field requirement: **mandatory**
- Field type: `int`

Year in which the pricing was modeled.

```yaml
year: 2024
```

## `currency`

- Field requirement: **mandatory**
- Field type: `str`

Currency in which the pricing plans and addOns are selled. Use
preferably [currency codes](https://en.wikipedia.org/wiki/ISO_4217) for
better pricing standarization.

For example `USD` stands for USA dollars and `EUR` stands for Euros

```yaml
currency: USD
```

## `hasAnnualPayment`

- Field requirement: **mandatory**
- Field type: `bool`

Setting `hasAnnualPayment` to `true` means that your pricing supports yearly billing

```yaml
hasAnnualPayment: true
```

## `features`

- Field requirement: **mandatory**
- Field type: `map`

A map containing the pricing features. Each key of the map is the feature name and
its value is a map containing feature attributes.

```yaml
features:
  name_of_my_feature:
    description: ""
    # ...
  other-feature:
    description: ""
    # ...
```

## `usageLimits`

- Field requirement: **optional**
- Field type: `map`

A map containing the usage limits of your pricing. Each entry of this map
will be the name of the corresponding usage limit.

```yaml
usageLimits:
  maxPets:
    description: ""
    valueType: NUMERIC
    defaultValue: 10
    unit: pet
    type: NON_RENEWABLE
    linkedFeatures:
      - maxPets
```

## `plans`

- Field requirement: **optional**
- Field type: `map`

A map containing the plans of your pricing. Each entry of this map
will be the name of the corresponding plan.

:::info
Plans and AddOns cannot be simultaneously be undefined
:::

## `addOns`

- Field requirement: **optional**
- Field type: `map`

A map containing the addOns of your pricing. Each entry of this map
will be the name of the corresponding addOn.

:::info
Plans and AddOns cannot be simultaneously be undefined
:::

## `<features | usageLimits | plans | addOns>.<name>.description`

- Field requirement: **mandatory**
- Field type: `str`-

If defining a feature a brief summary of what features offers.

If defining an usage limit a brief summary of what it restricts.

If plan or addOn a brief summary describing of the purpose or target of them.

## `<usageLimits | plans | addOns>.<name>.unit`

- Field requirement: **mandatory**
- Field type: `str`

Brief description of what the value of means.

## `<features | usageLimits>.<name>.type`

- Field requirement: **mandatory**
- Field type: `str`

Indicate the category of the feature or usageLimit.

If defining a **feature** the value must be **one of** `AUTOMATION`, `DOMAIN`, `GUARANTEE`,
`INFORMATION`, `INTEGRATION`, `MANAGEMENT`, `PAYMENT`, `SUPPORT`

If defining an **usage limit** the value must be **one of** `NON_RENEWABLE`
`RENEWABLE` , `RESPONSE_DRIVEN` or `TIME_DRIVEN`

## `<features | usageLimits>.<name>.valueType`

- Field requirement: **mandatory**
- Field type: `str`

The value of this field must be **one of** `BOOLEAN`, `NUMERIC`, `TEXT`

Field `valueType` sets the `defaultValue` type signature of the feature or usage limit you are
modeling. For example, if `valueType` is `BOOLEAN` then it is expected that
`defaultValue` is `true` or `false`, if `valueType` is `NUMERIC` then it is
expected to be a number like `5` and finally if `valueType` is `TEXT` then
`defaultValue` is expected to be a string

```yaml
features:
  your_feature:
    description: ""
    type: DOMAIN
    valueType: BOOLEAN
    defaultValue: false
usageLimits:
  your_usage_limit:
    description: ""
    valueType: NUMERIC
    defaultValue: 10
    unit: foo
    type: NON_RENEWABLE
    linkedFeatures:
      - your_feature
```

## `<features | usageLimits>.<name>.defaultValue`

- Field requirement: **mandatory**
- Field type depends on `valueType` value:
  - `bool` if `valueType` is `BOOLEAN`
  - `int` if `valueType` is `NUMERIC`
  - `str` if `valueType` is `TEXT`

This fields holds the default value of the features or usage limits you are modelling.

Every plan that you model will have by default all features and usageLimits `defaultValue`. You
can customize it accesing the plan `features` or `usageLimits` map with the corresponding name and
setting `value` field.

In the following example feature `maxPets`, `supportPriority` and `haveCaledar`, will be overwritten by `ADVANCED` and `PRO`

```yaml
features:
  maxPets:
    valueType: NUMERIC
    defaultValue: 2
  supportPriority:
    valueType: TEXT
    defaultValue: LOW
  haveCalendar:
    valueType: BOOLEAN
    defaultValue: false
plans:
  BASIC:
    features: null
  ADVANCED:
    features:
      maxPets:
        value: 4
      supportPriority:
        value: MEDIUM
      haveCalendar:
        value: true
  PRO:
    features:
      maxPets:
        value: 7
      maxVisitsPerMonthAndPet:
        value: 6
      supportPriority:
        value: HIGH
```

## `<plans | addOns>.<name>.monthlyPrice`

- Field requirement: **mandatory**
- Field type: `float`

Monthly price of the plan or addOn if billed monthly.

:::info
`monthlyPrice` and `annualPrice` cannot be simultaneously `null`.
:::

## `<plans | addOns>.<name>.annualPrice`

- Field requirement: **mandatory**
- Field type: `float`

Monthly price of the plan or addOn if billed yearly. Should be lower than
`monthlyPrice`.

## `<plans | addOns>.<name>.<features | usageLimits>.<name>.value`

- Field requirement: **optional**
- Field type: `map`

A map containing overridden values of features or usageLimits `defaultValue`.

Every plan that you model will have by default all features and usageLimits `defaultValue`. You
can customize it accesing the plan `features` or `usageLimits` map with the corresponding `<name>` and
setting `value` field.

In the following example feature `maxPets`, `supportPriority` and `haveCaledar`, will be overwritten by `ADVANCED` and `PRO`

```yaml
features:
  maxPets:
    valueType: NUMERIC
    defaultValue: 2
  supportPriority:
    valueType: TEXT
    defaultValue: LOW
  haveCalendar:
    valueType: BOOLEAN
    defaultValue: false
plans:
  BASIC:
    features: null
  ADVANCED:
    features:
      maxPets:
        value: 4
      supportPriority:
        value: MEDIUM
      haveCalendar:
        value: true
  PRO:
    features:
      maxPets:
        value: 7
      maxVisitsPerMonthAndPet:
        value: 6
      supportPriority:
        value: HIGH
```

## `features.<name>.expression`

See [Feature Evaluation](./feature-evaluation.md) for details.

## `features.<name>.serverExpression`

See [Feature Evaluation](./feature-evaluation.md) for details.

## `features.<name>.automationType`

- Field requirement: If feature `type` is `AUTOMATION` this is **mandatory**
- Field type: `str`

The value must be **one of** `BOT`, `FILTERING`, `TRACKING` or `TASK_AUTOMATION`.

Type of the automation feature.

## `features.<name>.docUrl`

- Field requirement: If feature `type` is `GUARANTEE` this is **mandatory**
- Field type: `str`

An URL specifying the documentation link to the guarantee.

## `features.<name>.integrationType`

- Field requirement: If feature `type` is `INTEGRATION` this is **mandatory**
- Field type: `str`

The value must be **one of** `API`, `EXTENSION`, `IDENTITY_PROVIDER`, `WEB_SAAS`, `MARKETPLACE` or `EXTERNAL_DEVICE`.

Type of the integration feature.

## `features.<name>.pricingUrls`

- Field requirement: If feature `type` is `INTEGRATION` this is **mandatory**
- Field type: `seq` of `str`

List of links of third party integrations offered in the pricing.

## `usageLimits.<name>.linkedFeatures`

- Field requirement: **mandatory**
- Field type: `seq` of feature names

Bounds the usageLimit to a single or multiple features by adding a
feature name to the list.

```yaml
features:
  feature1:
  feature2:
  feature3:
usageLimits:
  usageLimit1:
    linkedFeatures:
      - feature1
      - feature2
      - feature3
```

## `addOns.<name>.usageLimitsExtensions`

- Field requirement: **optional**
- Field type: `map`

Map containing extensions of already defined usage limits. Each key of the
map referes to an existing usage limit then set the value for the field `value`

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

## Full example

```yaml
saasName: petclinic
day: 15
month: 1
year: 2024
currency: EUR
hasAnnualPayment: false
features:
  maxPets:
    description: maxPets description
    valueType: NUMERIC
    defaultValue: 2
    expression: userContext['pets'] < planContext['usageLimits']['maxPets']
    serverExpression: userContext['pets'] <= planContext['usageLimits']['maxPets']
    type: DOMAIN
  maxVisitsPerMonthAndPet:
    description: maxVisitsPerMonthAndPet description
    valueType: NUMERIC
    defaultValue: 1
    expression: ""
    type: DOMAIN
  supportPriority:
    description: supportPriority description
    valueType: TEXT
    defaultValue: LOW
    expression: ""
    type: SUPPORT
  haveCalendar:
    description: haveCalendar description
    valueType: BOOLEAN
    defaultValue: false
    expression: planContext['features']['haveCalendar']
    type: DOMAIN
  havePetsDashboard:
    description: havePetsDashboard description
    valueType: BOOLEAN
    defaultValue: false
    expression: planContext['features']['havePetsDashboard']
    type: DOMAIN
  haveVetSelection:
    description: haveVetSelection description
    valueType: BOOLEAN
    defaultValue: false
    expression: planContext['features']['haveVetSelection']
    type: DOMAIN
  haveOnlineConsultation:
    description: haveOnlineConsultation description
    valueType: BOOLEAN
    defaultValue: false
    expression: planContext['features']['haveOnlineConsultation']
    type: DOMAIN
usageLimits:
  maxPets:
    description: ""
    valueType: NUMERIC
    defaultValue: 10
    unit: pet
    type: NON_RENEWABLE
    linkedFeatures:
      - maxPets
plans:
  BASIC:
    description: Basic plan
    monthlyPrice: 0.0
    annualPrice: 0.0
    unit: user/month
    features: null
    usageLimits: null
  ADVANCED:
    description: Advanced plan
    monthlyPrice: 5.0
    annualPrice: 5.0
    unit: user/month
    features:
      maxPets:
        value: 4
      maxVisitsPerMonthAndPet:
        value: 3
      supportPriority:
        value: MEDIUM
      haveCalendar:
        value: true
      havePetsDashboard:
        value: false
      haveVetSelection:
        value: true
      haveOnlineConsultation:
        value: false
    usageLimits: null
  PRO:
    description: Pro plan
    monthlyPrice: 10.0
    annualPrice: 10.0
    unit: user/month
    features:
      maxPets:
        value: 7
      maxVisitsPerMonthAndPet:
        value: 6
      supportPriority:
        value: HIGH
      haveCalendar:
        value: true
      havePetsDashboard:
        value: true
      haveVetSelection:
        value: true
      haveOnlineConsultation:
        value: true
    usageLimits: null
addOns: null
```
