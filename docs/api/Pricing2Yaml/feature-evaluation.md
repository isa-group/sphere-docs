---
sidebar_position: 2
custom_edit_url: null
---

# Feature Evaluation

Since the primary goal of the Pricing4Java is to automatically manage the access of an user to a feature, Pricing2Yaml allows to define an evaluation expression within each feature through the `expression` and `serverExpression` fields.

The `expression` field must contain a string [SPEL](https://docs.spring.io/spring-framework/docs/3.2.x/spring-framework-reference/html/expressions.html) expression that will be used to evaluate wether the feature is available for an user or not. It can access the data of the user context using the `subscriptionContext` variable, while the plan's is available through `pricingContext`.For example, considering a user context that contains the following information:

```json
{
  "username": "John",
  "feature1use": 2
}
```

If we want to check if the use of the feature exceeds its limit, the `SPEL` expression should be:

```yaml
# ...
feature1:
  description: ""
  valueType: NUMERIC
  defaultValue: 10
  type: DOMAIN
  expression: subscriptionContext['feature1use'] < pricingContext['features']['feature1']
  serverExpression: subscriptionContext['feature1use'] <= pricingContext['features']['feature1']
  # ...
```

:::info
As the `pricingContext` utilized within the expression repressents as a map the current plan of the user, you should be aware of using either `features` or `usageLimits` to access the atribute you want to evaluate. The `features` key will have the `value` or `defaultValue` of the feature with the given key, while `usageLimits` will return the equivalent of a declared usage limit.
:::

Similarly, the `serverExpresion` field can handle expressions with the same syntax, but its specification will only be used to evaluate the system's consistency using [@PricingPlanAware](../Pricing4Java/pricingplan-aware.md) annotation. This use can be interesting on NUMERIC features, let's see an example.

If we have a button on the UI to add items to a list, it should be only available while the amount of products is under the feature limit, so when it is reached, the button disapears. The expression that models this behaviour will be the following:

```yaml
# ...
feature1:
  # ...
  expression: subscriptionContext['feature1use'] < pricingContext['features']['feature1']
  # ...
```

However, on the server side, we should consider that the application has a valid state if the limit is not exceeded, which is evaluated with the following expression:

```yaml
# ...
feature1:
  # ...
  serverExpression: subscriptionContext['feature1use'] <= pricingContext['features']['feature1']
  # ...
```

To handle this type of situations, the use of the field `serverExpression` is necessary, as its expression will be used to evaluate the feature on the server side (when using [@PricingPlanAware](../Pricing4Java/pricingplan-aware.md) annotation). If `serverEspression` is not defined, the `expression` will be used instead on any evaluation context. The snippet below shows how to define the situation described above:

```yaml
# ...
feature1:
  # ...
  expression: subscriptionContext['feature1use'] < pricingContext['features']['feature1']
  serverExpression: subscriptionContext['feature1use'] <= pricingContext['features']['feature1']
  # ...
```

:::warning
## About SPEL

In SPEL if you access a **key** that **doesn't exist** will be `null` by default. In our expression:

```txt
subscriptionContext['feature1uses'] <= pricingContext['features']['feature1']
```

will be substituted with

```txt
# subscriptionContext['feature1uses'] doesn't exist, I misspell it so null
# pricingContext['features']['feature1'] is equal to 10

null <= 10
```

The latter expression will evaluate to `false` meaning that `feature1` will always be **DISABLED**

### Conclusions

- **Double check** the writting of expressions in your yaml, look for misspellings and access the correspoding section
  of `pricingContext` which are `features` or `usageLimits`
- **Keep in sync** the **yaml** and the **Java map** that you pass in the `PricingConfiguration.java` file
:::