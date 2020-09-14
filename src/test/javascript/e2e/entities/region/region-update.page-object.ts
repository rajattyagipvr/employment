import { element, by, ElementFinder } from 'protractor';
import { waitUntilDisplayed, waitUntilHidden, isVisible } from '../../util/utils';

const expect = chai.expect;

export default class RegionUpdatePage {
  pageTitle: ElementFinder = element(by.id('employmentApp.region.home.createOrEditLabel'));
  saveButton: ElementFinder = element(by.id('save-entity'));
  cancelButton: ElementFinder = element(by.id('cancel-save'));
  regionNameInput: ElementFinder = element(by.css('input#region-regionName'));

  getPageTitle() {
    return this.pageTitle;
  }

  async setRegionNameInput(regionName) {
    await this.regionNameInput.sendKeys(regionName);
  }

  async getRegionNameInput() {
    return this.regionNameInput.getAttribute('value');
  }

  async save() {
    await this.saveButton.click();
  }

  async cancel() {
    await this.cancelButton.click();
  }

  getSaveButton() {
    return this.saveButton;
  }

  async enterData() {
    await waitUntilDisplayed(this.saveButton);
    await this.setRegionNameInput('regionName');
    expect(await this.getRegionNameInput()).to.match(/regionName/);
    await this.save();
    await waitUntilHidden(this.saveButton);
    expect(await isVisible(this.saveButton)).to.be.false;
  }
}
