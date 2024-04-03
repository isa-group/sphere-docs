---
sidebar_position: 4
custom_edit_url: null
---

# Plan

This class models the information of a plan.

```java
public class Plan {
    private String name;
    private String description;
    private Object monthlyPrice;
    private Object annualPrice;
    private String unit;
    private Map<String, Feature> features;
    private Map<String, UsageLimit> usageLimits;

    // Getters and setters...
}
```