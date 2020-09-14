import { element, by, ElementFinder } from 'protractor';
import { waitUntilDisplayed, waitUntilHidden, isVisible } from '../../util/utils';

const expect = chai.expect;

export default class LocationUpdatePage {
  pageTitle: ElementFinder = element(by.id('employmentApp.location.home.createOrEditLabel'));
  saveButton: ElementFinder = element(by.id('save-entity'));
  cancelButton: ElementFinder = element(by.id('cancel-save'));
  streetAddressInput: ElementFinder = element(by.css('input#location-streetAddress'));
  postalCodeInput: ElementFinder = element(by.css('input#location-postalCode'));
  cityInput: ElementFinder = element(by.css('input#location-city'));
  stateProvinceInput: ElementFinder = element(by.css('input#location-stateProvince'));
  countrySelect: ElementFinder = element(by.css('select#location-country'));

  getPageTitle() {
    return this.pageTitle;
  }

  async setStreetAddressInput(streetAddress) {
    await this.streetAddressInput.sendKeys(streetAddress);
  }

  async getStreetAddressInput() {
    return this.streetAddressInput.getAttribute('value');
  }

  async setPostalCodeInput(postalCode) {
    await this.postalCodeInput.sendKeys(postalCode);
  }

  async getPostalCodeInput() {
    return this.postalCodeInput.getAttribute('value');
  }

  async setCityInput(city) {
    await this.cityInput.sendKeys(city);
  }

  async getCityInput() {
    return this.cityInput.getAttribute('value');
  }

  async setStateProvinceInput(stateProvince) {
    await this.stateProvinceInput.sendKeys(stateProvince);
  }

  async getStateProvinceInput() {
    return this.stateProvinceInput.getAttribute('value');
  }

  async countrySelectLastOption() {
    await this.countrySelect.all(by.tagName('option')).last().click();
  }

  async countrySelectOption(option) {
    await this.countrySelect.sendKeys(option);
  }

  getCountrySelect() {
    return this.countrySelect;
  }

  async getCountrySelectedOption() {
    return this.countrySelect.element(by.css('option:checked')).getText();
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
    await this.setStreetAddressInput('streetAddress');
    expect(await this.getStreetAddressInput()).to.match(/streetAddress/);
    await waitUntilDisplayed(this.saveButton);
    await this.setPostalCodeInput('postalCode');
    expect(await this.getPostalCodeInput()).to.match(/postalCode/);
    await waitUntilDisplayed(this.saveButton);
    await this.setCityInput('city');
    expect(await this.getCityInput()).to.match(/city/);
    await waitUntilDisplayed(this.saveButton);
    await this.setStateProvinceInput('stateProvince');
    expect(await this.getStateProvinceInput()).to.match(/stateProvince/);
    await this.countrySelectLastOption();
    await this.save();
    await waitUntilHidden(this.saveButton);
    expect(await isVisible(this.saveButton)).to.be.false;
  }
}
