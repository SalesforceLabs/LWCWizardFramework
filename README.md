# LWCWizardFramework

This framework provides an easy way to create wizards and configure it with wizard pages. You can use the apis exposed on the wizard component to navigate b/w wizard pages (sequentially or to specific named pages based on conditions), validation for the pages, saving of intermediate wizard state and loading the wizard from a saved state.

The framework utilizes the full power of lightning-input-* components to take care of validation of the lightning-input components automatically on any changes to the input.

The framework allows for creation of single page or multi-page wizards, automatic saving of wizard state in a custom object any time a input in the wizazrd is changed, and reloading the wizard from a previous saved state/

To get started:

The main meat of the framework is provided by lwcWizard and lwcWizardPage.
To understand how it works, check out some of the wizards implemented using this framework:

CensusWizard - Simulates a multi-page census wizard
CustomerSatisfactionWizard - Simulates a multi-page customer satisfaction wizard
LoanApplicationWizard - Simulates a multi-page loan application wizard
LoanApplicationWizardSingle - Simulates a single-page loan application wizard, each page showing up as a section in the same wizard
