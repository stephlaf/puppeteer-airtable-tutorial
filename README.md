# Tutorial to scrape using Puppeteer and store to Airtable

## Setup

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

The board columns (all as Single text line, except for `description`, which is Long text).
The columns must be defined as:

```
name
description
image_url
category
type
alcohol
```
## Usage

Run the program with `node dieuduciel.js`
See all the imported data appear in your Airtable board 😃
