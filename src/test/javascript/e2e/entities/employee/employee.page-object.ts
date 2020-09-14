import { element, by, ElementFinder, ElementArrayFinder } from 'protractor';

import { waitUntilAnyDisplayed, waitUntilDisplayed, click, waitUntilHidden, isVisible } from '../../util/utils';

import NavBarPage from './../../page-objects/navbar-page';

import EmployeeUpdatePage from './employee-update.page-object';

const expect = chai.expect;
export class EmployeeDeleteDialog {
  deleteModal = element(by.className('modal'));
  private dialogTitle: ElementFinder = element(by.id('employmentApp.employee.delete.question'));
  private confirmButton = element(by.id('jhi-confirm-delete-employee'));

  getDialogTitle() {
    return this.dialogTitle;
  }

  async clickOnConfirmButton() {
    await this.confirmButton.click();
  }
}

export default class EmployeeComponentsPage {
  createButton: ElementFinder = element(by.id('jh-create-entity'));
  deleteButtons = element.all(by.css('div table .btn-danger'));
  title: ElementFinder = element(by.id('employee-heading'));
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
    await navBarPage.getEntityPage('employee');
    await waitUntilAnyDisplayed([this.noRecords, this.table]);
    return this;
  }

  async goToCreateEmployee() {
    await this.createButton.click();
    return new EmployeeUpdatePage();
  }

  async deleteEmployee() {
    const deleteButton = this.getDeleteButton(this.records.last());
    await click(deleteButton);

    const employeeDeleteDialog = new EmployeeDeleteDialog();
    await waitUntilDisplayed(employeeDeleteDialog.deleteModal);
    expect(await employeeDeleteDialog.getDialogTitle().getAttribute('id')).to.match(/employmentApp.employee.delete.question/);
    await employeeDeleteDialog.clickOnConfirmButton();

    await waitUntilHidden(employeeDeleteDialog.deleteModal);

    expect(await isVisible(employeeDeleteDialog.deleteModal)).to.be.false;
  }
}
