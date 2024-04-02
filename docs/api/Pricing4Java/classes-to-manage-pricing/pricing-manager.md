---
sidebar_position: 1
custom_edit_url: null
---

# PricingManager

This class is the main object of the package. It contains all the information about the pricing configuration and can be used to evaluate the context of an user and generate a JWT with the results.

```java
private String saasName;
    private int day;
    private int month;
    private int year;
    private String currency;
    private Boolean hasAnnualPayment;
    private Map<String, Feature> features;
    private Map<String, UsageLimit> usageLimits;
    private Map<String, Plan> plans;
    private Map<String, AddOn> addOns;

    // Getters and setters...
```

The name of each feature, usage limit, plan or addon is used as a key to access the information of the object. For example, to access the price of the plan `BASIC` we can use:

```java
pricingManager.getPlans().get("BASIC").getPrice();
```