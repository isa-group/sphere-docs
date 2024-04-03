---
sidebar_position: 7
custom_edit_url: null
---

# PricingPlanAware

The library also provides an method level annotation called `@PricingPlanAware` that receives a string called `featureId` as paramater. This feature must exist inside the pricing configuration.
By combining the use of this annotation with the spring's `@Transactional`, it is possible to automate feature checking on the service layer of the application.

The annotation performs an evaluation of the feature right after the method is executed. If the evaluation determines that the pricing plan is not being respected, a PricingPlanEvaluationException is thrown, so all the changes made are removed by the `@Transactional` annotation rollback. On the other hand, if the evaluation is correct, the changes are commited and the method returns normally.

The following snippet is an example of the use of this annotation inside a demo app service:

```java
// ...

@PricingPlanAware(featureId = "maxPets")
@Transactional(rollbackFor = { DuplicatedPetNameException.class, PricingPlanEvaluationException.class })
public Pet savePet(Pet pet) throws DataAccessException, DuplicatedPetNameException {
  Pet otherPet = getPetWithNameAndIdDifferent(pet);
  if (otherPet != null && !otherPet.getId().equals(pet.getId())) {
    throw new DuplicatedPetNameException();
  } else
    petRepository.save(pet);



  return pet;
}

// ...
```