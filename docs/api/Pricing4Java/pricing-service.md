---
sidebar_position: 6
custom_edit_url: null
---

# PricingService

This class offers a set of methods that can be used to manage the pricing configuration without manually modifying the YAML file. It can be used to retrieve, add, remove or modify plans and features.

To use this class, it must be injected in any bean using @Autowired. Once declared, the methods can be used to manage the pricing configuration.

```java
import io.github.isagroup.PricingService;

@Component
public class MyComponent {

    @Autowired
    private PricingService pricingService;

    public Map<String, Plan> getPricingPlans() {
        Map<String, Plan> plans = pricingService.getPricingPlans();
        return plans;
    }
}
```
## Complete List of Supported Methods

| **Method**                                                                                   | **Description**                                                                                                                                                                                        |
| -------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `Map<String, Feature>` **getPricingFeatures**()                                                        | Returns the features defined in the pricing configuration.                                                                                                                                      |
| `Map<String, UsageLimit>` **getPricingUsageLimits**()                                                        | Returns the usage limits defined in the pricing configuration.                                                                                                                                      |
| `Map<String, Plan>` **getPricingPlans**()                                                        | Returns the plans defined in the pricing configuration.                                                                                                                                      |
| `Map<String, AddOn>` **getPricingAddOns**()                                                        | Returns the add-ons defined in the pricing configuration.                                                                                                                                      |
| `Plan` **getPlanFromName**(String planName)                                                        | Returns the plan of the configuration that matchs the given name.                                                                                                                                      |
| `void` **addFeatureToConfiguration**(String name, Feature feature)                                 | Creates a new global feature in the pricing configuration and adds it to all the plans using its default value.                                                                                        |
| `void` **addUsageLimitToConfiguration**(UsageLimit usageLimit)                                     | Creates a new global usageLimit in the pricing configuration and adds it to all the plans using its default value.                                                                                     |
| `void` **addPlanToConfiguration**(String name, Plan plan)                                          | Adds a new plan to the current pricing configuration.                                                                                                                                                  |
| `void` **addAddOnToConfiguration**(AddOn addOn)                                                    | Adds a new add on to the current pricing configuration.                                                                                                                                                |
| `void` **updateFeatureFromConfiguration**(String previousName, Feature feature)                    | Updates a feature in the pricing configuration.                                                                                                                                                        |
| `void` **updateUsageLimitFromConfiguration**(String previousUsageLimitName, UsageLimit usageLimit) | Update an existing usage limit in the pricing configuration.                                                                                                                                           |
| `void` **updatePlanFromConfiguration**(String previousName, Plan plan)                             | Updates a plan in the pricing configuration.                                                                                                                                                           |
| `void` **updateAddOnFromConfiguration**(String previousName, AddOn addOn)                          | Updates an add on of the pricing configuration.configuration.                                                                                                                                          |
| `void` **removeFeatureFromConfiguration**(String name)                                             | Removes a feature from the pricing configuration. In order to do that, it must exist in the PricingContext that is being used. The method also removes the feature from all the plans that include it. |     |
| void` removeUsageLimitFromConfiguration(String name)                                          | Deletes an usage limit from the configuration.                                                                                                                                                         |
| `void` **removePlanFromConfiguration**(String name)                                                | Removes a plan from the pricing configuration. In order to do that, it must exist in the PricingContext that is being used.                                                                            |
| `void` **removeAddOnFromConfiguration**(String addOnName)                                          | Deletes an add on from the configuration.                                                                                                                                                              |

As any other spring service, to use this class it must be injected in any bean using @Autowired. Once declared, the methods can be used to manage the pricing configuration.