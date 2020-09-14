import { browser, element, by } from 'protractor';

import NavBarPage from './../../page-objects/navbar-page';
import SignInPage from './../../page-objects/signin-page';
import DepartmentComponentsPage from './department.page-object';
import DepartmentUpdatePage from './department-update.page-object';
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

describe('Department e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let departmentComponentsPage: DepartmentComponentsPage;
  let departmentUpdatePage: DepartmentUpdatePage;

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
    departmentComponentsPage = new DepartmentComponentsPage();
    departmentComponentsPage = await departmentComponentsPage.goToPage(navBarPage);
  });

  it('should load Departments', async () => {
    expect(await departmentComponentsPage.title.getText()).to.match(/Departments/);
    expect(await departmentComponentsPage.createButton.isEnabled()).to.be.true;
  });

  it('should create and delete Departments', async () => {
    const beforeRecordsCount = (await isVisible(departmentComponentsPage.noRecords))
      ? 0
      : await getRecordsCount(departmentComponentsPage.table);
    departmentUpdatePage = await departmentComponentsPage.goToCreateDepartment();
    await departmentUpdatePage.enterData();

    expect(await departmentComponentsPage.createButton.isEnabled()).to.be.true;
    await waitUntilDisplayed(departmentComponentsPage.table);
    await waitUntilCount(departmentComponentsPage.records, beforeRecordsCount + 1);
    expect(await departmentComponentsPage.records.count()).to.eq(beforeRecordsCount + 1);

    await departmentComponentsPage.deleteDepartment();
    if (beforeRecordsCount !== 0) {
      await waitUntilCount(departmentComponentsPage.records, beforeRecordsCount);
      expect(await departmentComponentsPage.records.count()).to.eq(beforeRecordsCount);
    } else {
      await waitUntilDisplayed(departmentComponentsPage.noRecords);
    }
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
