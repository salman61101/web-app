const {Builder, By, until} = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

const options = new chrome.Options().addArguments(
  '--headless=new',
  '--no-sandbox',
  '--disable-dev-shm-usage'
);

// Allow overriding the base URL via env (useful inside Docker networks)
const BASE_URL = process.env.BASE_URL || 'http://127.0.0.1:3000';

describe('User App create user flow', function() {
  this.timeout(20000);
  let driver;

  before(async () => {
    driver = await new Builder().forBrowser('chrome').setChromeOptions(options).build();
  });

  after(async () => {
    if (driver) await driver.quit();
  });

  it('fills the new user form and submits, then verifies listing', async () => {
    await driver.get(`${BASE_URL}/users/new`);

    const nameInput = await driver.findElement(By.id('name'));
    const emailInput = await driver.findElement(By.id('email'));
    await nameInput.sendKeys('Test User');
    await emailInput.sendKeys('test.user@example.com');

    const submitBtn = await driver.findElement(By.css('button[type="submit"]'));
    await submitBtn.click();

    // After redirect, ensure /users table contains the new entry
  await driver.wait(until.urlContains('/users'), 3000);

    const rows = await driver.findElements(By.css('table tbody tr'));
    // If table exists, check that at least one row contains our email
    if (rows.length > 0) {
      let found = false;
      for (const row of rows) {
        const text = await row.getText();
        if (text.includes('test.user@example.com')) {
          found = true;
          break;
        }
      }
      if (!found) throw new Error('Newly created user not found in table');
    } else {
      // Fallback: if no rows, look for list items or generic text
      const bodyText = await driver.findElement(By.css('body')).getText();
      if (!bodyText.includes('test.user@example.com')) {
        throw new Error('Newly created user not found on page');
      }
    }
  });
});
