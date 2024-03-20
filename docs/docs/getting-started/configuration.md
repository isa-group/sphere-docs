---
sidebar_position: 2
---

# 📖 Tutorial: Get started in 10 minutes!

Welcome to the **Pricing4SaaS** tutorial! In this guide, you'll learn the basics of **Pricing4SaaS** in just 5 minutes. By the end of this tutorial, you'll have a solid understanding of the core concepts and features that make **Pricing4SaaS** a powerful tool for integrating pricing plans into your SaaS systems.

## 🚀 Prerequisites

Before you begin, make sure you have the following prerequisites in place:

- **Node.js**: Ensure you have Node.js installed on your system. You can download it from the official [Node.js website](https://nodejs.org/).

## 📦 Installation

To get started with **Pricing4SaaS**, you'll need to install both `Pricing4Java` on a maven-based spring project, and `Pricing4React` on a React application. To perform this process, see *[the instalation guide](./instalation.md)*.

## 🔧 Setting up the spring project with Princing4Java

### 1. Configure your application class to scan Pricing4Java

```java
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication()
@ComponentScan(basePackages = {"io.github.isagroup", "org.springframework.samples.petclinic"})
public class PetclinicApplication {

	public static void main(String[] args) {
		SpringApplication.run(PetclinicApplication.class, args);
	}

	// Other application level configurations...

}
```

### 2. Declare a pricing configuration file

Pricing4Java uses a YAML file written in the [Yaml4SaaS](#yaml4saas) syntax to represent and manage the whole pricing. The file must be placed inside the classpath of the project. Create the file `pricing/pricing.yml` within such directory and copy the snippet below, which shows a basic structure of such syntax:

```yaml
saasName: My First Pricing Driven SaaS
day: 10
month: 03
year: 2024
currency: USD
features:
  cloudStorage:
    description: "This is a fancy description of the cloudStorage feature"
    valueType: BOOLEAN
    defaultValue: true
    type: DOMAIN
    expression: "userContext['cloudStorageUse'] < planContext['cloudStorage']"
    serverExpression: "userContext['cloudStorageUse'] <= planContext['cloudStorage']"
  adminDashboard:
    description: "The admin dashboard is a powerful tool to manage the SaaS"
    valueType: BOOLEAN
    defaultValue: false
    type: MANAGEMENT
    expression: "userContext['cloudStorageUse'] < planContext['cloudStorage']"
    serverExpression: "userContext['cloudStorageUse'] <= planContext['cloudStorage']"
usageLimits:
  cloudStorageMaxCapacity:
    description: "This is the usage limit imposed to the cloudStorage feature"
    valueType: NUMERIC
    unit: GB
    defaultValue: 1
    type: NON_RENEWABLE
    linkedFeatures:
      - cloudStorage
plans:
  FREE:
    description: "The free plan is allowed to all users"
    monthlyPrice: 0
    unit: "user/month"
  PREMIUM:
    description: "Unlock all our features with the premium plan"
    monthlyPrice: 15
    unit: "user/month"
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

### 3. Configure the pricing context

Once the pricing configuration file is ready, the next step is to create a component that extends the [PricingContext](#pricingContext) abstract class. This component will be the key to manage all the pricing configuration, including user context evaluation, JWT generation, pricing operations, etc.

```java
import io.github.isagroup.PricingContext;

@Component
public class PricingConfiguration extends PricingContext {

    @Override
    public String getJwtSecret(){
        return "mySecret";
    }

    @Override
    public String getConfigFilePath(){
        return "pricing/pricing.yml";
    }

    @Override
    public Object getUserAuthorities() {

        Map<String, String> authorities = new HashMap<>();

        authorities.put("username", "John");
        authorities.put("role", "admin");

        return authorities;
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

### 4. Generate JWT token with evaluation

Once the PricingConfiguration is set, you can inject in any component all the features included in Pricing4Java. For example, to generate the JWT that can be sent to a frontend that implements [Pricing4React](https://github.com/isa-group/pricingplans-react):

```java
@Service
public class UserService {

	//...

	@Autowired
	private PricingEvaluatorUtil pricingEvaluatorUtil;

    //...

    public String login(String username, String password) {

        if(validCredentials(username, password)){
            return pricingEvaluatorUtil.generateUserToken();
        } else {
            return null;
        }
    }
}
```

In this example, the `generateUserToken` method is used to generate a JWT that contains the result of the feature evaluation for the user.

```
{
  "features": {
    "cloudStorage": {
      "eval": true,
      "limit": 1,
      "used": 0.1
    },
    "adminDashboad": {
      "eval": false,
      "limit": null,
      "used": null
    },
  },
  "sub": "testUser",
  "exp": 1687705951,
  "userContext": {
    ...
  },
  "iat": 1687705864,
  "authorities": {
    "username": "testUser"
    "role": "customer",
  },
  "planContext": {
    ...
  }
}
```

## 🚀 Adding dynamic feature toggles with Pricing4React

### 1. Implement a filter to manage the JWT

In order to run Pricing4React, you have to store the JWT generated by Pricing4Java in the local storage of the browser with the key `token`. This operation can be performed after a valid response have been received from the backend when login/registering an user.

### 2. Use Pricing4React components

The package provides a component that contains almost the whole logic you need to manage your toggles: `Feature`. This component allows to show or hide its children depending on the evaluation of a pricing feature. Depending on the context, it can have up to four children:
- `On`: This component will be shown if the feature is evaluated to `true`. It has the prop `expression`, which reads from the JWT the evaluation of the feature. You can use the `feature` function to locate features by their key. **REQUIRED**
- `Default`: This component will render its children if the evaluation of the feature performed in `On` component is `false`.
- `Loading`: This component will render its children while the evaluation of the feature is being performed.
- `ErrorFallback`: This component will render its children if an error occurs while the evaluation of the feature is being performed.

The evaluation of a feature that has the key `myFeature` would be:

```jsx
<Feature>
    <On expression={feature("myFeature")}>
        <p>Feature 1 is enabled</p>
    </On>
    <Default>
        <p>Feature 1 is disabled</p>
    </Default>
    <Loading>
        <p>Loading...</p>
    </Loading>
    <ErrorFallback>
        <p>An error occurred</p>
    </ErrorFallback>
</Feature>
```

## Want to see a real example?

You can find a complete integration of the **Pricing4SaaS** suite into a react+spring version of the Petclinic [in this repository](https://github.com/isa-group/petclinic-react)