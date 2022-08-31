require('dotenv')

const puppeteer = require("puppeteer");
const fetch = require("node-fetch");
const config = require("./config");

async function sendData(dataToSend) {
  if (dataToSend.length > 0) {
    const splittedData = dataToSend.splice(0, 10);

    const response = await fetch(
      `https://api.airtable.com/v0/${process.env.AIRTABLE_BOARD_KEY}/${config.dieuDuCielView}`,
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
    
    // In case of error
    if (!response.ok) {
      console.error(data)
    }

    // To avoid reaching rate limiting on API
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return sendData(dataToSend);
  }

  return null;
}

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  await page.goto("https://dieuduciel.com/categories/bouteille-canette/", {
    waitUntil: 'networkidle2'
  });

  const result = await page.evaluate(async () => {
    const data = [];

    const elements = document.querySelectorAll('.bieres__biere a');

    for (const element of elements) {
        element.click();

        /* Not perfect I think it's doable to wait for network response, 
         don't know how to do it at the time */
        await new Promise((resolve) => setTimeout(resolve, 2000));

        const title = document.querySelector('.heading.biere__heading').innerText;
        
        data.push({ 
          fields: {
            title
          }
        });
    }

    return data; 
  }); 

  await browser.close();

  await sendData(result);
})();
