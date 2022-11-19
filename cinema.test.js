const {
  clickElement,
  extractText,
  checkTicketInfo,
} = require("./lib/commands.js");
let page;
const testHall = "[data-seance-id='139']";
const firstSeat = [1, 2];
const firstSeatSelector = `.buying-scheme__row:nth-child(${firstSeat[0]})>.buying-scheme__chair:nth-child(${firstSeat[1]})`;
const secondSeat = [2, 1];
const secondSeatSelector = `.buying-scheme__row:nth-child(${secondSeat[0]})>.buying-scheme__chair:nth-child(${secondSeat[1]})`;
const pageUrl = "http://qamid.tmweb.ru";

beforeEach(async () => {
  page = await browser.newPage();
  await page.goto(pageUrl, { timeout: 0 }, { waitUtil: "networkidle0" });
  await page.reload();
}, 60000);

afterEach(async () => {
  await page.close();
});

test("One seat order", async () => {
  await clickElement(page, "a:nth-child(2)");
  await clickElement(page, testHall);
  await clickElement(page, firstSeatSelector);
  await clickElement(page, ".acceptin-button");
  await page.waitForSelector(".ticket__check-title");
  await clickElement(page, "button[onclick]");
  const ticketInfo = await extractText(page, "p:nth-child(2) > span");
  expect(ticketInfo).toEqual(`${firstSeat[0]}/${firstSeat[1]}`);
  const actual = await extractText(page, "p:nth-child(7)");
  expect(actual).toEqual(
    "Покажите QR-код нашему контроллеру для подтверждения бронирования."
  );
}, 60000);

test("Some seats order", async () => {
  await clickElement(page, "a:nth-child(3)");
  await clickElement(page, testHall);
  await clickElement(page, firstSeatSelector);
  await clickElement(page, secondSeatSelector);
  await clickElement(page, ".acceptin-button");
  await page.waitForSelector(".ticket__check-title");
  await clickElement(page, "button[onclick]");
  const ticketInfo = await extractText(page, "p:nth-child(2) > span");
  expect(ticketInfo).toEqual(
    `${firstSeat[0]}/${firstSeat[1]}, ${secondSeat[0]}/${secondSeat[1]}`
  );
  const actual = await extractText(page, "p:nth-child(7)");
  expect(actual).toEqual(
    "Покажите QR-код нашему контроллеру для подтверждения бронирования."
  );
}, 60000);

test("Order a reserved seat", async () => {
  await clickElement(page, "a:nth-child(4)");
  await clickElement(page, testHall);
  await clickElement(page, firstSeatSelector);
  await clickElement(page, ".acceptin-button");
  await page.waitForSelector(".ticket__check-title");
  await clickElement(page, "button[onclick]");
  page2 = await browser.newPage();
  await page2.goto(pageUrl, { timeout: 0 }, { waitUtil: "networkidle0" });
  await page2.reload();
  await clickElement(page2, "a:nth-child(4)");
  await clickElement(page2, testHall);
  await clickElement(page2, firstSeatSelector);
  const buttonDisabled = await page2.$("button.acceptin-button[disabled]");
  expect(buttonDisabled).not.toBeNull();
  await page2.close();
}, 60000);
