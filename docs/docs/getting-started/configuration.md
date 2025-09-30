---
sidebar_position: 2
custom_edit_url: null
---

# 📖 Tutorial: Get started in 10 minutes!

Welcome to the **Pricing4SaaS** tutorial! In this guide, you'll learn the basics of **Pricing4SaaS** in just 10 minutes. By the end of this tutorial, you'll have a solid understanding of the core concepts and features that make **Pricing4SaaS** a powerful tool for integrating pricing plans into your SaaS systems.

## 🚀 Prerequisites

Before you begin, make sure you have the following prerequisites in place:

- **Node.js**: Ensure you have Node.js installed in your system. You can download it from the official [Node.js website](https://nodejs.org/).

:::warning

The library has been built using Node 21.4.0 and npm 10.2.4. We recommend using these versions or above.

:::

- **Maven**: Ensure you have the Maven package manager installed in your system. You can download it from the official [Maven downloads website](https://maven.apache.org/download.cgi).

:::tip

We encourage to use the version 3.9.6 or above of Maven.

:::

- **Spring 6**: Ensure you have the Spring 6 framework installed in your system. You can download it from the official [Spring website](https://spring.io/).

:::warning
The versions of Pricing4Java and Pricing4React covered by this documentation have been designed to be used with Spring 6. We recommend using this version of the framework or above.
:::

## 📦 Installation

To get started with **Pricing4SaaS**, you'll need to install both `Pricing4Java` on a maven-based spring project, and `Pricing4React` on a React application. To perform this process, see the [instalation guide](./instalation.md).

## 🔧 Setting up the spring project with Princing4Java

### 1. Configure your application class to scan Pricing4Java

```java title="src/main/java/org/example/MyFirstPricingDrivenSaaSApplication.java"
// highlight-next-line
@SpringBootApplication(scanBasePackages = {"io.github.isagroup", "org.springframework.samples.myapplication"})
public class MyFirstPricingDrivenSaaSApplication {

  public static void main(String[] args) {
    SpringApplication.run(MyFirstPricingDrivenSaaSApplication.class, args);
  }

}
```

### 2. Declare a pricing configuration file

Pricing4Java uses a YAML file written in the [Pricing2Yaml](../../api/pricing-description-languages/Pricing2Yaml/the-pricing2yaml-syntax) syntax to represent and manage the whole pricing. Place the pricing configuration file anywhere inside the folder `src/main/resources`. Create the file `pricing.yml` within such directory and copy the snippet below, which shows a basic structure of such syntax:

```yaml title="src/main/resources/pricing.yml"
saasName: My First Pricing Driven SaaS
version: "1.0"
day: 10
month: 03
year: 2024
currency: USD
hasAnnualPayment: false
features:
  cloudStorage:
    description: Store your personal files with our cloud storage service
    valueType: BOOLEAN
    defaultValue: true
    type: DOMAIN
    expression: userContext['cloudStorageUse'] < planContext['cloudStorage']
    serverExpression: userContext['cloudStorageUse'] <= planContext['cloudStorage']
  adminDashboard:
    description: Manage your users easily with our dashbord for administrators
    valueType: BOOLEAN
    defaultValue: false
    type: MANAGEMENT
    expression: userContext['cloudStorageUse'] < planContext['cloudStorage']
    serverExpression: userContext['cloudStorageUse'] <= planContext['cloudStorage']
usageLimits:
  cloudStorageMaxCapacity:
    description: This is the usage limit imposed to the cloudStorage feature
    valueType: NUMERIC
    unit: GB
    defaultValue: 1
    type: NON_RENEWABLE
    linkedFeatures:
      - cloudStorage
plans:
  FREE:
    description: The free plan is allowed to all users
    monthlyPrice: 0
    unit: user/month
  PREMIUM:
    description: Unlock all our features with the premium plan
    monthlyPrice: 15
    unit: user/month
    features:
      adminDashboard:
        value: true
    usageLimits:
      cloudStorageMaxCapacity:
        value: 10
addOns:
  extraCloudStorageCapacity:
    availableFor:
      - FREE
      - PREMIUM
    price: 20
    unit: user/month
    usageLimitsExtensions:
      cloudStorageMaxCapacity:
        value: 100
```

### 2.1 (OPTIONAL) Create a unit test to validate the Pricing2Yaml file

If you are interested in checking if your YAML file is correctly formatted, you can implement a test to do so. Here it is an example:

```java
@Test
void parsePostmanYamlToClassTest() {
    PricingManager pricingManager = YamlUtils.retrieveManagerFromYaml("{NAME_OF_YOUR_FILE}.yml");
}
```

The test will fail if the YAML file does not correctly follow the [Pricing2Yaml syntax](../../api/pricing-description-languages/Pricing2Yaml/the-pricing2yaml-syntax.md), and will throw an exception explaining the problem.

### 3. Configure the pricing context

Once the pricing configuration file is ready, the next step is to create a component that extends the [PricingContext](../../api/Pricing4SaaS/Pricing4Java/pricing-context) abstract class. This component will be the key to manage all the pricing configuration, including user context evaluation, JWT generation, pricing operations, etc.

```java title=title="src/main/java/org/example/config/PricingConfiguration.java"
@Component
public class PricingConfiguration extends PricingContext {

    @Override
    public String getJwtSecret() {
        return "mySecret";
    }

    @Override
    public String getConfigFilePath() {
        // Path relative to src/main/resources folder
        return "pricing.yml";
    }

    @Override
    public Map<String, Object> getUserContext() {

        Map<String, Object> userContext = new HashMap<>();

        // Add the logic to retrieve all the data needed within the user context, such as his current usage of the feature cloudStorage.

        return userContext;
    }

    @Override
    public String getUserPlan() {

        // Should be replace by the logic that returns the plan name of the current user.
        return "BASIC";
    }

}

```

### 4. Configure the security context

After the `PricingConfiguration` is set, you must add a `@Bean` [RenewTokenFilter](../../api/Pricing4SaaS/Pricing4Java/renew-token-filter) in
some configuration class with annotation `@Configuration`. This filter will be responsible for checking the JWT token in every request, keeping your frontend's feature evaluation context up to date with your backend's.

```java title="src/main/java/org/example/config/WebConfig.java"

import io.github.isagroup.filters.RenewTokenFilter;

@Configuration
public class WebConfig {
    // Other configurations...

    @Bean
    public RenewTokenFilter renewJwtTokenFilter() {
      return new RenewTokenFilter();
    }

    // Other configurations...
}
```

:::warning

If you have Cross-Origin Resource Sharing (CORS) within your application, we recommend to check the [RenewTokenFilter documentation](../../api/Pricing4SaaS/Pricing4Java/renew-token-filter).

:::

## 🚀 Adding dynamic feature toggles with Pricing4React

### 1. Implement a filter to manage the JWT

In order to run Pricing4React, you have to store the JWT generated by Pricing4Java in the local storage of the browser with the key `pricingToken`. This operation can be performed after a valid response have been received from the backend when login/registering an user.

### 2. Use Pricing4React components

The package provides a component that contains almost the whole logic you need to manage your toggles: `Feature`. This component allows to show or hide its children depending on the evaluation of a pricing feature. It has the prop `expression`, which reads from the JWT the evaluation of the feature. You can use the `feature` function to locate features by their key.

Depending on the context, it can have up to four children:

- `On`: This component will be shown if the feature is evaluated to `true`.
- `Default`: This component will render its children if the evaluation of the feature performed in `On` component is `false`.
- `Loading`: This component will render its children while the evaluation of the feature is being performed.
- `ErrorFallback`: This component will render its children if an error occurs while the evaluation of the feature is being performed.

The evaluation of a feature that has the key `cloudStorage` would be:

```jsx
import {
  Default,
  ErrorFallback,
  Feature,
  On,
  Loading,
  feature,
} from "pricing4react";

export default function MyComponent() {
  return (
    <Feature expression={feature("cloudStorage")}>
      <On>
        <p>CloudStorage feature is enabled</p>
      </On>
      <Default>
        <p>CloudStorage feature is disabled</p>
      </Default>
      <Loading>
        <p>Loading...</p>
      </Loading>
      <ErrorFallback>
        <p>An error occurred</p>
      </ErrorFallback>
    </Feature>
  );
}
```

In this case, the `feature` function (used within the `expression` prop) is in charge of retrieving the result of the feature evaluation (as a boolean), saved inside the user JWT. It just need the key of the feature to find it. <!-- However, the `expression` prop can also receive a boolean condition or value to be evaluated. -->

## Want to see a real example?

You can find a complete integration of the **Pricing4SaaS** suite into a react+spring version of the Petclinic [in this repository](https://github.com/isa-group/petclinic-react)
