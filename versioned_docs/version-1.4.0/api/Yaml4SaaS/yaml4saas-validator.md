---
sidebar_position: 3
custom_edit_url: null
---

# Yaml4SaaS Validator

Pricing4Java includes a built-in validator in every method of the [YamlUtils](../Pricing4Java/yaml-utils). If you are interested in checking if your YAML file is correctly formatted, you can implement a test to do so. Here it is an example:

```java
@Test
@Order(X)
void parsePostmanYamlToClassTest() {
    PricingManager pricingManager = YamlUtils.retrieveManagerFromYaml("pricing/{NAME_OF_YOUR_FILE}.yml");
}
```

The test will fail if the YAML file does not correctly follow the Yaml4SaaS syntax, and will throw an exception explaining the problem.