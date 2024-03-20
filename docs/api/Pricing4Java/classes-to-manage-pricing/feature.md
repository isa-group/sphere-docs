---
sidebar_position: 2
---

# Feature

This abstract class models the information of a feature.

```java
public abstract class Feature implements Serializable {
    protected String name;
    protected String description;
    protected ValueType valueType;
    protected Object defaultValue;
    protected transient Object value;
    protected String expression;
    protected String serverExpression;

    // Getters and setters...

    // Extra methods
}
```

The class also contains a set of extra methods that can be used to prepare the object to be written inside a plan in the YAML file by removing the setting the value of all the attributes to `null`, except `value`. However, one of them can be useful: `featureAttributesMap`, as it returns a `Map<String,Object>` with the attributes of the feature and their values.

Each feature type supported by Yaml4SaaS is represented by a class that extends this abstract one. The following list shows the classes that extend Feature:

- **Information**
- **Integration**
- **Domain**
- **Automation**
- **Management**
- **Guarantee**
- **Support**
- **Payment**

Each of these objects contains the specific attributes of the feature type, such as `integrationType` in the **Integration** feature class, `automationType` in the **Automation** class, etc.