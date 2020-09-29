/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import { LightningElement, track, api } from "lwc";

export default class LoanApplicationWizardSingle extends LightningElement {
  _wizard;
  _initialized = false;

  @track _areButtonsVisible = true;

  // Pass in a draftId to load/update data from a draft instead of creating a new draft
  @api draftid;

  // Initialize the default data for this wizard
  _wizarddata = {
    personalDetails: {
      firstname: "",
      middlename: "",
      lastname: "",
      salutation: "",
      dob: ""
    },
    identity: { idType: "", id: "", dateOfIssue: "", expiryDate: "" },
    employmentDetails: {
      employerName: "",
      yrsworking: "",
      title: "",
      salary: ""
    },
    loanDetails: { loanAmount: "", maturity: "" },
    declarations: { signature: "", dateSigned: "" }
  };

  @track _error;

  get salutationOptions() {
    return [
      { label: "Mr.", value: "Mr." },
      { label: "Ms.", value: "Ms." },
      { label: "Mrs.", value: "Mrs." },
      { label: "Dr.", value: "Dr." },
      { label: "Prof.", value: "Prof." }
    ];
  }

  get idOptions() {
    return [
      { label: "Passport", value: "passport" },
      { label: "State Id", value: "stateId" },
      { label: "Driver's License", value: "dreiverLicense" }
    ];
  }

  renderedCallback() {
    if (!this._initialized) {
      this._initialized = true;
      this._wizard = this.template.querySelector("c-lwc-wizard");
      this.computeButtonVisibility();
    }
  }

  handleComplete() {
    this._wizard.switchToPage("completionMessage");
    this.computeButtonVisibility();
  }

  handleDraftSaveError(event) {
    this._error =
      "Error encountered while saving draft : " +
      event.detail +
      ". Please go back and try again";
    if (this._wizard.currentActivePage().isterminalpage) {
      this._wizard.switchBack();
    }
    this.computeButtonVisibility();
  }

  handleDraftLoaded(event) {
    let data = event.detail;
    this._wizarddata = data;
  }

  computeButtonVisibility() {
    let okButton = this.template.querySelector("lightning-button");
    let currentPage = this._wizard.currentActivePage();
    okButton.disabled = false;
    if (currentPage.isterminalpage) {
      this._areButtonsVisible = false;
    } else {
      this._areButtonsVisible = true;
    }
  }
}
