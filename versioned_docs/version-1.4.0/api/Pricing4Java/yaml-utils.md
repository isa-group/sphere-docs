---
sidebar_position: 3
custom_edit_url: null
---

# YamlUtils

This class contains two static methods that can be used to parse the YAML specification of a pricing in the Yaml4SaaS syntax to a PricingManager object and vice versa. To extract the information of the YAML file:

```java
import io.github.isagroup.models.PricingManager;
import io.github.isagroup.services.yaml.YamlUtils;

@Component
public class MyComponent {

    public String myMethod() {
        PricingManager pricingManager = YamlUtils.retrieveManagerFromYaml("pricing/pricing.yml");
    }
}
```

And to write the information of a PricingManager object into the YAML file:

```java
import io.github.isagroup.models.PricingManager;
import io.github.isagroup.services.yaml.YamlUtils;

@Component
public class MyComponent {

    public String myMethod() {

        PricingManager pricingManager = new PricingManager(); // This should be your dynamically retrieved pricingManager object

        YamlUtils.writeYaml(pricingManager, "pricing/pricing.yml");
    }
}
```