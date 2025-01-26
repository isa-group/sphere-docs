---
sidebar_position: 2
custom_edit_url: null
---

# Integration with Open Feature

[OpenFeature](https://openfeature.dev) is an open standard that provides a vendor-agnostic, community-driven API for feature flagging that works with DevCycle.

In the case that you prefer to use the OpenFeature API to interface with Pricing4React, we provide a TypeScript implementation of the OpenFeature Web Provider interface.

## How to use the provider

### 1. Install the Open Feature SDK for react

```bash
npm i @openfeature/react-sdk
```

### 2. Configure OpenFeature with the ReactPricingDrivenFeaturesProvider

Next, OpenFeature can be configured with a **provider**, which is the engine that will process all underlying logic of the feature toggling. It can be set with the *setProvider* method:

```javascript
OpenFeature.setProvider(new YourProviderOfChoice(), evaluationContext);
```

As can be noted, OpenFeature can be initialized with a custom evaluationContext that is aimed to contain all the necessary information to perform the evaluation.

So, in order to use OpenFeature with the **ReactPricingDrivenFeaturesProvider**, it should be configured like this:

```javascript
OpenFeature.setProvider(new ReactPricingDrivenFeaturesProvider(), {
      pricingUrl: 'http://sphere.score.us.es/static/pricings/uploadedDataset/Pricing-driven%20Feature%20Toggling%20Demo/2025-1-8.yml',
      subscription: ["FREE"],
      userContext: {
        user: "test",
        // Extra fields needed from the user context to perform the evaluation of features...
      },
    });
```

As can be seen, the **ReactPricingDrivenFeaturesProvider** relies on a specific structure of the evaluationContext to work as expected:

- To populate the **pricingUrl** field, we highly recommend uploading your pricing data to [SPHERE](http://sphere.score.us.es). This will give you a direct URL to the uploaded file. If you prefer not to share the **Pricing2Yaml** model publicly, you can host the file elsewhere. The only requirement is that when you send a GET request to the URL specified in **pricingUrl**, the service must return the YAML file’s text.
- The **subscription** field contains a list of strings that specify the plan (if any in the pricing) and add-ons (if any is selected) that will conform the subscription of the user for which the evaluation will be performed.
- The **userContext** is a `Record<string, any>` that must contain a *user* field with the username (or unique identifier) of the user under evaluation. In addition, it should hold all other information required to perform the evaluation --- such as the user's current usage of a feature that has an usage limit.

### 3. Use OpenFeature

Once completed all previous steps, you should see in the console of your app a message indicating that the *Provider* has been initialized successfully.

```
PricingDrivenFeaturesProvider initialized with context: 
  > Object

    > pricingUrl:       "http://sphere.score.us.es/static/pricings/uploadedDataset/Pricing-driven%20Feature%20Toggling%20Demo/2025-1-8.yml"

    > subscription: ["FREE"]

    > userContext: {user: "test", createdExpenses: 2}
```

After that, you can use the OpenFeature client to perform the evaluation of features:

```typescript
// Evaluate a feature
const result = await client.getBooleanValue('featureName', false);
```
:::info
The last parameter denotes the default value of the evaluator, which is the one that is going to be used if an Error is thrown during evaluation.
:::

:::info
We strongly recommend to only use getBooleanValue or useBooleanValue, since the evaluation of pricing features always return a boolean, i.e. the feature is enabled/disabled for the user, no matter what the initial feature type was: BOOLEAN, NUMERIC or TEXT
:::

### Extra tip

In our [demo app](https://github.com/Alex-GF/unleash4pricing) we have created a custom FeatureFlag component that manage the render of its children based on the evaluation of a specific feature. This would be its implementation, considering that the ReactPricingDrivenFeaturesProvided has been configured.

```tsx
import { useBooleanFlagValue } from '@openfeature/react-sdk';

export default function FeatureFlag({
  featureName,
  children,
}: {
  featureName: string;
  children: React.ReactNode;
}) {

  const isEnabled = useBooleanFlagValue(featureName);

  return isEnabled ? <>{children}</> : <></>;
}
```

And it would be used as follows:

```tsx
<FeatureFlag featureName="testFeature">
  <ChildComponent/>
</FeatureFlag>
```
