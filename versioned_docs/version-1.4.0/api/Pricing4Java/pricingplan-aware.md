---
sidebar_position: 7
custom_edit_url: null
---

# PricingPlanAware

The library also provides an method level annotation called `@PricingPlanAware` that receives a string called `featureId` as paramater. This feature must exist inside the pricing configuration.
By combining the use of this annotation with the spring's `@Transactional`, it is possible to automate feature checking on the service layer of the application.

The annotation performs an evaluation of the feature right after the method is executed. If the evaluation determines that the pricing plan is not being respected, a PricingPlanEvaluationException is thrown, so all the changes made are removed by the `@Transactional` annotation rollback. On the other hand, if the evaluation is correct, the changes are commited and the method returns normally.

The following snippet is an example of the use of this annotation inside a demo app service:

```java
import io.github.isagroup.annotations.PricingPlanAware;

// ...

@PricingPlanAware(featureName = "myFeature")
@Transactional(rollbackFor = { PricingPlanEvaluationException.class })
public T myFeatureService(T parameter) {
  // Service level logic
}

// ...
```