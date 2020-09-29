/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
global with sharing class WizardController {
  @AuraEnabled(cacheable=true)
  public static WizardDraft__c getActiveWizardDraft(String wizardName) {
    String userId = UserInfo.getUserId();
    WizardDraft__c[] objects = [
      SELECT Id, Draft__c
      FROM WizardDraft__c
      WHERE Name = :wizardName AND OwnerId = :userId AND Completed__c = FALSE
      ORDER BY lastModifiedDate DESC
      LIMIT 1
    ];
    return objects.size() > 0 ? objects[0] : new WizardDraft__c();
  }

  @AuraEnabled(cacheable=true)
  public static WizardDraft__c getWizardDraft(String id) {
    String userId = UserInfo.getUserId();
    WizardDraft__c[] objects = [
      SELECT Id, Name, Draft__c
      FROM WizardDraft__c
      WHERE Id = :id
      ORDER BY lastModifiedDate DESC
      LIMIT 1
    ];

    return objects.size() > 0 ? objects[0] : new WizardDraft__c();
  }
}
