import { element, by, ElementFinder, ElementArrayFinder } from 'protractor';

import { waitUntilAnyDisplayed, waitUntilDisplayed, click, waitUntilHidden, isVisible } from '../../util/utils';

import NavBarPage from './../../page-objects/navbar-page';

import TaskUpdatePage from './task-update.page-object';

const expect = chai.expect;
export class TaskDeleteDialog {
  deleteModal = element(by.className('modal'));
  private dialogTitle: ElementFinder = element(by.id('employmentApp.task.delete.question'));
  private confirmButton = element(by.id('jhi-confirm-delete-task'));

  getDialogTitle() {
    return this.dialogTitle;
  }

  async clickOnConfirmButton() {
    await this.confirmButton.click();
  }
}

export default class TaskComponentsPage {
  createButton: ElementFinder = element(by.id('jh-create-entity'));
  deleteButtons = element.all(by.css('div table .btn-danger'));
  title: ElementFinder = element(by.id('task-heading'));
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
    await navBarPage.getEntityPage('task');
    await waitUntilAnyDisplayed([this.noRecords, this.table]);
    return this;
  }

  async goToCreateTask() {
    await this.createButton.click();
    return new TaskUpdatePage();
  }

  async deleteTask() {
    const deleteButton = this.getDeleteButton(this.records.last());
    await click(deleteButton);

    const taskDeleteDialog = new TaskDeleteDialog();
    await waitUntilDisplayed(taskDeleteDialog.deleteModal);
    expect(await taskDeleteDialog.getDialogTitle().getAttribute('id')).to.match(/employmentApp.task.delete.question/);
    await taskDeleteDialog.clickOnConfirmButton();

    await waitUntilHidden(taskDeleteDialog.deleteModal);

    expect(await isVisible(taskDeleteDialog.deleteModal)).to.be.false;
  }
}
