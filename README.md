# Flipper Leaderboard

React app that ranks real estate flippers using data from a public Google Sheet. Users select a location, then view a sortable leaderboard with expandable seller details and property-level info.

## Features

- Location search/selection (currently Kern County / Bakersfield).
- Google Sheets data fetch and parsing.
- Leaderboard grouped by seller with:
  - Flip count
  - Total volume
  - Average margin
- Sortable columns and expandable rows.
- Zillow links for each property.

## Tech Stack

- React + Vite
- Axios
- Plain CSS with CSS variables and inline styles

## Running Locally

```sh
npm install
npm run dev
```

## Project Structure

- `src/main.jsx`: React entry point.
- `src/App.jsx`: Data fetch + leaderboard UI.
- `src/HomePage.jsx`: Location search screen.
- `src/index.css`: CSS variables + base styles.
- `src/App.css`: Reserved for additional app-specific styles.

## Data Source

The app pulls data from a public Google Sheet using the Google Visualization JSON endpoint. The sheet ID is defined in `src/App.jsx`.

## Notes

- Only a small set of locations is currently supported.
- The UI is mostly inline styles; global styles live in `src/index.css`.
