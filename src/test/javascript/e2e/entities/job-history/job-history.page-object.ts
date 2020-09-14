import { element, by, ElementFinder, ElementArrayFinder } from 'protractor';

import { waitUntilAnyDisplayed, waitUntilDisplayed, click, waitUntilHidden, isVisible } from '../../util/utils';

import NavBarPage from './../../page-objects/navbar-page';

import JobHistoryUpdatePage from './job-history-update.page-object';

const expect = chai.expect;
export class JobHistoryDeleteDialog {
  deleteModal = element(by.className('modal'));
  private dialogTitle: ElementFinder = element(by.id('employmentApp.jobHistory.delete.question'));
  private confirmButton = element(by.id('jhi-confirm-delete-jobHistory'));

  getDialogTitle() {
    return this.dialogTitle;
  }

  async clickOnConfirmButton() {
    await this.confirmButton.click();
  }
}

export default class JobHistoryComponentsPage {
  createButton: ElementFinder = element(by.id('jh-create-entity'));
  deleteButtons = element.all(by.css('div table .btn-danger'));
  title: ElementFinder = element(by.id('job-history-heading'));
  noRecords: ElementFinder = element(by.css('#app-view-container .table-responsive div.alert.alert-warning'));
  table: ElementFinder = element(by.css('#app-view-container div.table-responsive > table'));

  records: ElementArrayFinder = this.table.all(by.css('tbody tr'));

  getDetailsButton(record: ElementFinder) {
    return record.element(by.css('a.btn.btn-info.btn-sm'));
  }

  getEditButton(record: ElementFinder) {
    return record.element(by.css('a.btn.btn-primary.btn-sm'));
  }

  getDeleteButton(record: ElementFinder) {
    return record.element(by.css('a.btn.btn-danger.btn-sm'));
  }

  async goToPage(navBarPage: NavBarPage) {
    await navBarPage.getEntityPage('job-history');
    await waitUntilAnyDisplayed([this.noRecords, this.table]);
    return this;
  }

  async goToCreateJobHistory() {
    await this.createButton.click();
    return new JobHistoryUpdatePage();
  }

  async deleteJobHistory() {
    const deleteButton = this.getDeleteButton(this.records.last());
    await click(deleteButton);

    const jobHistoryDeleteDialog = new JobHistoryDeleteDialog();
    await waitUntilDisplayed(jobHistoryDeleteDialog.deleteModal);
    expect(await jobHistoryDeleteDialog.getDialogTitle().getAttribute('id')).to.match(/employmentApp.jobHistory.delete.question/);
    await jobHistoryDeleteDialog.clickOnConfirmButton();

    await waitUntilHidden(jobHistoryDeleteDialog.deleteModal);

    expect(await isVisible(jobHistoryDeleteDialog.deleteModal)).to.be.false;
  }
}
