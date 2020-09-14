import { element, by, ElementFinder, ElementArrayFinder } from 'protractor';

import { waitUntilAnyDisplayed, waitUntilDisplayed, click, waitUntilHidden, isVisible } from '../../util/utils';

import NavBarPage from './../../page-objects/navbar-page';

import JobUpdatePage from './job-update.page-object';

const expect = chai.expect;
export class JobDeleteDialog {
  deleteModal = element(by.className('modal'));
  private dialogTitle: ElementFinder = element(by.id('employmentApp.job.delete.question'));
  private confirmButton = element(by.id('jhi-confirm-delete-job'));

  getDialogTitle() {
    return this.dialogTitle;
  }

  async clickOnConfirmButton() {
    await this.confirmButton.click();
  }
}

export default class JobComponentsPage {
  createButton: ElementFinder = element(by.id('jh-create-entity'));
  deleteButtons = element.all(by.css('div table .btn-danger'));
  title: ElementFinder = element(by.id('job-heading'));
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
    await navBarPage.getEntityPage('job');
    await waitUntilAnyDisplayed([this.noRecords, this.table]);
    return this;
  }

  async goToCreateJob() {
    await this.createButton.click();
    return new JobUpdatePage();
  }

  async deleteJob() {
    const deleteButton = this.getDeleteButton(this.records.last());
    await click(deleteButton);

    const jobDeleteDialog = new JobDeleteDialog();
    await waitUntilDisplayed(jobDeleteDialog.deleteModal);
    expect(await jobDeleteDialog.getDialogTitle().getAttribute('id')).to.match(/employmentApp.job.delete.question/);
    await jobDeleteDialog.clickOnConfirmButton();

    await waitUntilHidden(jobDeleteDialog.deleteModal);

    expect(await isVisible(jobDeleteDialog.deleteModal)).to.be.false;
  }
}
