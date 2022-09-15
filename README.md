# Tutorial to scrape the web using Puppeteer and store to Airtable #

## Setup ##

```
yarn add puppeteer
yarn add airtable
yarn add dotenv
touch .env
```

Store your airtable API key and Board key in `.env`
```
AIRTABLE_API_KEY='your_api_key'
AIRTABLE_BOARD_KEY='your_board_key'
```

The table name `Table 1` used in the `base('Table 1').create` command on line 10 of `dieuduciel.js` refers to the name of the table you want to write to.\
Adjust accordingly.

<img width="313" alt="screenshot" src="https://user-images.githubusercontent.com/37821714/188288748-3f47ca84-6451-4f91-92bb-94d6792c7651.png">

The board columns (all as Single text line, except for `description`, which is `Long text`, and `image_url`, which is `URL`).
The columns must be defined as:

```
name
description
image_url
category
type
alcohol
```
## Usage ##

Run the program with `node dieuduciel.js`\
See all the imported data appear in your Airtable board 😃

Big thanks to [@jeremiebardon](https://github.com/jeremiebardon) for his help 🙏🏻
