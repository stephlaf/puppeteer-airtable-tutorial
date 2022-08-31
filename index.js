const puppeteer = require("puppeteer");
const fetch = require("node-fetch");

async function sendData(dataToSend) {
  if (dataToSend.length > 0) {
    const splittedData = dataToSend.splice(0, 10);

    const response = await fetch(
      `https://api.airtable.com/v0/appl07xmiRxXCUJ7g/Beers`,
      {
        headers: {
          Authorization: `Bearer ${process.env.AIRTABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({ records: splittedData }),
      }
    );

    const data = await response.json();
    // check if error
    // console.log(data);
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
