---
sidebar_position: 3
custom_edit_url: null
---

# UsageLimit

This abstract class models the information of an usageLimit.

```java
public abstract class UsageLimit {
    private String name;
    private String description;
    private ValueType valueType;
    private Object defaultValue;
    protected UsageLimitType type;
    private String unit;
    private transient Object value;
    private List<String> linkedFeatures = new ArrayList<>();
    private String expression;
    private String serverExpression;

    // Getters and setters...

    public boolean isLinkedToFeature(String featureName);

    // Extra methods...
}
```

The method isLinkedToFeature can be used to check if the feature whose name is received as parameter is linked to the usageLimit.

Besides, each usage limit type supported by Pricing2Yaml is represented by a class that extends this abstract one. The following list shows the classes that extend Feature:

- **NonRenewable**
- **Renewable**
- **ResponseDriven**
- **TimeDriven**