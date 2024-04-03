---
sidebar_position: 1
custom_edit_url: null
---

# PricingContext

This abstract class is the key to manage the YAML configuration inside a spring app. It provides a set of configurable methods that need to be implemented inside a new component that extends this class to use other classes of the package. Inside your spring project, create the following component:

```java

import io.github.isagroup.PricingContext;

@Component
public class PricingConfiguration extends PricingContext {

    @Override
    public String getJwtSecret(){
        // This method must return the JWT secret that should be used to create tokens
    }

    @Override
    public String getConfigFilePath(){
        // This method must return the configuration file path relative to the resources folder
    }

    @Override
    public Object getUserAuthorities() {
        // This method should return the object used inside the application to determine the authority of the user inside the JWT.
    }

    @Override
    public Map<String, Object> getUserContext() {
        // This method should return the user context that will be used to evaluate the pricing plan.
        // It should be considered which users has accessed the service and what information is available.
    }

    @Override
    public String getUserPlan() {
        // This method should return the plan name of the current user.
        // With this information, the library will be able to build the Plan object of the user from the configuration.
    }

    // OPTIONALLY OVERRIDE THE FOLLOWING METHODS TO ADD CUSTOM FUNCTIONALITY

    @Override
    public int getJwtExpiration() {
        return 86400000; // Configures a custom expiration time of the JWT in milliseconds
    }

    @Override
    public Boolean userAffectedByPricing(){
        return true; // A condition that determines wether an user should be affected by the pricing or not
    }

}

```

By creating this component inside your project, spring will be able to use this information wherever it is needed.

The class also provides a set of methods that can be used to retrieve information about the pricing configuration anywhere in the app. By injecting the component in any class, the following methods can be used:

- **getPlanContext**: Returns a `Map<String, Object>` that represents the plan context that is going to be evaluated.

- **getPricingManager**: Maps the information of the YAML configuration file to a PricingManager object to easily operate with pricing properties.