import { element, by, ElementFinder, ElementArrayFinder } from 'protractor';

import { waitUntilAnyDisplayed, waitUntilDisplayed, click, waitUntilHidden, isVisible } from '../../util/utils';

import NavBarPage from './../../page-objects/navbar-page';

import DepartmentUpdatePage from './department-update.page-object';

const expect = chai.expect;
export class DepartmentDeleteDialog {
  deleteModal = element(by.className('modal'));
  private dialogTitle: ElementFinder = element(by.id('employmentApp.department.delete.question'));
  private confirmButton = element(by.id('jhi-confirm-delete-department'));

  getDialogTitle() {
    return this.dialogTitle;
  }

  async clickOnConfirmButton() {
    await this.confirmButton.click();
  }
}

export default class DepartmentComponentsPage {
  createButton: ElementFinder = element(by.id('jh-create-entity'));
  deleteButtons = element.all(by.css('div table .btn-danger'));
  title: ElementFinder = element(by.id('department-heading'));
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
    await navBarPage.getEntityPage('department');
    await waitUntilAnyDisplayed([this.noRecords, this.table]);
    return this;
  }

  async goToCreateDepartment() {
    await this.createButton.click();
    return new DepartmentUpdatePage();
  }

  async deleteDepartment() {
    const deleteButton = this.getDeleteButton(this.records.last());
    await click(deleteButton);

    const departmentDeleteDialog = new DepartmentDeleteDialog();
    await waitUntilDisplayed(departmentDeleteDialog.deleteModal);
    expect(await departmentDeleteDialog.getDialogTitle().getAttribute('id')).to.match(/employmentApp.department.delete.question/);
    await departmentDeleteDialog.clickOnConfirmButton();

    await waitUntilHidden(departmentDeleteDialog.deleteModal);

    expect(await isVisible(departmentDeleteDialog.deleteModal)).to.be.false;
  }
}
