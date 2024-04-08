---
sidebar_position: 2
custom_edit_url: null
---

# Binary Operators

The package also provides a set of binary operators that can be used to combine the evaluation of different features. The operators are:

- `and`: Returns `true` if the features are evaluated to `true`.
- `or`: Returns `true` if at least one of the features is evaluated to `true`.
- `iff`: Returns `true` if the features' evaluation is the same (in type and value).
- `implies`: Returns `true` if the logical implication between features is correct. Given two features: A and B, on which A implies B; if feature A is `true`, B must be. `false` will be returned if not.

The usage of the operators is as follows:

```javascript
<Feature>
    <On expression={and(feature("feature1"), feature("feature2"))}>
        <p>Feature 1 and feature 2 are enabled</p>
    </On>
    ...
</Feature>
```

```javascript
<Feature>
    <On expression={or(feature("feature1"), feature("feature2"))}>
        <p>Feature 1 or feature 2 are enabled</p>
    </On>
    ...
</Feature>
```

```javascript
<Feature>
    <On expression={iff(feature("feature1"), feature("feature2"))}>
        <p>Feature 1 has the same evaluation as feature 2</p>
    </On>
    ...
</Feature>
```

```javascript
<Feature>
    <On expression={implies(feature("feature1"), feature("feature2"))}>
        <p>Because Feature 1 is enabled, feature 2 must be</p>
    </On>
    ...
</Feature>
```