---
sidebar_position: 5
---

# AddOn

This class models the information of an addOn.

```java
public class AddOn {
    private String name;
    private List<String> availableFor;
    private Object price;
    private Object monthlyPrice;
    private Object annualPrice;
    private String unit;
    private Map<String, Feature> features;
    private Map<String, UsageLimit> usageLimits;
    private Map<String, UsageLimit> usageLimitsExtensions;

    // Getters and setters...
}
```