import { browser, element, by } from 'protractor';

import NavBarPage from './../../page-objects/navbar-page';
import SignInPage from './../../page-objects/signin-page';
import EmployeeComponentsPage from './employee.page-object';
import EmployeeUpdatePage from './employee-update.page-object';
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

describe('Employee e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let employeeComponentsPage: EmployeeComponentsPage;
  let employeeUpdatePage: EmployeeUpdatePage;

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
    employeeComponentsPage = new EmployeeComponentsPage();
    employeeComponentsPage = await employeeComponentsPage.goToPage(navBarPage);
  });

  it('should load Employees', async () => {
    expect(await employeeComponentsPage.title.getText()).to.match(/Employees/);
    expect(await employeeComponentsPage.createButton.isEnabled()).to.be.true;
  });

  it('should create and delete Employees', async () => {
    const beforeRecordsCount = (await isVisible(employeeComponentsPage.noRecords))
      ? 0
      : await getRecordsCount(employeeComponentsPage.table);
    employeeUpdatePage = await employeeComponentsPage.goToCreateEmployee();
    await employeeUpdatePage.enterData();

    expect(await employeeComponentsPage.createButton.isEnabled()).to.be.true;
    await waitUntilDisplayed(employeeComponentsPage.table);
    await waitUntilCount(employeeComponentsPage.records, beforeRecordsCount + 1);
    expect(await employeeComponentsPage.records.count()).to.eq(beforeRecordsCount + 1);

    await employeeComponentsPage.deleteEmployee();
    if (beforeRecordsCount !== 0) {
      await waitUntilCount(employeeComponentsPage.records, beforeRecordsCount);
      expect(await employeeComponentsPage.records.count()).to.eq(beforeRecordsCount);
    } else {
      await waitUntilDisplayed(employeeComponentsPage.noRecords);
    }
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
