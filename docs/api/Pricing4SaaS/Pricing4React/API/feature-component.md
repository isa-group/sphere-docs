---
sidebar_position: 1
custom_edit_url: null
---

# The `Feature` Component

The package provides a component that contains almost the whole logic you need to manage your toggles: `Feature`. This component allows to show or hide its children depending on the evaluation of a pricing feature. It has the prop `expression`, which reads from the JWT the evaluation of the feature. You can use the `feature` function to locate features by their key.

Depending on the context, it can have up to four children:

- `On`: This component will be shown if the feature is evaluated to `true`.
- `Default`: This component will render its children if the evaluation of the feature performed in `On` component is `false`.
- `Loading`: This component will render its children while the evaluation of the feature is being performed.
- `ErrorFallback`: This component will render its children if an error occurs while the evaluation of the feature is being performed.

The evaluation of a feature that has the key `myFeature` would be:

```jsx
<Feature expression={feature("myFeature")}>
    <On>
        <p>myFeature is enabled</p>
    </On>
    <Default>
        <p>myFeature is disabled</p>
    </Default>
    <Loading>
        <p>Loading...</p>
    </Loading>
    <ErrorFallback>
        <p>An error occurred</p>
    </ErrorFallback>
</Feature>
```

:::info

The `feature` function (used within the `expression` prop) is in charge of retrieving the result of the feature evaluation (as a boolean), saved inside the user JWT. It just need the key of the feature to find it.

:::