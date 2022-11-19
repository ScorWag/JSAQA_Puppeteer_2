module.exports = {
  clickElement: async (page, selector) => {
    try {
      await page.waitForSelector(selector);
      const element = await page.$(selector);
      await element.click();
    } catch (error) {
      throw new Error(`Selector is not clickable: ${selector}`);
    }
  },
  extractText: async (page, selector) => {
    try {
      await page.waitForSelector(selector);
      return await page.$eval(selector, (el) => el.textContent);
    } catch (error) {
      throw new Error(`Text is not avialable for "${selector}"`);
    }
  },
  selectHall: async (hall) => {
    let testHall;
    switch (hall) {
      case "Зал 1":
        testHall = "[data-seance-id='129']";
        break;
      case "TEST HALL":
        testHall = "[data-seance-id='139']";
        break;
      case "Hercules":
        testHall = "[data-seance-id='94']";
        break;
      case "data.newHall":
        testHall = "[data-seance-id='96']";
        break;
    }
    return testHall;
  },
};
