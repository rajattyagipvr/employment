import { browser, element, by } from 'protractor';

import NavBarPage from './../../page-objects/navbar-page';
import SignInPage from './../../page-objects/signin-page';
import TaskComponentsPage from './task.page-object';
import TaskUpdatePage from './task-update.page-object';
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

describe('Task e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let taskComponentsPage: TaskComponentsPage;
  let taskUpdatePage: TaskUpdatePage;

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
    taskComponentsPage = new TaskComponentsPage();
    taskComponentsPage = await taskComponentsPage.goToPage(navBarPage);
  });

  it('should load Tasks', async () => {
    expect(await taskComponentsPage.title.getText()).to.match(/Tasks/);
    expect(await taskComponentsPage.createButton.isEnabled()).to.be.true;
  });

  it('should create and delete Tasks', async () => {
    const beforeRecordsCount = (await isVisible(taskComponentsPage.noRecords)) ? 0 : await getRecordsCount(taskComponentsPage.table);
    taskUpdatePage = await taskComponentsPage.goToCreateTask();
    await taskUpdatePage.enterData();

    expect(await taskComponentsPage.createButton.isEnabled()).to.be.true;
    await waitUntilDisplayed(taskComponentsPage.table);
    await waitUntilCount(taskComponentsPage.records, beforeRecordsCount + 1);
    expect(await taskComponentsPage.records.count()).to.eq(beforeRecordsCount + 1);

    await taskComponentsPage.deleteTask();
    if (beforeRecordsCount !== 0) {
      await waitUntilCount(taskComponentsPage.records, beforeRecordsCount);
      expect(await taskComponentsPage.records.count()).to.eq(beforeRecordsCount);
    } else {
      await waitUntilDisplayed(taskComponentsPage.noRecords);
    }
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
