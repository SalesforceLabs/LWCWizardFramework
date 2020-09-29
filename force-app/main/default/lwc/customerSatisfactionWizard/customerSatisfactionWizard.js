/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import { LightningElement, track } from "lwc";

export default class CustomerSatisfactionWizard extends LightningElement {
  _wizard;
  _initialized = false;
  @track _areButtonsVisible = true;

  @track _error;

  get recommendOptions() {
    let values = new Array();
    for (let i = 0; i <= 10; i++) {
      values.push({ value: i, label: i });
    }
    return values;
  }

  get satisfactionOptions() {
    return [
      { value: "5", label: "Very satisfied" },
      { value: "4", label: "Somewhat satisfied" },
      { value: "3", label: "Neither satisfied not dissatisfied" },
      { value: "2", label: "Somewhat dissatisfied" },
      { value: "1", label: "Very dissatisfied" }
    ];
  }

  get reliabilityOptions() {
    return [
      { value: "reliable", label: "Reliable" },
      { value: "highQuality", label: "High Quality" },
      { value: "useful", label: "Useful" },
      { value: "unique", label: "Unique" },
      { value: "valueForMoney", label: "Good value for money" },
      { value: "overpriced", label: "Overpriced" }
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

  handleNext() {
    this._wizard.switchToNextPage();
    this.computeButtonVisibility();
  }

  handleComplete() {
    this._wizard.switchToNextPage();
    this.computeButtonVisibility();
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
