---
sidebar_position: 2
title: useGenericFeature
custom_edit_url: null
---

# The useGenericFeature Hook

This hook is an alternative to the [Feature](./main-toggling-class) component. It also allows to show or hide UI components depending on the evaluation of a feature. But, you may be wondering, why would you use this hook instead of [Feature](./main-toggling-class)?

Well, the main difference is that the `useGenericFeature` hook does not introduce any compontent within your React's virtual-dom tree, which can be convenient in some complex rendering cases.

For example, the [react-router-dom](https://www.npmjs.com/package/react-router-dom) library forces `Routes` component to only have `Route` components as children. So, if you want to conditionally render a `Route` based on the feature evaluation of each user in order to forbid the access to such route, using this approach will simplify the logic.

## How to use it

The `useGenericFeature` hook receives an object with the following properties:

- `on`: An array of objects that represent the feature evaluation. Each object must have the following properties:
  - `expression`: A boolean condition or a function that returns a boolean. This function will be evaluated to determine if the feature is enabled or not.
    :::tip
    If you want to evaluate a pricing-driven feature, you can use the `feature` function, like in the `Feature` component.
    :::
  - `on`: The JSX element that will be rendered if the feature is enabled.

- `default`: The JSX element that will render its children if the evaluation of the feature performed in `on` attribute is `false`.

- `loading`: The JSX element that will render its children while the evaluation of the feature is being performed.

- `error`: The JSX element that will render its children if an error occurs while the evaluation of the feature is being 

:::danger
The `on` attribute is required to use the `useGenericFeature` hook.
:::

## Example

In this example, we are using the `useGenericFeature` hook to conditionally render some routes based on the evaluation of the `consultations` feature.

```jsx
const ownerOnlineConsultations = useGenericFeature({
    on: [
      {
        expression: feature("consultations"),
        on: (
          <>
            <Route path="/consultations" exact={true} element={<ConsultationList />} />
            <Route path="/consultations/:consultationId" exact={true} element={<ConsultationEdit />} />
            <Route path="/consultations/:consultationId/tickets" exact={true} element={<ConsultationTickets />} />
          </>
        ),
      },
    ],
    default: <Route path="/consultations" element={<Redirect to="/not-found" />} />,
    loading: <Route path="/consultations" element={<Loading />} />,
    error: <Route path="/consultations" element={<Error />} />,
  });
```