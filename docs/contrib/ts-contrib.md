# Pricing4TS guide

Pricing4TS has two modules inside:
- `client` contains the API that implements the specification of `Pricing2Yaml`
- `server` contains extra functions to work with the file system  and application servers
like Express, perform analysis operations with minizync,etc...

## Prerequisites

- Install NodeJS 20.x or higher
- Install npm 10.x or higher

## Commands

Run all test suite with:

```bash:
npm test
```

Run all test suite excluding `pricing-service` folder that contains a battery of
`Pricing2Yaml` files to be parsed:

```bash
npm run test:small
```

Make a release with:

```bash
npm build
```

## Contribution guide

### Think about the extension

We are going to answer the questions from the _[Think about the extension](./introduction.md#think-about-the-extension)_ section:

**How your extension is called?**

`highlight`

**Which domain objects your extension affects?**

`highlight` only affects plans

**What does your extension do?**

The `highlight` attribute is used to emphasize a plan in the user interface,
making it stand out from others and encouraging the user to purchase it
due to its benefits. When the `highlight` attribute is enable for a plan,
the UI should visually emphasize that specific plan. If `highlight`
is disable, no plans should stand out in the UI.

**What is your motivation to contribute with your extension?**

I saw in Github [pricing](https://github.com/pricing) that Enterprise plan
was surrounded by a box called `recommended`. I think is a good way to draw attention to users.

**What is the YAML type of your extension?**

bool

**Is your field required or optional?**

optional

**If your field is optional, Any default values are assumed?**

If highlight is missing `false` should be assumed by default

**Are there any field constraints or business logic involved?**

Only one plan can have the highlight attribute enabled at a time.

**How do you use your extension?** Provide a `yaml` example demonstrating your extension:

```YAML
plans:
  FREE:
    # highlight not present therefore false
  TEAM:
    # highlight not present therefore false
  ENTERPRISE:
    highlight: true
```

### Write code

Fork the [Pricing4TS](https://github.com/Alex-GF/Pricing4TS) repository and clone it:

```bash
git clone https://github.com/<username>/Pricing4TS.git
```

We are going to add the code needed to make the `highlight` extension following
the steps defined in _Writing code_ section in [Contributing to Pricing2Yaml](introduction.md)

**Step 1** Update the respective domain object to include your field:

Go to `plans.ts` located inside `models` folder and include your new field in the `Plan` interface.

```typescript title="src/main/models/pricing2yaml/plans.ts"
export interface Plan {
  name: string;
  description?: string;
  price: number | string;
  unit: string;
  private: boolean;
  // highlight-next-line
  highlight: boolean
  features: { [key: string]: Feature };
  usageLimits?: { [key: string]: UsageLimit };
}
```

**Step 2** Create an updater component that al least bumps the minor version of the specification field:

Create a new folder called `vXY-to-vYZ` with a `vXY-to-vYZ-updater.ts` file.
This script will hold all the code necessary if your extension needs changes in the
specification from one version to another.

:::info[Updaters file naming]
We use a `major` and `minor` parts of semver to version the `Pricing2Yaml` specification file. So all versions will be `X.Y` where `X` and `Y` are positive numbers.

Version order is the same as semver, compare these two versions:

- `1.0`
- `2.0`

Since the latter major version is greater than then former, version `2.0` is
greater than version `1.0`. If major versions are equal, the one with greater minor version wins.

All updater scripts name must be named following the `vXY-to-vYZ-updater` pattern. Where ``vXY`` is
the initial version of the specification and `vYZ` is the target version of the specification.
:::

Create a function `vXYtoVYZUpdater` that take as a parameter the pricing to be updated,
is our case is `extractedPricing`, and write the code to change the pricing object.
As we are only adding a field to a `Plan` no extra code is needed in the updater function,
just bump the version number using the `calculateNextVersion` util function.

```typescript title="src/server/utils/version-updaters/vXY-to-vYZ/vXY-to-vYZ-updater.ts"
import { calculateNextVersion } from '../../version-manager';

export default function vXYToVYZUpdater(extractedPricing: any): any {
  const nextVersion = calculateNextVersion(extractedPricing.syntaxVersion);

  extractedPricing.syntaxVersion = nextVersion;

  return extractedPricing;
}
```

**Step 3** Link your updater with the previous updaters and make sure it works:

Put inside the `updaters` object the previous function with a key named like `X.Y` part of the updater.
For example if you are updating from version `2.1` to version `2.2`, the key will be named `2.1`.
Put another key named like `Y.Z` with a `null` value, this is essential to stop the updater algorithm.

```typescript title="src/server/utils/version-updaters/updaters.ts"
// updaters imports...
// highlight-next-line
import vXYTovYZUpdater from "./vXY-toYZ/vXY-to-YZ-updater";

export const updaters: {[key: string]: ((extractedPricing: any) => any) | null} = {
    // updaters...
    // highlight-start
    "X.Y": vXYTovYZUpdater,
    "Y.Z": null
    // highlight-end
}
```

After including your `vXYToVYZUpdater` in the `updaters` object, add the new target version
`Y.Z` in the `PRICING2YAML_VERSIONS` array since the `calculateNextVersion` function 
that you use in the updater depends on it.

```typescript title="src/server/utils/version-manager.ts"
export const PRICING2YAML_VERSIONS: Array<string> = ["...versions", "Y.Z"];
```

**Step 4** Code your extensions validations and business logic:

As we have specified in [Think about the extension](#think-about-the-extension) section, highlight needs to be an optional boolean field. So we only allow `undefined` and `boolean` type support. Put the following code
inside the file `pricing-validators.ts`:

```typescript title="src/main/utils/pricing-validators.ts"
export function checkHighlightType(highlight: unknown): boolean {
  if (highlight === undefined) {
    // Explanation: If highlight is not defined in yaml file default to false
    return false
  }
  if (highlight === null) {
    throw new Error("highlight is null")
  } else if (typeof highlight !== "boolean") {
    throw new Error("highlight is not a boolean")
  } else {
    return highlight
  }
}
```

Now that we have checked the type of `highlight` we are going to plug the
`checkHighlightType` function into the `parsePlan` function and write
the code to enforce that only one plan can enable the highlight flag.
Put all the following code in the `pricing-parser.ts` file.

```typescript title="src/main/utils/pricing-formatting/pricing-parser.ts"

export function parsePricing(extractedPricing: ExtractedPricing): Pricing {
  // other parsing code...

  // highlight-next-line
  validateNumberOfHiglhlightedPlans(pricing.plans)

  return pricing;


}

// highlight-start
function validateNumberOfHiglhlightedPlans(plans: Record<string,Plan>) {
  if (countPlansWithHighlight(Object.values(plans)) > 1) {
    throw Error("There has to be only one highlighted plan")
  }
}

function countPlansWithHighlight(plans: Plan[]) {
  return plans.filter(plan => plan.highlight).length
}
// highlight-end


function parsePlan(plan: Plan, pricing: Pricing): Plan {
  try {

    // other parsing code...

    // highlight-next-line
    plan.highlight = checkHighlightType(plan.highlight)
  
  } catch (err) {
    throw new Error(`Error parsing plan ${plan.name}. Error: ${(err as Error).message}`);
  }

  return plan;
}
```

**Step 5** Update the serializer to include your extension when dumping the yaml:

Now that we can finally parse `highlight` field, we need to be able to
serialize it back to a yaml file. If `highlight` is `false` we don't
want to serialize the field as it is the default value. If highlight is `true`
then we have to dump it into the file.

```typescript title="src/main/utils/pricing-formatting/pricing-serializer.ts"
function serializePlans(pricing: Pricing, pricingToBeWritten: PricingToBeWritten) {
  pricingToBeWritten.plans = pricing.plans;

  pricingToBeWritten.plans &&
    Object.keys(pricingToBeWritten.plans).forEach(planName => {
      const plan: any = (pricingToBeWritten.plans! as ContainerPlans)[planName];

      // highlight-start
        if (typeof plan === "object" && !Array.isArray(plan)) {
        plan.highlight = plan?.highlight || undefined
      }
      // highlight-end
      
      _formatPricingContainerFields(plan, "plan");
    });
}
```

### Write tests

Writing tests in `Pricing4TS` consist of writting _positve_ and _negative_ cases in yamls
and doing assertions based on the field under test.

:::info[Positive and Negative tests]

- Positive tests are yamls that are well written according to the specification.
- Negative tests are yamls bad written according to Pricing2Yaml specification or that do not satisfy our business logic rules.
  :::

Positive cases are placed in the `tests/resources/pricing/positive` folder,
negative cases are placed in the `tests/resources/pricing/negative` folder. Each field of the
specification should have al least one positive and negative case. If the field you are testing has a parent object
like `plan`, create a folder inside the parent folder and place the test cases inside. Here is an
overview of the folder structure:


```txt title="Positive and Negative yaml tests structure"
\---tests
    +---decorators
    +---dzn-exporter
    +---evaluator
    +---middleware
    +---pricing-service
    |   \---data
    +---resources
        \---pricing
            +---full
            |   +--- ...
            +---negative
            |   +---addOn
            |   |   +---private
            |   |   +---usageLimits
            |   |   \---usageLimitsExtensions
            |   +---billing
            |   +---createdAt
            |   +---currency
            |   +---feature
            |   |   +---type
            |   |   \---valueType
            |   +---features
            |   +---plan
            |   |   +---highlight
            |   |   +---price
            |   |   \---private
            |   +---plans
            |   +---saasName
            |   +---syntaxVersion
            |   +---tags
            |   +---url
            |   \---variables
            +---positive
                +---addOn
                |   \---private
                +---billing
                +---createdAt
                +---feature
                |   +---expression
                |   \---type
                +---plan
                |   +---features
                |   +---highlight
                |   \---private
                +---saasName
                +---tags
                +---url
                \---variables
```

#### Write positive tests

Write a yaml with two plans, one plan should have highlight enabled. Create a folder inside `postive/plan` named `highlight` and copy the following content inside:

```yaml title="tests/resources/pricing/positive/plan/highlight/highlight.yml"
saasName: Test
syntaxVersion: '2.2'
createdAt: '2025-03-18'
currency: EUR
features:
  feature1:
    valueType: BOOLEAN
    defaultValue: true
    type: DOMAIN
  feature2:
    valueType: BOOLEAN
    defaultValue: false
    type: DOMAIN
plans:
  BASIC:
    price: 0
    features: null
    usageLimits: null
  PRO:
    price: 5
    highlight: true
    features:
      feature2:
        value: true
    usageLimits: null
addOns: null
```

After that write a test that given the previous yaml should assert that:

- Given a plan with `highlight` enabled the plan field `highlight` shoud be true.
- Given no `highlight` field the plan object should have load a `false`.

```typescript title="tests/yaml/parser.test.ts"
it("Test highlight field", () => {
  const pricing = retrievePricingFromPath("tests/resources/pricing/positive/plan/highlight/highlight.yml")
  expect(pricing.plans?.BASIC.highlight).toBe(false)
  expect(pricing.plans?.PRO.highlight).toBe(true)
})
```

#### Write negative tests

When writting negative test try to `break` the behaviour of parsing and assert
the exceptions thrown.

Since `higlight` is a `bool` according to the specification, we can assert
that if a `string` is provided an exception should be throw. Put the following file
inside `higlight` under `plan` folder under `negative` tests folder:

```yaml title="tests/resources/pricing/negative/plan/highlight/string-highlight.yml"
saasName: Test
syntaxVersion: '2.2'
createdAt: '2024-01-15'
currency: EUR
features:
  feature1:
    valueType: BOOLEAN
    defaultValue: true
    type: DOMAIN
  feature2:
    valueType: BOOLEAN
    defaultValue: false
    type: DOMAIN
plans:
  BASIC:
    price: 0
    features: null
    usageLimits: null
    highlight: foo
```

We can also check that given multiple plans with `highlight` enable it should throw an exception.
Create the yaml test case and put it inside `highlight` folder under `negative/plan`:

```yaml title="tests/resources/pricing/negative/plan/highlight/multiple-highlight.yml"
saasName: Test
syntaxVersion: '2.2'
createdAt: '2024-01-15'
currency: EUR
features:
  feature1:
    valueType: BOOLEAN
    defaultValue: true
    type: DOMAIN
  feature2:
    valueType: BOOLEAN
    defaultValue: false
    type: DOMAIN
plans:
  BASIC:
    price: 0
    highlight: true
    features: null
    usageLimits: null
  PRO:
    price: 5
    highlight: true
    features:
      feature2:
        value: true
    usageLimits: null
```

We have a test for negative cases that given a `.csv` file with the path to
the yaml file and the expected error message should check that exceptions are thrown.
You only have to add two entries in negative tests file named `negative-parsing-tests.csv`
under resources `tests/yaml/data` folder, no other code is needed.

:::info Negative cases CSV file format

- The first entry of the file is a test description that summarizes what it asserts
- The second entry is the path where the yaml file is located and
- The third entry is the message thrown by the exception.

For example:

```csv
testName,pricingPath,expected
---------- url ----------,-,-
Given pricing with number url should throw an error,tests/resources/pricing/negative/url/number-url.yml,The url field must be a string. Received: 123
```

:::


Add the following to `negative-parsing-tests.csv` file:

```diff title="tests/yaml/data/negative-parsing-tests.csv"
Given plan with string private should throw an error,tests/resources/pricing/negative/plan/private/string-private.yml,Error parsing plan BASIC. Error: The private field must be a boolean. Received: test
+ ---------- plans.highlight ----------,-,-
+ Given a plan with multiple highlight should throw an error,tests/resources/pricing/negative/plan/highlight/multiple-highlight.yml,There has to be only one highlighted plan
+ Given a plan with string highlight should throw an error,tests/resources/pricing/negative/plan/highlight/string-highlight.yml,Error parsing plan BASIC. Error: highlight is not a boolean
---------- addons.private ----------,-,-
```

Check that tests passed running `npm run test:small`.
