---
custom_edit_url: null
---

# Error while adding the RenewTokenFilter

If after adding the filter to the pipeline you get an error indicating: `java.lang.ClassNotFoundException: javax.servlet.ServletResponse`, it may be caused because you are using a the version 6 of the Spring Framework, which replaces javax beans by jakarta's. Just **update to Pricing4Java 3.2.0 or higher** to solve this issue 😊.