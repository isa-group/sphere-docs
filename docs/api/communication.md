---
sidebar_position: 3
---

# Communication Strategy

**Pricing4SaaS** relies on JSON Web Tokens (JWT) to send from the backend ([Pricing4Java](/category/Pricing4Java)), together with authentication data, the evaluation of different pricing features for the user that makes the request. In order to be used by [Pricing4React](./Pricing4React), the JWT must be stored as a `String` in the local storage of the browser, with the name `jwt`. 

The body of such token must have the following structure:

```
{
  "sub": String,
  "exp": timestamp,
  "iat": timestamp,
  "authentication": {
    ...
  },
  "features": {
    "feature1": {
        "eval": bool or string,
        "used": int,
        "limit": int
    },
    "feature2": {
        "eval": bool or string,
        "used": int,
        "limit": int
    },
    ...
  },
  "userContext": {
    ...
  },
  "planContext": {
    ...
  }
}
```

As you can see, with the 4 standard options of JWT, we have added a fifth: the `features` object. It contains the evaluation of the pricing features. The `eval` field could be a `boolean` that indicates the evaluation of the feature. `used` and `limit` are fields in which we can check the status of numerical limitations of the pricing plan. Specifically, `used` is the current use of the feature by the user (i.e 3 predictions made), and `limit` is the maximum number of times the feature can be used (i.e the user can perform up to 10 predictions). Both fields are optional, and if they are set to `null`, the feature will be considered as not limited. This could be interesting when we have simple boolean restrictions.

The `eval` field can also be a string that contains an expression that must be evaluated on the client side (for example, if it requires the previous evaluation of another feature). In this case, the expression must be a valid JavaScript expression, and the package will use the `eval` function to evaluate it. The expression can contain access the other two new paramenter on the JWT token's body: `userContext` and `planContext`. These two objects are used to store information about the user and the plan, respectively. They are optional, and if they are not present, they will be considered as empty objects.

As we said, you don't have to worry about the recreation of the JWT, since [Pricing4Java](./Pricing4Java) will do it for you on backend. However, if you want to create your own JWT, as long as it follows the structure above, the package will be able to perform the toggling.