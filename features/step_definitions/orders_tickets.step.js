const { Given, When, Then, And, Before, After } = require("cucumber");
const puppeteer = require("puppeteer");
const { expect, assert } = require("chai");
const {
  clickElement,
  extractText,
  selectHall,
} = require("../../lib/commands.js");

Before(async function () {
  const browser = await puppeteer.launch({ headless: false }, { slowMo: 50 });
  const page = await browser.newPage();
  this.browser = browser;
  this.page = page;
});

After(async function () {
  if (this.browser) {
    await this.browser.close();
  }
});

Given("user is on {string} page", { timeout: 60000 }, async function (page) {
  return await this.page.goto(page, { setTimeout: 30000 });
});

When(
  "user selects hall {string}, row {int}, place {int} and plus {int} days from the current date",
  { timeout: 60000 },
  async function (hall, row, place, day) {
    let testHall = await selectHall(hall);
    const firstSeat = [row, place];
    const firstSeatSelector = `.buying-scheme__row:nth-child(${firstSeat[0]})>.buying-scheme__chair:nth-child(${firstSeat[1]})`;
    await this.page.reload();
    await clickElement(this.page, `a:nth-child(${day + 1})`);
    await clickElement(this.page, testHall);
    await clickElement(this.page, firstSeatSelector);
    await clickElement(this.page, ".acceptin-button");
    await this.page.waitForSelector(".ticket__check-title");
    await clickElement(this.page, "button[onclick]");
  }
);

When(
  "user selects hall {string}, row {int} / place {int} and row {int} / place {int}, plus {int} days from the current date",
  async function (hall, row1, place1, row2, place2, day) {
    let testHall = await selectHall(hall);
    const firstSeat = [row1, place1];
    const firstSeatSelector = `.buying-scheme__row:nth-child(${firstSeat[0]})>.buying-scheme__chair:nth-child(${firstSeat[1]})`;
    const secondSeat = [row2, place2];
    const secondSeatSelector = `.buying-scheme__row:nth-child(${secondSeat[0]})>.buying-scheme__chair:nth-child(${secondSeat[1]})`;
    await this.page.reload();
    await clickElement(this.page, `a:nth-child(${day + 1})`);
    await clickElement(this.page, testHall);
    await clickElement(this.page, firstSeatSelector);
    await clickElement(this.page, secondSeatSelector);
    await clickElement(this.page, ".acceptin-button");
    await this.page.waitForSelector(".ticket__check-title");
    await clickElement(this.page, "button[onclick]");
    const ticketInfo = await extractText(this.page, "p:nth-child(2) > span");
    expect(ticketInfo).contain(
      `${firstSeat[0]}/${firstSeat[1]}, ${secondSeat[0]}/${secondSeat[1]}`
    );
  }
);

Then(
  "trying to place the same order: hall {string}, row {int} / place {int}, plus {int} days from the current date, order uncompleted",
  async function (hall, row, place, day) {
    page2 = await this.browser.newPage();
    await page2.goto("http://qamid.tmweb.ru", { setTimeout: 30000 });
    await page2.reload();
    let testHall = await selectHall(hall);
    const firstSeat = [row, place];
    const firstSeatSelector = `.buying-scheme__row:nth-child(${firstSeat[0]})>.buying-scheme__chair:nth-child(${firstSeat[1]})`;
    await clickElement(page2, `a:nth-child(${day + 1})`);
    await clickElement(page2, testHall);
    await clickElement(page2, firstSeatSelector);
    const buttonDisabled = await page2.$("button.acceptin-button[disabled]");
    assert.isNotNull(buttonDisabled);
    await page2.close();
  }
);

Then("order completed, text appears {string}", async function (string) {
  const actual = await extractText(this.page, "p:nth-child(7)");
  expect(actual).contain(string);
});
