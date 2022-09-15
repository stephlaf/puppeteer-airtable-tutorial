require('dotenv').config()
const puppeteer = require("puppeteer");

const Airtable = require('airtable');
const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(process.env.AIRTABLE_BOARD_KEY);

const writeToAirtable = async (beerObjects) => {
  // Iterate over the Array & write the infos for each beer to the Airtable table
  beerObjects.forEach((beer) => {
    base('Table 1').create(beer, (err, record) => {
      if (err) {
        console.error(err);
        return;
      }
      console.log(beer.name);
      console.log(`Beer with ID ${record.getId()} was created`);
    });
  })
}

const beerObjects = (async () => {
  const browser = await puppeteer.launch({ headless: true,  args: [`--window-size=850,1080`] });
  const page = await browser.newPage();

  await page.goto("https://dieuduciel.com/categories/bouteille-canette/", {
    waitUntil: 'networkidle2'
  });

  // Once the page is loaded
  const beerObjects = await page.evaluate(async () => {
    // console.log("Let's scrape this page! 😃");
    // Create an Array to store each beer Object
    const beersArray = [];

    // Get all the links from the page & turn the NodeList into an Array
    const beerLinks = document.querySelectorAll('.bieres__biere a');
    const beerLinksArray = Array.from(beerLinks)

    // Loop over the Array
    for (let link of beerLinksArray) {
    // for (let link of beerLinksArray) {

      // click on the link
      await link.click();

      // Wait for network response
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Scrape the infos
      const beer_infos = document.querySelector('.biere__header-container')
      const name = beer_infos.querySelector('h2.biere__heading').innerText
      const category = beer_infos.querySelector('h4.heading').innerText
      const type = beer_infos.querySelector('p > strong').innerText
      const alcohol = beer_infos.querySelectorAll('p')[1].innerText
      const imageUrl = beer_infos.querySelector('.biere__img img').src
      const description = document.querySelectorAll('div.biere__description p')[1].innerText

      // Store the infos Object in the Array
      beersArray.push({
        name,
        category,
        type,
        alcohol,
        image_url: imageUrl,
        description
      });
    }
    // Once the loop is over, return the Array
    return beersArray;
  });

  // Close the Browser
  await browser.close();

  // Call the function to write the infos to Airtable
  await writeToAirtable(beerObjects);
})();
