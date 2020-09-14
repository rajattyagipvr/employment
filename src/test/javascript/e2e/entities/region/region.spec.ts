import { browser, element, by } from 'protractor';

import NavBarPage from './../../page-objects/navbar-page';
import SignInPage from './../../page-objects/signin-page';
import RegionComponentsPage from './region.page-object';
import RegionUpdatePage from './region-update.page-object';
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

describe('Region e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let regionComponentsPage: RegionComponentsPage;
  let regionUpdatePage: RegionUpdatePage;

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
    regionComponentsPage = new RegionComponentsPage();
    regionComponentsPage = await regionComponentsPage.goToPage(navBarPage);
  });

  it('should load Regions', async () => {
    expect(await regionComponentsPage.title.getText()).to.match(/Regions/);
    expect(await regionComponentsPage.createButton.isEnabled()).to.be.true;
  });

  it('should create and delete Regions', async () => {
    const beforeRecordsCount = (await isVisible(regionComponentsPage.noRecords)) ? 0 : await getRecordsCount(regionComponentsPage.table);
    regionUpdatePage = await regionComponentsPage.goToCreateRegion();
    await regionUpdatePage.enterData();

    expect(await regionComponentsPage.createButton.isEnabled()).to.be.true;
    await waitUntilDisplayed(regionComponentsPage.table);
    await waitUntilCount(regionComponentsPage.records, beforeRecordsCount + 1);
    expect(await regionComponentsPage.records.count()).to.eq(beforeRecordsCount + 1);

    await regionComponentsPage.deleteRegion();
    if (beforeRecordsCount !== 0) {
      await waitUntilCount(regionComponentsPage.records, beforeRecordsCount);
      expect(await regionComponentsPage.records.count()).to.eq(beforeRecordsCount);
    } else {
      await waitUntilDisplayed(regionComponentsPage.noRecords);
    }
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
