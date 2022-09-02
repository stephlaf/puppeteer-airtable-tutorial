require('dotenv')

const puppeteer = require("puppeteer");
const fetch = require("node-fetch");
const config = require("./config");

// import { AIRTABLE_API_KEY } from './key.js'
// import { AIRTABLE_BOARD_KEY } from './key.js'

const Airtable = require('airtable');
var base = new Airtable({ apiKey: 'XXXX' }).base('XXXX');

async function sendData(beerObjects) {
  // console.log('From sendData', beerObjects);
  if (beerObjects.length > 0) {
    const splicedData = beerObjects.splice(0, 10);

    console.log('splicedData: ', splicedData);

    splicedData.forEach((beer) => {
      console.log(beer);
      base('Table 1').create([beer], function(err, records) {
        if (err) {
          console.error(err);
          return;
        }
        records.forEach(function (record) {
          console.log(`Beer with ID ${record.getId()} was created`);
        });
      });
    })

    // To avoid reaching rate limiting on API
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return sendData(beerObjects);
  }

  return null;
}

(async () => {
  const browser = await puppeteer.launch({ headless: false,  args: [`--window-size=850,1080`] });
  const page = await browser.newPage();

  await page.goto("https://dieuduciel.com/categories/bouteille-canette/", {
    waitUntil: 'networkidle2'
  });

  const beerObjects = await page.evaluate(async () => {
    const beersArray = [];

    const elements = document.querySelectorAll('.bieres__biere a');
    const beerLinks = Array.from(elements)

    for (const link of beerLinks) {
      link.click();

      /* Not perfect I think it's doable to wait for network response,
        don't know how to do it at the time */
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const beer_infos = document.querySelector('.biere__header-container')
      const imageUrl = beer_infos.querySelector('.biere__img img').src
      const category = beer_infos.querySelector('h4.heading').innerText
      const name = beer_infos.querySelector('h2.biere__heading').innerText
      const type = beer_infos.querySelector('p > strong').innerText
      const alcohol = beer_infos.querySelectorAll('p')[1].innerText
      const description = document.querySelectorAll('div.biere__description p')[1].innerText

      beersArray.push({
        fields: {
          name: name,
          description: description,
          image_url: imageUrl,
          category: category,
          type: type,
          alcohol: alcohol,
        }
      });
    }

    return beersArray;
  });

  await browser.close();

  await sendData(beerObjects);
})();
