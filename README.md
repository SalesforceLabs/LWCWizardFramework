# LWCWizardFramework

This framework provides an easy way to create wizards and configure it with wizard pages. You can use the apis exposed on the wizard component to navigate b/w wizard pages (sequentially or to specific named pages based on conditions), validation for the pages, saving of intermediate wizard state and loading the wizard from a saved state.

The framework utilizes the full power of lightning-input-* components to take care of validation of the lightning-input components automatically on any changes to the input.

The framework allows for creation of single page or multi-page wizards, automatic saving of wizard state in a custom object any time a input in the wizazrd is changed, and reloading the wizard from a previous saved state/

## TO GET STARTED

The main part of the framework is provided by 2 LWC components : *lwcWizard (c-lwc-wizard)* and *lwcWizardPage (c-lwc-wizard-page)*.
The *lwcWizard* component has slots in it in to which you would pass in your customized *lwcWizardPages*.

# Example :

```html
<template>
  <c-lwc-wizard
    name="censusWizard"
    usedraft="true"
    ondraftsaveerror={handleDraftSaveError}
    ondraftloaded={handleDraftLoaded}
  >
    <div slot="wizardPages"> <!-- Setting the "wizardPages" slot of c-lwc-wizard with 2 c-lwc-wizard-page's -->
      <!-- First page of the wizard named "locationPage"-->
      <c-lwc-wizard-page pagename="locationPage" isstartpage="true">
        <div class="pageClass" slot="wizardPageContent">
          <div class="slds-text-heading_medium">
            <p>
              In order to collect your address, we first need to know where
              you will be living on April 1, 2020.
            </p>
            <p>Please select where you will be living on April 1, 2020.</p>
          </div>
          <div class="slds-form--inline">
            <div class="slds-form-element">
              <lightning-radio-group
                name="stateLived"
                options={livingOptions}
                value={_wizarddata.locationPage.stateLived}
                type="radio"
                class=""
              ></lightning-radio-group>
            </div>
          </div>
        </div>
      </c-lwc-wizard-page>
      <!-- Second page of the wizard "addressPage" -->
      <c-lwc-wizard-page pagename="addressPage">
        <div class="pageClass" slot="wizardPageContent">
          <div class="slds-text-heading_medium">
            <p>Where were you living on April 1, 2020 ?</p>
            <p>
              Please provide a complete street address for your residence.
              Provide the street address you would use to have a package
              delivered directly to your residence, not a rural route or
              P.O. Box address used for mailing purposes. A street address
              is the most helpful for processing your response.
            </p>
          </div>
          <div>
            <lightning-input-address
              street-label="Street"
              city-label="City"
              country-label="Country"
              province-label="State"
              postal-code-label="PostalCode"
              street={_wizarddata.addressPage.street}
              province={_wizarddata.addressPage.province}
              city={_wizarddata.addressPage.city}
              country={_wizarddata.addressPage.country}
              postal-code={_wizarddata.addressPage.postalCode}
            >
            </lightning-input-address>   
          </div>
        </div>
      </c-lwc-wizard-page>
```

Once you define your wizard and wizard pages as above, the framework does the following 3 things for you :

* When the wizard is rendered, it automatically hides all the wizard pages and shows the one that has **isstartpage=true**
* It provides a *switchToPage(pageName)* api : So your wizard ca listen for button clicks and switch to a named page in the wizard. The framework tracks care of hiding the current page, navigating to the new page
* It provides a *switchBack()* api : When user clicks back the "Previous" button, your wizard can call this api to go back to the previous page. The wizard framework automatically keeps track of visited pages and maintains a history.
* When user navigates between wizard pages, the framework automatically saves the state of the page as a json objectin a custom object named WizardDraft__c. Currently the framework saves the state of the whole wizard in a single field as a json object. But you can customize the save behavior
* The framework provides the capability to start the wizard from a saved draft. It can do this because it saves the draft per user. So if the wizard is restarted by a user it can get the last state that the wizard was in from the WizardDraft__c object and reinitialize the wizard


To understand how some of the framework apis that are exposed and how to use it, check out the example wizards implemented using this framework

CensusWizard - Simulates a multi-page census wizard
CustomerSatisfactionWizard - Simulates a multi-page customer satisfaction wizard
LoanApplicationWizard - Simulates a multi-page loan application wizard
LoanApplicationWizardSingle - Simulates a single-page loan application wizard, each page showing up as a section in the same wizard


### **NOTE** 

You can see a demo of all the features here : [LWC Wizard Framework](https://www.youtube.com/watch?v=h0J7SJ1QGwQ).
A salesforce package with all of the wizards shown in the demo is available here : [Salesforce App Exchange Listing](https://appexchange.salesforce.com/appxListingDetail?listingId=a0N3A00000GCk7RUAT).
