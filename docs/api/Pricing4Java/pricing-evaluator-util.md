---
sidebar_position: 4
custom_edit_url: null
---

# PricingEvaluatorUtil

It can be used to evaluate the context of an user compared to his plan and generate a JWT with the results, using a single java method. This class consumes the information of the configured PricingContext to perform its operations.

Once a class that extends from PricingContext exists inside the spring app, PricingEvaluatorUtil can be injected in any bean by using @Autowired. Once declared, the token can be generated using the `generateUserToken` method anywhere. It requires no parameters and returns a `String` with the JWT token. This is an example:

```java
import io.github.isagroup.PricingEvaluatorUtil;

@Component
public class MyComponent {

    @Autowired
    private PricingEvaluatorUtil pricingEvaluatorUtil;

    public String myMethod() {
        String token = pricingEvaluatorUtil.generateUserToken();
        return token;
    }
}
```

The class also contains a method that modifies a given JWT by changing the evaluation of the given feature by a String expression that will be evaluated on the client side of the application and returns the new version. The following snippet is an example of this method:

```java
// ...

String firstToken = pricingEvaluatorUtil.generateUserToken();
String newToken = pricingEvaluatorUtil.addExpressionToToken(firstToken, "feature1", "userContext['feature1use'] < planContext['feature1']");

Map<String, Map<String, Object>> features = jwtUtils.getFeaturesFromJwtToken(newToken);

// ...
```

Considering just two NUMERIC features, this function could have generated a JWT that has the following payload:

```
{
  "features": {
    "feature1": {
      "eval": "userContext['feature1use'] < planContext['feature1']",
      "limit": 2,
      "used": 2
    },
    "feature2": {
      "eval": true,
      "limit": 5,
      "used": 1
    },
  },
  "sub": "admin1",
  "exp": 1687705951,
  "userContext": {
    ...
  },
  "iat": 1687705864,
  "authorities": {
    "role": "admin",
    "username": "admin1"
  },
  "planContext": {
    ...
  }
}
```