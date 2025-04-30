---
sidebar_position: 4
custom_edit_url: null
---

# Class RenewTokenFilter

**Package** `io.github.isagroup.filters`

`public class RenewTokenFilter extends OncePerRequestFilter`

The `RenewTokenFilter` is a [org.springframework.web.filter.OncePerRequestFilter](https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/web/filter/OncePerRequestFilter.html) Spring filter that serves as the Feature Checker component of Pricing4SaaS. It filters incoming requests to determine which ones are consistent with the current pricing configuration, saving the server from unnecessary business logic execution.

In addition, the `RenewTokenFilter` is responsible for renewing the JWT everytime the feature evaluation context change. In those cases, the filter will add a new header to the response: `Pricing-Token`, which contains the new JWT. This header must be processed by the client to update the token in the local storage.

:::warning

If you have Cross-Origin Resource Sharing (CORS) within your application, remember to add the `Pricing-Token` header to the list of exposed headers. This will allow the client to access the new token.

To enable this option within your spring application, you can use the following application level configuration:

```java
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@SpringBootApplication(scanBasePackages = {
    "io.github.isagroup",
    "org.springframework.samples.myapplication"
})
public class MyApplication {
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**") // Will affect all paths
                    .allowedOrigins("*") // Will enable the access from any origin
                    .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS") // Methods to be allowed
                    .exposedHeaders("Pricing-Token"); // Expose the Pricing-Token header
            }
        };
    }
}
```

:::

## Usage

To leverage the functionality of the `RenewTokenFilter`, you must inject it within your Web Security Configuration class. The following snippet shows how to do this:

```java
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;


import io.github.isagroup.filters.RenewTokenFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfiguration {
    // Other configurations...

    @Bean
    public RenewTokenFilter renewJwtTokenFilter() {
        return new RenewTokenFilter();
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        // Path access configurations...
    }
}
```

## Result

After the `RenewTokenFilter` is injected into your Web Security Configuration class, it will be responsible for checking the JWT token in every request. This ensures that your frontend's feature evaluation context remains up to date with your backend's. If the context changes, the filter will renew the JWT and add it to the response header `Pricing-Token`.

Every JWT traferred through the `Pricing-Token` header has the following structure:

```json
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
    }
  },
  "sub": "testUser",
  "exp": 1687705951,
  "userContext": {
    // ...
  },
  "iat": 1687705864,
  "planContext": {
    // ...
  }
}
```
