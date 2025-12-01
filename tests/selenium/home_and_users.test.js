const {Builder, By, until} = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

// Adjust Chrome options for CI environments
const options = new chrome.Options().addArguments(
  '--headless=new',
  '--no-sandbox',
  '--disable-dev-shm-usage'
);

describe('User App basic navigation', function() {
  this.timeout(15000);
  let driver;

  before(async () => {
    driver = await new Builder().forBrowser('chrome').setChromeOptions(options).build();
  });

  after(async () => {
    if (driver) await driver.quit();
  });

  it('loads Home page and shows nav links', async () => {
    await driver.get('http://127.0.0.1:3000/');
    // Check title and presence of Users link
    const title = await driver.getTitle();
    if (!title || !title.toLowerCase().includes('home')) {
      throw new Error('Home page title not found');
    }
    const usersLink = await driver.findElement(By.css('a[href="/users"]'));
    await driver.wait(until.elementIsVisible(usersLink), 3000);
  });

  it('navigates to /users and sees a table or empty message', async () => {
    await driver.get('http://127.0.0.1:3000/users');
    // Either a table exists or the "No users found" message appears
    const elements = await driver.findElements(By.css('table, p.muted'));
    if (elements.length === 0) {
      throw new Error('Expected users table or empty message');
    }
  });
});
