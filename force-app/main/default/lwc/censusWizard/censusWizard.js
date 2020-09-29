/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import { LightningElement, track, api } from "lwc";

export default class CensusWizard extends LightningElement {
  _wizard;
  _initialized = false;

  @track _areButtonsVisible = true;

  // Pass in a draftId to load/update data from a draft instead of creating a new draft
  @api draftid;

  // Initialize the default data for this wizard
  _wizarddata = {
    locationPage: { stateLived: "usStateOrDc" },
    addressPage: {
      street: "",
      province: "",
      country: "",
      postalCode: "",
      noAddress: ""
    },
    hasRuralAddressPage: { hasRuralAddress: "" },
    closestAddress: {
      street: "",
      province: "",
      country: "",
      postalCode: "",
      noAddress: ""
    },
    wasHomeLessPage: { isHomeless: "" }
  };

  @track _error;

  get livingOptions() {
    return [
      {
        value: "usStateOrDc",
        label: "A U.S. state or the District of Columbia"
      },
      { value: "puertoRico", label: "Puerto Rico" },
      { value: "someWhereElse", label: "Somewhere else" }
    ];
  }

  renderedCallback() {
    if (!this._initialized) {
      this._initialized = true;
      this._wizard = this.template.querySelector("c-lwc-wizard");
      this.computeButtonVisibility();
    }
  }

  handlePrevious() {
    this._error = "";
    this._wizard.switchBack();
    this.computeButtonVisibility();
  }

  /**
   * Demonstrates branching to different wizard pages based on conditions
   */
  handleNext() {
    this._error = "";
    let pageData = this._wizard.currentPageDate;
    switch (pageData.name) {
      case "locationPage":
        switch (pageData.data.stateLived) {
          case "someWhereElse":
            this._wizard.switchToPage("somewhereElseMessage");
            break;
          default:
            this._wizard.switchToPage("addressPage");
            break;
        }
        break;
      case "addressPage":
        if (pageData.data.noAddress) {
          this._wizard.switchToPage("hasRuralAddressPage");
        } else {
          this._wizard.switchToPage("finalPage");
        }
        break;
      case "hasRuralAddressPage":
        if (pageData.data.hasRuralAddress) {
          this._wizard.switchToPage("closestAddress");
        } else {
          this._wizard.switchToPage("wasHomeLessPage");
        }
        break;
      case "closestAddress":
        this._wizard.switchToPage("finalPage");
        break;
      default:
        this._wizard.switchToPage("finalPage");
        break;
    }
    this.computeButtonVisibility();
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
    let buttons = this.template.querySelectorAll("lightning-button");
    let prevButton = buttons[0];
    let nextButton = buttons[1];
    let okButton = buttons[2];
    let currentPage = this._wizard.currentActivePage();

    if (currentPage.isstartpage) {
      prevButton.disabled = true;
      nextButton.disabled = false;
      okButton.disabled = true;
    } else {
      prevButton.disabled = false;
      nextButton.disabled = false;
      okButton.disabled = true;
    }
    if (currentPage.issubmitpage) {
      prevButton.disabled = false;
      nextButton.disabled = true;
      okButton.disabled = false;
    }
    if (currentPage.isterminalpage) {
      this._areButtonsVisible = false;
    } else {
      this._areButtonsVisible = true;
    }
  }
}
