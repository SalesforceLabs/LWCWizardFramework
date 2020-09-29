/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import { LightningElement, api, wire } from "lwc";
import getWizardDraft from "@salesforce/apex/WizardController.getWizardDraft";

const _NAME_FIELD_NAME = "Name";

export default class LwcWizardRunner extends LightningElement {
  @api recordid; // current draft record id. We use this to find out which wizard component to open and initialize

  _wizardname;
  _draftfound = false;

  @wire(getWizardDraft, { id: "$recordid" })
  wiredDraftData(draftData) {
    if (draftData.data) {
      this._wizardname = draftData.data[_NAME_FIELD_NAME];
      this._draftfound = true;
    }
  }

  get isCensusWizard() {
    return this._wizardname === "censusWizard";
  }

  get isLoanApplicationWizard() {
    return this._wizardname === "loanApplicationWizard";
  }

  get isLoanApplicationSingleWizard() {
    return this._wizardname === "loanApplicationWizardSingle";
  }
}
