import { browser, element, by } from 'protractor';

import NavBarPage from './../../page-objects/navbar-page';
import SignInPage from './../../page-objects/signin-page';
import JobComponentsPage from './job.page-object';
import JobUpdatePage from './job-update.page-object';
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

describe('Job e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let jobComponentsPage: JobComponentsPage;
  let jobUpdatePage: JobUpdatePage;

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
    jobComponentsPage = new JobComponentsPage();
    jobComponentsPage = await jobComponentsPage.goToPage(navBarPage);
  });

  it('should load Jobs', async () => {
    expect(await jobComponentsPage.title.getText()).to.match(/Jobs/);
    expect(await jobComponentsPage.createButton.isEnabled()).to.be.true;
  });

  it('should create and delete Jobs', async () => {
    const beforeRecordsCount = (await isVisible(jobComponentsPage.noRecords)) ? 0 : await getRecordsCount(jobComponentsPage.table);
    jobUpdatePage = await jobComponentsPage.goToCreateJob();
    await jobUpdatePage.enterData();

    expect(await jobComponentsPage.createButton.isEnabled()).to.be.true;
    await waitUntilDisplayed(jobComponentsPage.table);
    await waitUntilCount(jobComponentsPage.records, beforeRecordsCount + 1);
    expect(await jobComponentsPage.records.count()).to.eq(beforeRecordsCount + 1);

    await jobComponentsPage.deleteJob();
    if (beforeRecordsCount !== 0) {
      await waitUntilCount(jobComponentsPage.records, beforeRecordsCount);
      expect(await jobComponentsPage.records.count()).to.eq(beforeRecordsCount);
    } else {
      await waitUntilDisplayed(jobComponentsPage.noRecords);
    }
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
