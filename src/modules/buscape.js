const URL = `https://www.buscape.com.br/search?q=`;
const { Builder, By } = require('selenium-webdriver');
const { Options } = require('selenium-webdriver/chrome');
require('chromedriver');
const Item = require("../model/item")

async function buscape(term) {

    try {
        let filteredUrl = URL + term.replace(" ", "%20")
        let options = new Options();
        options.addArguments('headless')
        options.addArguments("--disable-gpu");
        options.addArguments("--no-sandbox");
        var driver = await new Builder().forBrowser('chrome').setChromeOptions(options).
            build();

        let result = []

        await driver.get(filteredUrl);

        const list = await driver.findElement(By.className('SearchPage_SearchList__HL7RI col'));

        const items = await list.findElements(By.className('card card--prod'));

        for (const item of items) {
            const text = await item.findElement(By.className('name')).getAttribute("title");

            let price = await item.findElement(By.className('priceWrapper'))
            price = await price.findElement(By.xpath('a/span/span[1]')).getText()

            let itemUrl = await item.findElement(By.className('name')).getAttribute("href");

            result.push(new Item(text, price, "Buscape", "https://www.buscape.com.br/" + itemUrl))
        }

        await driver.quit();
        return result;
    } catch (err) {

        return [new Item(err, 0, 0, 0)]
    }
}

module.exports = buscape;