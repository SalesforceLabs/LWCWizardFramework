/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import { LightningElement, api } from "lwc";

const _SUPPORTED_LIGHTNING_INPUTS =
  "lightning-radio-group,lightning-checkbox-group,lightning-combobox,lightning-textarea,lightning-input-name,lightning-input-address,lightning-input";

export default class LwcWizardPage extends LightningElement {
  @api pagename;

  @api isstartpage = false;

  @api issubmitpage = false;

  @api isterminalpage = false;

  @api isvisible = false;

  @api hasborder = false;

  _pageData = {};

  @api
  toggle() {
    this.isvisible = !this.isvisible;
  }

  @api
  validatePage() {
    let isPageValid = true;
    let inputElements = this.querySelectorAll(_SUPPORTED_LIGHTNING_INPUTS);
    inputElements = [...inputElements];
    for (let i = 0; i < inputElements.length; i++) {
      let element = inputElements[i];
      isPageValid = element.reportValidity();
      if (!isPageValid) {
        break;
      }
    }
    return isPageValid;
  }

  @api
  get pageData() {
    let result = {};
    result.name = this.pagename;
    result.data = this._pageData;
    let inputElements = this.querySelectorAll(_SUPPORTED_LIGHTNING_INPUTS);
    inputElements = [...inputElements];
    inputElements.forEach((element) => {
      switch (element.localName) {
        case "lightning-input-address":
          result.data.country = element.country;
          result.data.state = element.state;
          result.data.city = element.city;
          result.data.postalCode = element.postalCode;
          result.data.province = element.province;
          result.data.street = element.street;
          break;
        case "lightning-input":
          switch (element.type) {
            case "checkbox":
              result.data[element.name] = element.checked;
              break;
            default:
              result.data[element.name] = element.value;
              break;
          }
          break;
        case "lightning-input-name":
          result.data.firstname = element.firstName;
          result.data.lastname = element.lastName;
          result.data.middlename = element.middleName;
          result.data.salutation = element.salutation;
          break;
        default:
          result.data[element.name] = element.value;
          break;
      }
    });
    return result;
  }

  /** This is used in the template to hide the page */
  get displayStyle() {
    return this.isvisible ? "" : "display:none;";
  }

  get borderClass() {
    return this.hasborder ? "customBorder" : "";
  }
}
