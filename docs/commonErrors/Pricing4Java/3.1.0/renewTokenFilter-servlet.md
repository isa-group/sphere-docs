---
custom_edit_url: null
---

# Error while adding the RenewTokenFilter

If after adding the filter to the pipeline you get an error indicating: `java.lang.ClassNotFoundException: javax.servlet.ServletResponse`, you may need to add the following dependency to your project:

```xml
<dependency>
    <groupId>javax.servlet</groupId>
    <artifactId>javax.servlet-api</artifactId>
    <version>3.0.1</version>
    <scope>provided</scope>
</dependency>
```

We are currently working on solving the issue and will update this documentation as soon as possible.