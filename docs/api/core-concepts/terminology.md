---
sidebar_position: 1
custom_edit_url: null
---

# 📚 Important Concepts

This section introduces the key concepts you’ll find throughout the documentation. Understanding these terms will help you follow the guides and examples more easily.

---

- **Managed Application**  
  The SaaS application that integrates SPACE (or another solution) to enable **pricing-driven self-adaptation**.  
  
  👉 Example: *PetClinic* is the managed application in our running example.

- **Service**  
  A distinct component or microservice within the managed application that interacts with the pricing-driven self-adaptation solution. 
  
  Each service can have its own pricing.

  👉 Example: In PetClinic, the **Authentication Microservice** and **Appointment Microservice** are separate services.

- **Feature**  
  Distinctive functionality or capability within the managed application whose presence or absence may guide a user’s decision toward a particular subscription. It can be enabled or disabled based on the user’s subscription. Features are defined in the pricing and may include usage limits.  

  👉 Example: "Vet Selection" or "Calendar Integration" in PetClinic.

- **Usage Limit**  
  A constraint that can be defined to further restrict to which extent a feature can be used. 
  
  Even if a feature is enabled, it might be limited in frequency, volume, or duration.

  👉 Example: "Up to 100 appointments per month".

- **Pricing**  
  A structure that organizes the features and usage limits of a service into **plans** and/or **add-ons** to control users' access to such features. Pricings are versioned, so changes over time (new features, updated limits) can be tracked.

  👉 Example:

  ![PetClinic Pricing](../../static/img/core-concepts/petclinic.png)

- **Plan**  
  A predefined "bundle" of features and usage limits within a pricing.

  👉 Example: *BASIC*, *GOLD* and *PLATINUM* in PetClinic.

- **Add-on**  
  An optional bundle of features that users can select in addition to their plan. **Add-ons provide flexibility** for users to customize their subscriptions based on their needs.

  👉 Example: "Pets Dashboard" in PetClinic. It can only be contracted if the user has selected the PLATINUM plan.

  They **can also be used to extend usage limits**:

  👉 Example: "Extra Pet" in PetClinic allows users to increase their maxPets usage limit by one unit.

- **Subscription**  
  Represents the choice of a user for a given plan and, optionally, a set of add-ons.
  It also conforms a core part of the contract between the customer and the provider.

- **Contract**  
  A formal agreement between a customer and the service provider that includes the selected subscription (plan + add-ons) and the user's acceptance of terms and conditions of service usage. 
  
  It is linked to a specific pricing version.

- **Configuration**  
  The **combination of features and usage limits** that results from a user’s subscription within a specific pricing version.

  This is what pricing-driven self-adaptation solutions enforce at runtime.

- **Usage Level**  
  The **current consumption** of a feature by a user.

  It is used in pricing-driven self-adaptation to determine if a user can still use a feature or if they have reached their usage limit.
  
  👉 Example: “User X has already used 85 of their 100 monthly predictions.”

- **Subscription State**  
  The complete **runtime state** of a subscription. It includes:  
  - Active subscription
  - Current values of usage levels  
