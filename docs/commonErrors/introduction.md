---
sidebar_position: 1
custom_edit_url: null
---

# Introduction

This section provides some solutions to common errors that occur while working with the Pricing4SaaS suite within a SaaS. For now, there are not known errors in the versions of the libraries supported by this documentation. If you are facing any issues, please refer to either [Pricing4Java](https://github.com/isa-group/Pricing4Java) or [Pricing4React](https://github.com/isa-group/Pricing4React) GitHub repository.

## How do I express an unlimited amount in usage limits?

In yaml you can use the keywork `.inf` of the [YAML specification](https://yaml.org/type/float.html) to express an unlimited amount of something. See Canonical and Examples section to see the usage and the syntax definition.

This keyword is very usefull in Pricing2Yaml specification if you want to model an usage limit that in some tier
of your plan is _Unlimited_.

Example:

```yaml
usageLimits:
  todoNotesLimit:
    valueType: NUMERIC
    defaultValue: 10
plans:
  FREE:
    usageLimits: null
  STANDARD:
    usageLimits:
      todoNotesLimit: .inf
```
