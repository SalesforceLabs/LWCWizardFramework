/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
@isTest
private class WizardControllerTest {
  @isTest
  public static void testActiveDraft() {
    // create a incomplete draft. Then verify that the draft is correctly being returned from getActiveWizardDraft()
    WizardDraft__c expected = new WizardDraft__c(
      Name = 'awizard',
      Completed__c = false
    );
    insert expected;
    WizardDraft__c actual = WizardController.getActiveWizardDraft('awizard');
    System.assert(actual.Id == expected.Id);

    // Now update the draft to complete. Then verify that getActiveWizardDraft() returns a emoty record
    expected.Completed__c = true;
    update expected;
    actual = WizardController.getActiveWizardDraft('awizard');
    System.assert(actual.Id == null);
  }

  @isTest
  public static void testDraftById() {
    // create couple of records. Then verify that the correct record is returned from getWizardDraft()
    WizardDraft__c record1 = new WizardDraft__c(Name = 'bwizard');
    insert record1;

    WizardDraft__c expected = new WizardDraft__c(Name = 'bwizard');
    insert expected;

    WizardDraft__c actual = WizardController.getWizardDraft(expected.Id);
    System.assert(actual.Id == expected.Id);
    System.assert(actual.Name == expected.Name);
  }
}
