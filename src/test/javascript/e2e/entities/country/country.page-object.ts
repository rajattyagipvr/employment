import { element, by, ElementFinder, ElementArrayFinder } from 'protractor';

import { waitUntilAnyDisplayed, waitUntilDisplayed, click, waitUntilHidden, isVisible } from '../../util/utils';

import NavBarPage from './../../page-objects/navbar-page';

import CountryUpdatePage from './country-update.page-object';

const expect = chai.expect;
export class CountryDeleteDialog {
  deleteModal = element(by.className('modal'));
  private dialogTitle: ElementFinder = element(by.id('employmentApp.country.delete.question'));
  private confirmButton = element(by.id('jhi-confirm-delete-country'));

  getDialogTitle() {
    return this.dialogTitle;
  }

  async clickOnConfirmButton() {
    await this.confirmButton.click();
  }
}

export default class CountryComponentsPage {
  createButton: ElementFinder = element(by.id('jh-create-entity'));
  deleteButtons = element.all(by.css('div table .btn-danger'));
  title: ElementFinder = element(by.id('country-heading'));
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
    await navBarPage.getEntityPage('country');
    await waitUntilAnyDisplayed([this.noRecords, this.table]);
    return this;
  }

  async goToCreateCountry() {
    await this.createButton.click();
    return new CountryUpdatePage();
  }

  async deleteCountry() {
    const deleteButton = this.getDeleteButton(this.records.last());
    await click(deleteButton);

    const countryDeleteDialog = new CountryDeleteDialog();
    await waitUntilDisplayed(countryDeleteDialog.deleteModal);
    expect(await countryDeleteDialog.getDialogTitle().getAttribute('id')).to.match(/employmentApp.country.delete.question/);
    await countryDeleteDialog.clickOnConfirmButton();

    await waitUntilHidden(countryDeleteDialog.deleteModal);

    expect(await isVisible(countryDeleteDialog.deleteModal)).to.be.false;
  }
}
