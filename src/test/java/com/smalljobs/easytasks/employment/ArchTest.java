package com.smalljobs.easytasks.employment;

import com.tngtech.archunit.core.domain.JavaClasses;
import com.tngtech.archunit.core.importer.ClassFileImporter;
import com.tngtech.archunit.core.importer.ImportOption;
import org.junit.jupiter.api.Test;

import static com.tngtech.archunit.lang.syntax.ArchRuleDefinition.noClasses;

class ArchTest {

    @Test
    void servicesAndRepositoriesShouldNotDependOnWebLayer() {

        JavaClasses importedClasses = new ClassFileImporter()
            .withImportOption(ImportOption.Predefined.DO_NOT_INCLUDE_TESTS)
            .importPackages("com.smalljobs.easytasks.employment");

        noClasses()
            .that()
                .resideInAnyPackage("com.smalljobs.easytasks.employment.service..")
            .or()
                .resideInAnyPackage("com.smalljobs.easytasks.employment.repository..")
            .should().dependOnClassesThat()
                .resideInAnyPackage("..com.smalljobs.easytasks.employment.web..")
        .because("Services and repositories should not depend on web layer")
        .check(importedClasses);
    }
}
