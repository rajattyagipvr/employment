import { browser, element, by } from 'protractor';

import NavBarPage from './../../page-objects/navbar-page';
import SignInPage from './../../page-objects/signin-page';
import CountryComponentsPage from './country.page-object';
import CountryUpdatePage from './country-update.page-object';
import {
  waitUntilDisplayed,
  waitUntilAnyDisplayed,
  click,
  getRecordsCount,
  waitUntilHidden,
  waitUntilCount,
  isVisible,
} from '../../util/utils';

const expect = chai.expect;

describe('Country e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let countryComponentsPage: CountryComponentsPage;
  let countryUpdatePage: CountryUpdatePage;

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.waitUntilDisplayed();

    await signInPage.username.sendKeys('admin');
    await signInPage.password.sendKeys('admin');
    await signInPage.loginButton.click();
    await signInPage.waitUntilHidden();
    await waitUntilDisplayed(navBarPage.entityMenu);
    await waitUntilDisplayed(navBarPage.adminMenu);
    await waitUntilDisplayed(navBarPage.accountMenu);
  });

  beforeEach(async () => {
    await browser.get('/');
    await waitUntilDisplayed(navBarPage.entityMenu);
    countryComponentsPage = new CountryComponentsPage();
    countryComponentsPage = await countryComponentsPage.goToPage(navBarPage);
  });

  it('should load Countries', async () => {
    expect(await countryComponentsPage.title.getText()).to.match(/Countries/);
    expect(await countryComponentsPage.createButton.isEnabled()).to.be.true;
  });

  it('should create and delete Countries', async () => {
    const beforeRecordsCount = (await isVisible(countryComponentsPage.noRecords)) ? 0 : await getRecordsCount(countryComponentsPage.table);
    countryUpdatePage = await countryComponentsPage.goToCreateCountry();
    await countryUpdatePage.enterData();

    expect(await countryComponentsPage.createButton.isEnabled()).to.be.true;
    await waitUntilDisplayed(countryComponentsPage.table);
    await waitUntilCount(countryComponentsPage.records, beforeRecordsCount + 1);
    expect(await countryComponentsPage.records.count()).to.eq(beforeRecordsCount + 1);

    await countryComponentsPage.deleteCountry();
    if (beforeRecordsCount !== 0) {
      await waitUntilCount(countryComponentsPage.records, beforeRecordsCount);
      expect(await countryComponentsPage.records.count()).to.eq(beforeRecordsCount);
    } else {
      await waitUntilDisplayed(countryComponentsPage.noRecords);
    }
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
