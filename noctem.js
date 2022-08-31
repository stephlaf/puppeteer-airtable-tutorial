require('dotenv');

const puppeteer = require("puppeteer");
const fetch = require("node-fetch");
const config = require("./config");

async function sendData(dataToSend) {
  if (dataToSend.length > 0) {
    const splittedData = dataToSend.splice(0, 10);

    // To avoid rate limiting on API
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const response = await fetch(
      `https://api.airtable.com/v0/${config.appMainBoaard}/${config.noctem}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.AIRTABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({ records: splittedData }),
      }
    );

    // In case of error
    if (!response.ok) {
      console.error(data)
    }

    const data = await response.json();

     // To avoid reaching rate limiting on API
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return sendData(dataToSend);
  }
}

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  await page.goto("https://www.noctem.ca/collections/bieres");

  await page.waitForSelector(".product");

  const productsInfos = await page.$$eval(".product", (products) => {
    return products.map((product) => {
      const stock =
        product.innerText.indexOf("$") === -1 ? "Sold out" : "In stock";
      const price =
        stock === "In stock"
          ? parseFloat(
              product.innerText.substr(product.innerText.indexOf("$") + 1)
            )
          : 0;

      return {
        fields: {
          name: product.innerText.substr(0, product.innerText.indexOf("\n")),
          price,
          stock,
        },
      };
    });
  });

  await browser.close();

  await sendData(productsInfos);
})();
