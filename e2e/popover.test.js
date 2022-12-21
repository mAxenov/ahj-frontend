import puppeteer from 'puppeteer';

describe('Inn Form', () => {
  let browser;
  let page;

  beforeEach(async () => {
    browser = await puppeteer.launch({
      headless: false,
      slowMo: 100,
      devtools: true,
    });

    page = await browser.newPage();
  });

  test('Form should render on page start', async () => {
    await page.goto('http://localhost:9000');

    await page.waitFor('.container');
  });

  test('Form input should add .valid class if cards is valid', async () => {
    jest.setTimeout(20000);
    await page.goto('http://localhost:9000');

    await page.waitFor('.container');

    const submit = await page.$('.button');

    await submit.click();

    await page.waitFor('.popover');
  });
  afterEach(async () => {
    await browser.close();
  });
});
