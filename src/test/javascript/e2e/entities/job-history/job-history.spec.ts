import { browser, element, by } from 'protractor';

import NavBarPage from './../../page-objects/navbar-page';
import SignInPage from './../../page-objects/signin-page';
import JobHistoryComponentsPage from './job-history.page-object';
import JobHistoryUpdatePage from './job-history-update.page-object';
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

describe('JobHistory e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let jobHistoryComponentsPage: JobHistoryComponentsPage;
  let jobHistoryUpdatePage: JobHistoryUpdatePage;

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
    jobHistoryComponentsPage = new JobHistoryComponentsPage();
    jobHistoryComponentsPage = await jobHistoryComponentsPage.goToPage(navBarPage);
  });

  it('should load JobHistories', async () => {
    expect(await jobHistoryComponentsPage.title.getText()).to.match(/Job Histories/);
    expect(await jobHistoryComponentsPage.createButton.isEnabled()).to.be.true;
  });

  it('should create and delete JobHistories', async () => {
    const beforeRecordsCount = (await isVisible(jobHistoryComponentsPage.noRecords))
      ? 0
      : await getRecordsCount(jobHistoryComponentsPage.table);
    jobHistoryUpdatePage = await jobHistoryComponentsPage.goToCreateJobHistory();
    await jobHistoryUpdatePage.enterData();

    expect(await jobHistoryComponentsPage.createButton.isEnabled()).to.be.true;
    await waitUntilDisplayed(jobHistoryComponentsPage.table);
    await waitUntilCount(jobHistoryComponentsPage.records, beforeRecordsCount + 1);
    expect(await jobHistoryComponentsPage.records.count()).to.eq(beforeRecordsCount + 1);

    await jobHistoryComponentsPage.deleteJobHistory();
    if (beforeRecordsCount !== 0) {
      await waitUntilCount(jobHistoryComponentsPage.records, beforeRecordsCount);
      expect(await jobHistoryComponentsPage.records.count()).to.eq(beforeRecordsCount);
    } else {
      await waitUntilDisplayed(jobHistoryComponentsPage.noRecords);
    }
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
