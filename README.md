# Chase the Powder Tracker - Worldwide Ski Resorts

A lightweight, beginner-friendly web page that tracks daily snowfall data for ski resorts worldwide using the Open-Meteo API.

## Features

- **Real-time Data**: Automatically fetches snowfall data from Open-Meteo API on page load
- **Mobile-Friendly**: Responsive design that works on all devices
- **Clean UI**: Modern, clean interface styled with TailwindCSS
- **Global Coverage**: Tracks 150+ ski resorts across 6 continents
- **Easy Filtering**: Filter by region (North America, Asia, South America, Oceania, Eastern Europe, Nordic) with dropdown and filter chips
- **Search & Sort**: Search by name, region, state, or country. Sort by name, snowfall, or update time
- **Comprehensive Data**: Shows 24-hour snowfall, 7-day totals, base depth, and last update time

## Displayed Information

For each resort, the dashboard shows:
- Resort Name
- Region / State / Country
- Snowfall in the last 24 hours (in inches)
- Snowfall in the last 7 days (in inches)
- Base depth (if available, in inches)
- Last updated timestamp

## Tracked Resorts

The tracker includes **150+ ski resorts** across the globe, organized by region:

### North America
**United States** - Major resorts in Colorado, Utah, California, Nevada, Wyoming, Vermont, New Hampshire, and Montana including Vail, Aspen, Breckenridge, Park City, Mammoth Mountain, Jackson Hole, and more.

**Canada** - Top Canadian destinations including Whistler, Banff/Lake Louise, Revelstoke, Fernie, Big White, Sun Peaks, Red Mountain, Kicking Horse, Mont Tremblant, Blue Mountain, Panorama, and Silver Star.

### Asia / Far East
**Japan** - Premier Japanese ski destinations including Niseko, Hakuba Valley, Rusutsu, Furano, Nozawa Onsen, Myoko Kogen, Shiga Kogen, Appi Kogen, Zao Onsen, Kiroro, Tomamu, and Naeba.

**South Korea** - Major Korean ski resorts including Yongpyong, Alpensia, High1, Phoenix Park, Vivaldi Park, Elysian Gangchon, Welli Hilli Park, Oak Valley, Jisan Forest, and more.

### South America
**Chile** - Andes mountain resorts including Valle Nevado, Portillo, La Parva, El Colorado, Nevados de Chillán, Corralco, Antillanca, Termas de Chillán, Valle Las Trancas, and Farellones.

**Argentina** - Patagonian and Andean destinations including Las Leñas, Cerro Catedral, Chapelco, La Hoya, Cerro Castor, Cerro Bayo, Caviahue, and more.

### Oceania
**Australia** - Snowy Mountains and Victorian Alps resorts including Perisher, Thredbo, Falls Creek, Mount Hotham, Mount Buller, Charlotte Pass, Selwyn Snowfields, Mount Baw Baw, and Ben Lomond.

**New Zealand** - Southern Alps and Central Plateau destinations including The Remarkables, Coronet Peak, Cardrona, Treble Cone, Mount Ruapehu (Turoa & Whakapapa), Mount Hutt, Ohau, and Roundhill.

### Eastern Europe / Balkans
**Slovenia** - Julian Alps resorts including Kranjska Gora, Vogel, Krvavec, Rogla, Mariborsko Pohorje, Cerkno, and Kanin.

**Bulgaria** - Pirin, Rila, and Rhodope Mountains including Bansko, Borovets, Pamporovo, Vitosha, Chepelare, and Bachkovo.

**Other** - Jasná (Slovakia), Poiana Brașov and Predeal (Romania).

### Nordic / Arctic
**Finland** - Lapland and other regions including Levi, Ruka, Ylläs, Pyhä, Luosto, Salla, Tahko, Vuokatti, Koli, and Himos.

**Norway & Sweden** - Major Nordic destinations including Trysil, Hemsedal, Geilo, Åre (Sweden), Voss, Norefjell, Hafjell, Kvitfjell, Myrkdalen, and SkiStar Vemdalen (Sweden).

### Europe (Western Alps)
Switzerland and France including Zermatt and Chamonix.

## Setup & Usage

### Prerequisites
- A modern web browser (Chrome, Firefox, Safari, Edge)
- No build tools or dependencies required!

### Running Locally

1. **Clone or download this repository**

2. **Open the HTML file**
   - Simply open `index.html` in your web browser
   - Or use a local web server:
     ```bash
     # Using Python 3
     python -m http.server 8000
     
     # Using Node.js (if you have http-server installed)
     npx http-server
     
     # Using PHP
     php -S localhost:8000
     ```
   - Then navigate to `http://localhost:8000` in your browser

3. **That's it!** The page will automatically fetch and display snowfall data.

### Manual Refresh

Click the "Refresh Data" button in the header to manually update all resort data.

### Filtering & Searching

- **Region Filter**: Use the dropdown to filter by region (North America, Asia / Far East, South America, Oceania, Eastern Europe / Balkans, Nordic / Arctic, or Europe)
- **Filter Chips**: Active filters appear as removable chips below the filter bar
- **Search**: Type in the search box to filter by resort name, region, state, or country
- **Sort**: Choose how to sort resorts (by name, 24h snowfall, 7-day total, or most recent update)

## API Information

This project uses the [Open-Meteo API](https://open-meteo.com/), which provides:
- Free access (no API key required)
- Weather data aggregated from national weather services
- Forecast data for any location worldwide

### API Endpoint Used
```
https://api.open-meteo.com/v1/forecast
```

### Parameters
- `latitude` & `longitude`: Resort coordinates
- `hourly=snowfall`: Hourly snowfall data
- `daily=snowfall_sum`: Daily snowfall totals
- `daily=snowfall_depth`: Current snow depth
- `timezone`: Automatically determined based on location
- `forecast_days=7`: 7-day forecast period

### Data Units
- API returns snowfall in millimeters (mm)
- The app automatically converts to inches for display
- Conversion: 1 inch = 25.4 mm

## File Structure

```
Snowfall/
├── index.html      # Main HTML page with structure and TailwindCSS
├── app.js          # JavaScript logic for API fetching and rendering
└── README.md       # This file
```

## Browser Compatibility

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Limitations

- Data is fetched fresh on each page load (no persistent storage)
- Requires an active internet connection
- API rate limits: Open-Meteo allows up to 10,000 requests per day for free use
- Snow depth data may not always be available for all locations

## Customization

### Adding More Resorts

Edit the `resorts` array in `app.js` and add a new object:

```javascript
{ 
    name: 'Resort Name', 
    state: 'State',        // Optional, for US resorts
    country: 'Country',    // Required for international resorts
    region: 'Region',      // Geographic region name
    lat: 39.1234, 
    lon: -106.5678 
}
```

**Important**: Make sure to add the resort's website URL to the `resortWebsites` object if you want a direct link. The app will fall back to a Google search if no URL is provided.

### Styling

The page uses TailwindCSS via CDN. You can customize colors, spacing, and layout by modifying the Tailwind classes in `index.html` and `app.js`.

## License

This project is open source and available for personal and educational use.

## Credits

- Weather data provided by [Open-Meteo](https://open-meteo.com/)
- Styled with [TailwindCSS](https://tailwindcss.com/)
- Font: [Inter](https://fonts.google.com/specimen/Inter)

