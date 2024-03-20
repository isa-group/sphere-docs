---
sidebar_position: 2
---

# Feature Evaluation

Since the primary goal of the Pricing4Java is to automatically manage the access of an user to a feature, Yaml4SaaS allows to define an evaluation expression within each feature through the `expression` and `serverExpression` fields.

The `expression` field must contain a string [SPEL](https://docs.spring.io/spring-framework/docs/3.2.x/spring-framework-reference/html/expressions.html) expression that will be used to evaluate wether the feature is available for an user or not. It can access the data of the user context using the `userContext` variable, while the plan's is available through `planContext`.For example, considering a user context that contains the following information:

```json
{
  "username": "John",
  "feature1use": 2
}
```

If we want to check if the use of the feature exceeds its limit, the `SPEL` expression should be:

```yaml
# ...
cloudStorage:
  # ...
  expression: userContext['cloudStorageUse'] <= planContext['cloudStorage']
  # ...
```

Similarly, the `serverExpresion` field can handle expressions with the same syntax, but its specification will only be used to evaluate the system's consistency using [@PricingPlanAware](../Pricing4Java/pricingplan-aware.md) annotation. This use can be interesting on NUMERIC features, let's see an example.

If we have a button on the UI to add items to a list, it should be only available while the amount of products is under the feature limit, so when it is reached, the button disapears. The expression that models this behaviour will be the following:

```yaml
# ...
feature1:
  # ...
  expression: userContext['feature1use'] < planContext['feature1']
  # ...
```

However, on the server side, we should consider that the application has a valid state if the limit is not exceeded, which is evaluated with the following expression:

```yaml
# ...
feature1:
  # ...
  expression: userContext['feature1use'] <= planContext['feature1']
  # ...
```

To handle this type of situations, the use of the field `serverExpression` is necessary, as its expression will be used to evaluate the feature on the server side (when using [@PricingPlanAware](../Pricing4Java/pricingplan-aware.md) annotation). If `serverEspression` is not defined, the `expression` will be used instead on any evaluation context. The snippet below shows how to define the situation described above:

```yaml
# ...
feature1:
  # ...
  expression: userContext['feature1use'] < planContext['feature1']
  serverExpression: userContext['feature1use'] <= planContext['feature1']
  # ...
```