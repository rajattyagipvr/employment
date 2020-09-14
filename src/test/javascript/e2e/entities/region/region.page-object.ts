import { element, by, ElementFinder, ElementArrayFinder } from 'protractor';

import { waitUntilAnyDisplayed, waitUntilDisplayed, click, waitUntilHidden, isVisible } from '../../util/utils';

import NavBarPage from './../../page-objects/navbar-page';

import RegionUpdatePage from './region-update.page-object';

const expect = chai.expect;
export class RegionDeleteDialog {
  deleteModal = element(by.className('modal'));
  private dialogTitle: ElementFinder = element(by.id('employmentApp.region.delete.question'));
  private confirmButton = element(by.id('jhi-confirm-delete-region'));

  getDialogTitle() {
    return this.dialogTitle;
  }

  async clickOnConfirmButton() {
    await this.confirmButton.click();
  }
}

export default class RegionComponentsPage {
  createButton: ElementFinder = element(by.id('jh-create-entity'));
  deleteButtons = element.all(by.css('div table .btn-danger'));
  title: ElementFinder = element(by.id('region-heading'));
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
    await navBarPage.getEntityPage('region');
    await waitUntilAnyDisplayed([this.noRecords, this.table]);
    return this;
  }

  async goToCreateRegion() {
    await this.createButton.click();
    return new RegionUpdatePage();
  }

  async deleteRegion() {
    const deleteButton = this.getDeleteButton(this.records.last());
    await click(deleteButton);

    const regionDeleteDialog = new RegionDeleteDialog();
    await waitUntilDisplayed(regionDeleteDialog.deleteModal);
    expect(await regionDeleteDialog.getDialogTitle().getAttribute('id')).to.match(/employmentApp.region.delete.question/);
    await regionDeleteDialog.clickOnConfirmButton();

    await waitUntilHidden(regionDeleteDialog.deleteModal);

    expect(await isVisible(regionDeleteDialog.deleteModal)).to.be.false;
  }
}
