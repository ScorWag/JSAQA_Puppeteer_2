const { Given, When, Then, Before, After } = require("cucumber");
const puppeteer = require("puppeteer");
const { expect, assert } = require("chai");
const {
  clickElement,
  extractText,
  selectHall,
} = require("../../lib/commands.js");

let rows = [];
let places = [];

Before(async function () {
  const browser = await puppeteer.launch({ headless: false }, { slowMo: 5000 });
  const page = await browser.newPage();
  this.browser = browser;
  this.page = page;
  rows = [];
  places = [];
});

After(async function () {
  if (this.browser) {
    await this.browser.close();
  }
});

Given("user is on {string} page", { timeout: 60000 }, async function (page) {
  const currentPage = await this.page.goto(page, { setTimeout: 60000 });
  this.page.reload();
  return currentPage;
});

When(
  "user selects plus {int} days from the current date",
  { timeout: 60000 },
  async function (day) {
    await clickElement(this.page, `a:nth-child(${day + 1})`);
  }
);

When("selects hall {string}", { timeout: 60000 }, async function (hall) {
  let testHall = await selectHall(hall);
  await clickElement(this.page, testHall);
});

When(
  "selects row {int} / place {int}",
  { timeout: 60000 },
  async function (row, place) {
    rows.push(row);
    places.push(place);
    const seat = [row, place];
    const seatSelector = `.buying-scheme__row:nth-child(${seat[0]})>.buying-scheme__chair:nth-child(${seat[1]})`;
    await clickElement(this.page, seatSelector);
  }
);

When("click button - Забронировать", { timeout: 60000 }, async function () {
  await clickElement(this.page, ".acceptin-button");
  await this.page.waitForSelector(".ticket__check-title");
  await clickElement(this.page, "button[onclick]");
  await this.page.waitForSelector(".ticket__check-title");
});

Then("order completed, text appears {string}", async function (string) {
  let expectedTicketInfo = "";
  for (let i = 0; i < rows.length && i < places.length; i++) {
    if (rows.length === i + 1 && places.length === i + 1) {
      expectedTicketInfo += rows[i] + "/" + places[i];
    } else {
      expectedTicketInfo += rows[i] + "/" + places[i] + ", ";
    }
  }
  const actualTicketInfo = await extractText(
    this.page,
    "p:nth-child(2) > span"
  );
  expect(actualTicketInfo).contain(expectedTicketInfo);
  const actual = await extractText(this.page, "p:nth-child(7)");
  expect(actual).contain(string);
});

When(
  "user again is on {string} page",
  { timeout: 60000 },
  async function (page) {
    await this.page.goto(page, { setTimeout: 60000 });
    this.page.reload();
  }
);

Then(
  "button - Забронировать is not active, order uncompleted",
  { timeout: 60000 },
  async function () {
    const buttonDisabled = await this.page.$(
      "button.acceptin-button[disabled]"
    );
    assert.isNotNull(buttonDisabled);
  }
);
