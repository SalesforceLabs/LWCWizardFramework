/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import { LightningElement, api, wire } from "lwc";
import { createRecord } from "lightning/uiRecordApi";
import { updateRecord } from "lightning/uiRecordApi";
import getActiveWizardDraft from "@salesforce/apex/WizardController.getActiveWizardDraft";
import getWizardDraft from "@salesforce/apex/WizardController.getWizardDraft";

import {
  DEV_ERROR_DUPLICATE_PAGES,
  DEV_ERROR_NO_START_PAGE
} from "c/lwcWizardDevErrors";

const _NAME_FIELD_NAME = "Name";
const _DRAFT_FIELD_NAME = "Draft__c";
const _COMPLETED_FIELD_NAME = "Completed__c";
const _ID_FIELD_NAME = "Id";
const _DRAFT_TABLE_NAME = "WizardDraft__c";

export default class LwcWizard extends LightningElement {
  @api name; // name of this wizard, to be used to save in a draft

  @api usedraft = false;
  _draftLoaded = false;
  _draftId;
  @api draftid;

  @api setpageborder = false; //set a border for each page

  @api showallpages = false; // enable this to show a single page wizard
  // by default draft is saved on page transition. This will start saving draft on any change detection. This can be used with single page wizards
  @api savedraftonchange = false;

  _wizardPagesArray = [];
  _wizardPagesMap = {};
  _currentActivePageIndex = 0;
  _indexStack = new Array();

  _initialized = false;

  connectedCallback() {}

  disconnectedCallback() {}

  renderedCallback() {
    if (!this._initialized) {
      this._initialized = true;

      let wizardPages = this.querySelectorAll("c-lwc-wizard-page");
      this._wizardPagesArray = [...wizardPages];
      if (this._wizardPagesArray.length === 0) {
        return;
      }

      // Create a map of wizard pagenames to index
      this._wizardPagesArray.forEach((e, index) => {
        if (e.pagename) {
          if (this._wizardPagesMap[e.pagename] !== undefined) {
            throw new Error(
              DEV_ERROR_DUPLICATE_PAGES.replace("%s", e.pagename)
            );
          }
          this._wizardPagesMap[e.pagename] = index;
        } else {
          e.pagename = index;
        }
        if (this.setpageborder) {
          e.hasborder = true;
        }
      });

      // Make sure there is a start page specified
      let startPage = this._wizardPagesArray.find((e) => e.isstartpage);
      if (!startPage) {
        throw new Error(DEV_ERROR_NO_START_PAGE);
      }
      this.initializeAndActivateFirstPage(null);
    }
  }

  @api
  get currentPageDate() {
    return this._wizardPagesArray[this._currentActivePageIndex].pageData;
  }

  @api
  get allPagesData() {
    let wizardData = {};
    this._wizardPagesArray.forEach((element) => {
      let changedData = element.pageData;
      wizardData[changedData.name] = Object.assign({}, changedData.data);
    });
    return wizardData;
  }

  /**
   * Moves to the next page sequentially
   */
  @api
  switchToNextPage() {
    let isPageValid = this.currentActivePage().validatePage();
    if (!isPageValid) {
      return;
    }
    this._indexStack.push(this._currentActivePageIndex);
    this.currentActivePage().isvisible = false;
    this._currentActivePageIndex++;
    this.currentActivePage().isvisible = true;
    this.saveDraft(this.currentActivePage().isterminalpage);
  }

  @api
  switchToPage(pageName) {
    let isPageValid = this.currentActivePage().validatePage();
    if (!isPageValid) {
      return;
    }
    this._indexStack.push(this._currentActivePageIndex);
    this.currentActivePage().toggle();
    let index = this._wizardPagesMap[pageName];
    this._currentActivePageIndex = index;
    this.currentActivePage().toggle();
    this.saveDraft(this.currentActivePage().isterminalpage);
  }

  @api
  switchBack() {
    this.currentActivePage().isvisible = false;
    let previousIndex = this._indexStack.pop();
    this._currentActivePageIndex = previousIndex;
    this.currentActivePage().isvisible = true;
  }

  @api
  currentActivePage() {
    return this._wizardPagesArray[this._currentActivePageIndex];
  }

  initializeAndActivateFirstPage(draftData) {
    if (!this._initialized) {
      return;
    }

    // if draft is enabled, wait for draft to load
    if (this.usedraft && !this._draftLoaded) {
      return;
    }

    if (draftData) {
      // If there's no ID, that means the apex controller did not find any draft.
      if (draftData.Id) {
        this._draftId = draftData.Id;
        let draft = JSON.parse(draftData[_DRAFT_FIELD_NAME]);
        this.dispatchEvent(
          new CustomEvent("draftloaded", {
            detail: draft
          })
        );
      }
    }
    let startPage = this._wizardPagesArray.find((e) => e.isstartpage);
    startPage.isvisible = true;

    if (this.showallpages) {
      // show all pages except for terminal pages (which are pages that are shown after a wizard completes)
      this._wizardPagesArray.forEach((e) => {
        if (!e.isterminalpage) {
          e.isvisible = true;
        }
      });
    }
  }

  @wire(getActiveWizardDraft, { wizardName: "$name" })
  wiredDraftData(draftData) {
    // if a draftid is available, we load by draftid and wiredDraftDataId() will be notified . Ignore load by wizardName
    if (this.draftid) {
      return;
    }
    if (draftData.data) {
      this._draftLoaded = true;
      this.initializeAndActivateFirstPage(draftData.data);
    } else {
      //some error happened loading the saved draft. Just restart from scratch
      this._draftLoaded = true;
      this.initializeAndActivateFirstPage(null);
    }
  }

  @wire(getWizardDraft, { id: "$draftid" })
  wiredDraftDataId(draftData) {
    if (draftData.data) {
      this._draftLoaded = true;
      this.initializeAndActivateFirstPage(draftData.data);
    } else {
      //some error happened loading the saved draft. Just restart from scratch
      this._draftLoaded = true;
      this.initializeAndActivateFirstPage(null);
    }
  }

  /**
   * This is used to save the current wizard data in to a draft object.
   * It is automatically called on page transitions like moveing to next page
   */
  saveDraft(markCompleted) {
    if (!this.usedraft) {
      return;
    }
    const fields = {};
    fields[_NAME_FIELD_NAME] = this.name;
    fields[_DRAFT_FIELD_NAME] = JSON.stringify(this.allPagesData);
    fields[_COMPLETED_FIELD_NAME] = markCompleted ? true : false;

    if (!this._draftId) {
      const recordInput = { apiName: _DRAFT_TABLE_NAME, fields };
      createRecord(recordInput)
        .then((draftObject) => {
          this._draftId = draftObject.id;
        })
        .catch((error) => {
          this.dispatchEvent(
            new CustomEvent("draftsaveerror", {
              detail: error.body
            })
          );
        });
    } else {
      fields[_ID_FIELD_NAME] = this._draftId;
      const recordInput = { fields };
      updateRecord(recordInput)
        .then(() => {})
        .catch((error) => {
          this.dispatchEvent(
            new CustomEvent("draftsaveerror", {
              detail: error.body
            })
          );
        });
    }
  }

  handleOnChange() {
    if (this.usedraft && this.savedraftonchange) {
      this.saveDraft(false);
    }
  }
}
