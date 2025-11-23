// Global state for filtering and sorting
console.log('app.js script loaded');
window.appScriptLoaded = true; // Mark script as loaded immediately (separate from initialization)
// Last updated: 2024

let allResortData = []; // Store all fetched resort data
let currentSearchTerm = '';
let currentSortBy = 'snowfall24h';
let currentRegionFilter = 'all'; // 'all' or specific region name
let sidebarOpen = false; // Sidebar visibility state for mobile
let isFetching = false; // Flag to prevent multiple simultaneous fetches

// Resort data with coordinates for worldwide ski resorts
const resorts = [
    // North America - United States
    // Colorado
    { name: 'Vail', state: 'Colorado', country: 'United States', region: 'Rocky Mountains', lat: 39.6061, lon: -106.3550 },
    { name: 'Aspen', state: 'Colorado', country: 'United States', region: 'Rocky Mountains', lat: 39.1911, lon: -106.8175 },
    { name: 'Breckenridge', state: 'Colorado', country: 'United States', region: 'Rocky Mountains', lat: 39.4817, lon: -106.0384 },
    { name: 'Keystone', state: 'Colorado', country: 'United States', region: 'Rocky Mountains', lat: 39.6042, lon: -105.9450 },
    
    // Utah
    { name: 'Park City', state: 'Utah', country: 'United States', region: 'Wasatch Range', lat: 40.6461, lon: -111.4980 },
    { name: 'Alta', state: 'Utah', country: 'United States', region: 'Wasatch Range', lat: 40.5886, lon: -111.6378 },
    { name: 'Snowbird', state: 'Utah', country: 'United States', region: 'Wasatch Range', lat: 40.5819, lon: -111.6558 },
    
    // California
    { name: 'Mammoth Mountain', state: 'California', country: 'United States', region: 'Sierra Nevada', lat: 37.6308, lon: -119.0326 },
    { name: 'Palisades Tahoe', state: 'California', country: 'United States', region: 'Sierra Nevada', lat: 39.1967, lon: -120.2353 },
    { name: 'Heavenly', state: 'California', country: 'United States', region: 'Sierra Nevada', lat: 38.9399, lon: -119.9772 },
    { name: 'Northstar', state: 'California', country: 'United States', region: 'Sierra Nevada', lat: 39.2750, lon: -120.1267 },
    { name: 'Sugar Bowl', state: 'California', country: 'United States', region: 'Sierra Nevada', lat: 39.3017, lon: -120.3250 },
    { name: 'Kirkwood', state: 'California', country: 'United States', region: 'Sierra Nevada', lat: 38.7017, lon: -120.0717 },
    { name: 'Sierra at Tahoe', state: 'California', country: 'United States', region: 'Sierra Nevada', lat: 38.8000, lon: -120.0817 },
    { name: 'Boreal Mountain Resort', state: 'California', country: 'United States', region: 'Sierra Nevada', lat: 39.3267, lon: -120.3517 },
    
    // Nevada
    { name: 'Diamond Peak', state: 'Nevada', country: 'United States', region: 'Sierra Nevada', lat: 39.2500, lon: -119.9167 },
    { name: 'Mount Rose', state: 'Nevada', country: 'United States', region: 'Sierra Nevada', lat: 39.3333, lon: -119.8833 },
    
    // Wyoming
    { name: 'Jackson Hole', state: 'Wyoming', country: 'United States', region: 'Teton Range', lat: 43.5874, lon: -110.8278 },
    
    // Vermont
    { name: 'Stowe', state: 'Vermont', country: 'United States', region: 'Green Mountains', lat: 44.4653, lon: -72.7025 },
    
    // New Hampshire
    { name: 'Bretton Woods', state: 'New Hampshire', country: 'United States', region: 'White Mountains', lat: 44.2581, lon: -71.4414 },
    
    // Montana
    { name: 'Big Sky', state: 'Montana', country: 'United States', region: 'Rocky Mountains', lat: 45.2847, lon: -111.4003 },
    
    // Oregon
    { name: 'Mt. Bachelor', state: 'Oregon', country: 'United States', region: 'Cascade Range', lat: 44.003, lon: -121.677 },
    { name: 'Mt. Hood Meadows', state: 'Oregon', country: 'United States', region: 'Cascade Range', lat: 45.332, lon: -121.665 },
    { name: 'Timberline Lodge', state: 'Oregon', country: 'United States', region: 'Cascade Range', lat: 45.331, lon: -121.710 },
    { name: 'Mt. Hood Skibowl', state: 'Oregon', country: 'United States', region: 'Cascade Range', lat: 45.303, lon: -121.775 },
    { name: 'Summit Pass (Summit Ski Area)', state: 'Oregon', country: 'United States', region: 'Cascade Range', lat: 45.304, lon: -121.755 },
    { name: 'Cooper Spur Mountain Resort', state: 'Oregon', country: 'United States', region: 'Cascade Range', lat: 45.426, lon: -121.624 },
    { name: 'Hoodoo', state: 'Oregon', country: 'United States', region: 'Cascade Range', lat: 44.407, lon: -121.872 },
    { name: 'Willamette Pass', state: 'Oregon', country: 'United States', region: 'Cascade Range', lat: 43.599, lon: -122.036 },
    { name: 'Mt. Ashland', state: 'Oregon', country: 'United States', region: 'Cascade Range', lat: 42.081, lon: -122.704 },
    { name: 'Anthony Lakes Mountain Resort', state: 'Oregon', country: 'United States', region: 'Cascade Range', lat: 44.957, lon: -118.233 },
    { name: 'Warner Canyon', state: 'Oregon', country: 'United States', region: 'Cascade Range', lat: 42.188, lon: -120.374 },
    { name: 'Ferguson Ridge (Fergi)', state: 'Oregon', country: 'United States', region: 'Cascade Range', lat: 45.350, lon: -117.217 },
    
    // North America - Canada
    { name: 'Whistler', country: 'Canada', region: 'Coast Mountains', lat: 50.1163, lon: -122.9574 },
    { name: 'Banff / Lake Louise', country: 'Canada', region: 'Canadian Rockies', lat: 51.4254, lon: -116.1773 },
    { name: 'Revelstoke', country: 'Canada', region: 'Selkirk Mountains', lat: 50.9581, lon: -118.1953 },
    { name: 'Fernie', country: 'Canada', region: 'Canadian Rockies', lat: 49.4628, lon: -115.0625 },
    { name: 'Big White', country: 'Canada', region: 'Okanagan', lat: 49.7200, lon: -119.1000 },
    { name: 'Sun Peaks', country: 'Canada', region: 'Thompson Okanagan', lat: 50.8833, lon: -119.8833 },
    { name: 'Red Mountain', country: 'Canada', region: 'Kootenay Rockies', lat: 49.1000, lon: -117.8167 },
    { name: 'Kicking Horse', country: 'Canada', region: 'Canadian Rockies', lat: 51.3000, lon: -117.0500 },
    { name: 'Mont Tremblant', country: 'Canada', region: 'Laurentian Mountains', lat: 46.2125, lon: -74.5847 },
    { name: 'Blue Mountain', country: 'Canada', region: 'Blue Mountains', lat: 44.5000, lon: -80.3333 },
    { name: 'Panorama', country: 'Canada', region: 'Canadian Rockies', lat: 50.4667, lon: -116.2333 },
    { name: 'Silver Star', country: 'Canada', region: 'Okanagan', lat: 50.3667, lon: -119.0667 },
    
    // Europe - Western Alps
    { name: 'Zermatt', country: 'Switzerland', region: 'Swiss Alps', lat: 46.0207, lon: 7.7491 },
    { name: 'Chamonix', country: 'France', region: 'French Alps', lat: 45.9237, lon: 6.8694 },
    
    // Asia / Far East - Japan
    { name: 'Niseko', country: 'Japan', region: 'Hokkaido', lat: 42.8048, lon: 140.6875 },
    { name: 'Hakuba Valley', country: 'Japan', region: 'Japanese Alps', lat: 36.6989, lon: 137.8422 },
    { name: 'Rusutsu', country: 'Japan', region: 'Hokkaido', lat: 42.7500, lon: 140.8833 },
    { name: 'Furano', country: 'Japan', region: 'Hokkaido', lat: 43.3333, lon: 142.3833 },
    { name: 'Nozawa Onsen', country: 'Japan', region: 'Japanese Alps', lat: 36.9167, lon: 138.4333 },
    { name: 'Myoko Kogen', country: 'Japan', region: 'Japanese Alps', lat: 36.8833, lon: 138.1167 },
    { name: 'Shiga Kogen', country: 'Japan', region: 'Japanese Alps', lat: 36.7000, lon: 138.5000 },
    { name: 'Appi Kogen', country: 'Japan', region: 'Tohoku', lat: 40.0167, lon: 140.9500 },
    { name: 'Zao Onsen', country: 'Japan', region: 'Tohoku', lat: 38.7167, lon: 140.4500 },
    { name: 'Kiroro', country: 'Japan', region: 'Hokkaido', lat: 42.9500, lon: 140.8167 },
    { name: 'Tomamu', country: 'Japan', region: 'Hokkaido', lat: 43.0500, lon: 142.6333 },
    { name: 'Naeba', country: 'Japan', region: 'Japanese Alps', lat: 36.8167, lon: 138.8167 },
    
    // Asia / Far East - South Korea
    { name: 'Yongpyong', country: 'South Korea', region: 'Gangwon', lat: 37.6500, lon: 128.6833 },
    { name: 'Alpensia', country: 'South Korea', region: 'Gangwon', lat: 37.6667, lon: 128.7000 },
    { name: 'High1', country: 'South Korea', region: 'Gangwon', lat: 37.2000, lon: 128.8333 },
    { name: 'Phoenix Park', country: 'South Korea', region: 'Gangwon', lat: 37.4833, lon: 128.3333 },
    { name: 'Vivaldi Park', country: 'South Korea', region: 'Gangwon', lat: 37.6500, lon: 127.7167 },
    { name: 'Elysian Gangchon', country: 'South Korea', region: 'Gangwon', lat: 37.7333, lon: 127.6167 },
    { name: 'Welli Hilli Park', country: 'South Korea', region: 'Gangwon', lat: 37.4667, lon: 128.3167 },
    { name: 'Oak Valley', country: 'South Korea', region: 'Gangwon', lat: 37.4167, lon: 127.7333 },
    { name: 'Jisan Forest', country: 'South Korea', region: 'Gyeonggi', lat: 37.2333, lon: 127.2833 },
    { name: 'Daemyung Vivaldi Park', country: 'South Korea', region: 'Gangwon', lat: 37.6500, lon: 127.7167 },
    
    // South America - Chile
    { name: 'Valle Nevado', country: 'Chile', region: 'Andes', lat: -33.3500, lon: -70.3167 },
    { name: 'Portillo', country: 'Chile', region: 'Andes', lat: -32.8333, lon: -70.1333 },
    { name: 'La Parva', country: 'Chile', region: 'Andes', lat: -33.3500, lon: -70.3000 },
    { name: 'El Colorado', country: 'Chile', region: 'Andes', lat: -33.3500, lon: -70.2833 },
    { name: 'Nevados de Chillán', country: 'Chile', region: 'Andes', lat: -36.9000, lon: -71.4000 },
    { name: 'Corralco', country: 'Chile', region: 'Andes', lat: -38.6500, lon: -71.5833 },
    { name: 'Antillanca', country: 'Chile', region: 'Andes', lat: -40.6833, lon: -72.1667 },
    { name: 'Termas de Chillán', country: 'Chile', region: 'Andes', lat: -36.9000, lon: -71.4000 },
    { name: 'Valle Las Trancas', country: 'Chile', region: 'Andes', lat: -36.9167, lon: -71.4167 },
    { name: 'Farellones', country: 'Chile', region: 'Andes', lat: -33.3500, lon: -70.3167 },
    
    // South America - Argentina
    { name: 'Las Leñas', country: 'Argentina', region: 'Andes', lat: -35.1333, lon: -70.0833 },
    { name: 'Cerro Catedral', country: 'Argentina', region: 'Patagonia', lat: -41.1667, lon: -71.4333 },
    { name: 'Chapelco', country: 'Argentina', region: 'Patagonia', lat: -40.2000, lon: -71.3167 },
    { name: 'La Hoya', country: 'Argentina', region: 'Patagonia', lat: -42.6833, lon: -71.3167 },
    { name: 'Cerro Castor', country: 'Argentina', region: 'Tierra del Fuego', lat: -54.7167, lon: -67.8167 },
    { name: 'Valle de Las Leñas', country: 'Argentina', region: 'Andes', lat: -35.1333, lon: -70.0833 },
    { name: 'Cerro Bayo', country: 'Argentina', region: 'Patagonia', lat: -40.7333, lon: -71.5500 },
    { name: 'Caviahue', country: 'Argentina', region: 'Patagonia', lat: -37.8500, lon: -71.0167 },
    { name: 'Cerro Otto', country: 'Argentina', region: 'Patagonia', lat: -41.1333, lon: -71.3167 },
    { name: 'Cerro Perito Moreno', country: 'Argentina', region: 'Patagonia', lat: -41.0833, lon: -71.3167 },
    
    // Oceania - Australia
    { name: 'Perisher', country: 'Australia', region: 'Snowy Mountains', lat: -36.4000, lon: 148.4000 },
    { name: 'Thredbo', country: 'Australia', region: 'Snowy Mountains', lat: -36.5000, lon: 148.3167 },
    { name: 'Falls Creek', country: 'Australia', region: 'Victorian Alps', lat: -36.8667, lon: 147.2833 },
    { name: 'Mount Hotham', country: 'Australia', region: 'Victorian Alps', lat: -37.0500, lon: 147.1333 },
    { name: 'Mount Buller', country: 'Australia', region: 'Victorian Alps', lat: -37.1500, lon: 146.4333 },
    { name: 'Charlotte Pass', country: 'Australia', region: 'Snowy Mountains', lat: -36.4333, lon: 148.3167 },
    { name: 'Selwyn Snowfields', country: 'Australia', region: 'Snowy Mountains', lat: -36.3833, lon: 148.4167 },
    { name: 'Mount Selwyn', country: 'Australia', region: 'Snowy Mountains', lat: -36.3833, lon: 148.4167 },
    { name: 'Mount Baw Baw', country: 'Australia', region: 'Victorian Alps', lat: -37.8333, lon: 146.2667 },
    { name: 'Ben Lomond', country: 'Australia', region: 'Tasmania', lat: -41.5167, lon: 147.6167 },
    
    // Oceania - New Zealand
    { name: 'The Remarkables', country: 'New Zealand', region: 'Southern Alps', lat: -45.0167, lon: 168.8000 },
    { name: 'Coronet Peak', country: 'New Zealand', region: 'Southern Alps', lat: -45.0167, lon: 168.8000 },
    { name: 'Cardrona', country: 'New Zealand', region: 'Southern Alps', lat: -44.8667, lon: 169.0167 },
    { name: 'Treble Cone', country: 'New Zealand', region: 'Southern Alps', lat: -44.7333, lon: 168.9167 },
    { name: 'Mount Ruapehu', country: 'New Zealand', region: 'Central Plateau', lat: -39.2833, lon: 175.5667 },
    { name: 'Turoa', country: 'New Zealand', region: 'Central Plateau', lat: -39.2833, lon: 175.5667 },
    { name: 'Whakapapa', country: 'New Zealand', region: 'Central Plateau', lat: -39.2000, lon: 175.5500 },
    { name: 'Mount Hutt', country: 'New Zealand', region: 'Southern Alps', lat: -43.5167, lon: 171.5167 },
    { name: 'Ohau', country: 'New Zealand', region: 'Southern Alps', lat: -44.2167, lon: 169.8500 },
    { name: 'Roundhill', country: 'New Zealand', region: 'Southern Alps', lat: -43.8833, lon: 170.1167 },
    
    // Eastern Europe / Balkans - Slovenia
    { name: 'Kranjska Gora', country: 'Slovenia', region: 'Julian Alps', lat: 46.4833, lon: 13.7833 },
    { name: 'Vogel', country: 'Slovenia', region: 'Julian Alps', lat: 46.2667, lon: 13.8333 },
    { name: 'Krvavec', country: 'Slovenia', region: 'Kamnik-Savinja Alps', lat: 46.3000, lon: 14.5500 },
    { name: 'Rogla', country: 'Slovenia', region: 'Pohorje', lat: 46.4500, lon: 15.3333 },
    { name: 'Mariborsko Pohorje', country: 'Slovenia', region: 'Pohorje', lat: 46.5000, lon: 15.6500 },
    { name: 'Cerkno', country: 'Slovenia', region: 'Julian Alps', lat: 46.1167, lon: 13.9833 },
    { name: 'Kanin', country: 'Slovenia', region: 'Julian Alps', lat: 46.3167, lon: 13.4333 },
    
    // Eastern Europe / Balkans - Bulgaria
    { name: 'Bansko', country: 'Bulgaria', region: 'Pirin Mountains', lat: 41.8333, lon: 23.4833 },
    { name: 'Borovets', country: 'Bulgaria', region: 'Rila Mountains', lat: 42.2667, lon: 23.6000 },
    { name: 'Pamporovo', country: 'Bulgaria', region: 'Rhodope Mountains', lat: 41.6667, lon: 24.6833 },
    { name: 'Vitosha', country: 'Bulgaria', region: 'Vitosha', lat: 42.5667, lon: 23.2833 },
    { name: 'Chepelare', country: 'Bulgaria', region: 'Rhodope Mountains', lat: 41.7333, lon: 24.6833 },
    { name: 'Bachkovo', country: 'Bulgaria', region: 'Rhodope Mountains', lat: 41.9333, lon: 24.8500 },
    
    // Eastern Europe / Balkans - Other
    { name: 'Jasná', country: 'Slovakia', region: 'Low Tatras', lat: 48.9500, lon: 19.6167 },
    { name: 'Poiana Brașov', country: 'Romania', region: 'Carpathians', lat: 45.6000, lon: 25.5667 },
    { name: 'Predeal', country: 'Romania', region: 'Carpathians', lat: 45.5000, lon: 25.5667 },
    
    // Nordic / Arctic - Finland
    { name: 'Levi', country: 'Finland', region: 'Lapland', lat: 67.8000, lon: 24.8000 },
    { name: 'Ruka', country: 'Finland', region: 'Kuusamo', lat: 66.1667, lon: 29.1333 },
    { name: 'Ylläs', country: 'Finland', region: 'Lapland', lat: 67.5667, lon: 24.2167 },
    { name: 'Pyhä', country: 'Finland', region: 'Lapland', lat: 67.0167, lon: 27.2167 },
    { name: 'Luosto', country: 'Finland', region: 'Lapland', lat: 67.1333, lon: 27.0167 },
    { name: 'Salla', country: 'Finland', region: 'Lapland', lat: 66.8333, lon: 28.6667 },
    { name: 'Tahko', country: 'Finland', region: 'Northern Savonia', lat: 63.2667, lon: 27.6667 },
    { name: 'Vuokatti', country: 'Finland', region: 'Kainuu', lat: 64.1333, lon: 28.2167 },
    { name: 'Koli', country: 'Finland', region: 'North Karelia', lat: 63.0833, lon: 29.8167 },
    { name: 'Himos', country: 'Finland', region: 'Central Finland', lat: 61.8167, lon: 25.3167 },
    
    // Nordic / Arctic - Norway
    { name: 'Trysil', country: 'Norway', region: 'Eastern Norway', lat: 61.3167, lon: 12.2667 },
    { name: 'Hemsedal', country: 'Norway', region: 'Eastern Norway', lat: 60.8667, lon: 8.5167 },
    { name: 'Geilo', country: 'Norway', region: 'Eastern Norway', lat: 60.5333, lon: 8.2167 },
    { name: 'Åre', country: 'Sweden', region: 'Jämtland', lat: 63.4000, lon: 13.0833 },
    { name: 'Voss', country: 'Norway', region: 'Western Norway', lat: 60.6333, lon: 6.4167 },
    { name: 'Norefjell', country: 'Norway', region: 'Eastern Norway', lat: 60.2167, lon: 9.2167 },
    { name: 'Hafjell', country: 'Norway', region: 'Eastern Norway', lat: 61.2167, lon: 10.4667 },
    { name: 'Kvitfjell', country: 'Norway', region: 'Eastern Norway', lat: 61.1833, lon: 10.3833 },
    { name: 'Myrkdalen', country: 'Norway', region: 'Western Norway', lat: 60.7833, lon: 6.8333 },
    { name: 'SkiStar Vemdalen', country: 'Sweden', region: 'Härjedalen', lat: 62.4333, lon: 13.8667 }
];

// Convert mm to inches
function mmToInches(mm) {
    return (mm / 25.4).toFixed(1);
}

// Format relative time
function formatRelativeTime(timestamp) {
    const now = new Date();
    const updateTime = new Date(timestamp);
    const diffMs = now - updateTime;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
}

// Format timestamp
function formatTimestamp(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    });
}

// Resort website URLs mapping
const resortWebsites = {
    // North America - United States
    'Vail': 'https://www.vail.com',
    'Aspen': 'https://www.aspensnowmass.com',
    'Breckenridge': 'https://www.breckenridge.com',
    'Keystone': 'https://www.keystoneresort.com',
    'Park City': 'https://www.parkcitymountain.com',
    'Alta': 'https://www.alta.com',
    'Snowbird': 'https://www.snowbird.com',
    'Mammoth Mountain': 'https://www.mammothmountain.com',
    'Palisades Tahoe': 'https://www.palisadestahoe.com',
    'Heavenly': 'https://www.skiheavenly.com',
    'Northstar': 'https://www.northstarcalifornia.com',
    'Sugar Bowl': 'https://www.sugarbowl.com',
    'Kirkwood': 'https://www.kirkwood.com',
    'Sierra at Tahoe': 'https://www.sierraattahoe.com',
    'Boreal Mountain Resort': 'https://www.borealski.com',
    'Diamond Peak': 'https://www.diamondpeak.com',
    'Mount Rose': 'https://www.skirose.com',
    'Jackson Hole': 'https://www.jacksonhole.com',
    'Stowe': 'https://www.stowe.com',
    'Bretton Woods': 'https://www.brettonwoods.com',
    'Big Sky': 'https://www.bigskyresort.com',
    
    // Oregon
    'Mt. Bachelor': 'https://www.mtbachelor.com',
    'Mt. Hood Meadows': 'https://www.skihood.com',
    'Timberline Lodge': 'https://www.timberlinelodge.com',
    'Mt. Hood Skibowl': 'https://www.skibowl.com',
    'Summit Pass (Summit Ski Area)': 'https://www.timberlinelodge.com/mountain/summit-pass',
    'Cooper Spur Mountain Resort': 'https://www.cooperspur.com',
    'Hoodoo': 'https://www.hoodoo.com',
    'Willamette Pass': 'https://www.willamettepass.ski',
    'Mt. Ashland': 'https://www.mtashland.com',
    'Anthony Lakes Mountain Resort': 'https://www.anthonylakes.com',
    'Warner Canyon': 'https://www.lakecountychamber.org/skihill.html',
    'Ferguson Ridge (Fergi)': 'https://www.skifergi.com',
    
    // North America - Canada
    'Whistler': 'https://www.whistlerblackcomb.com',
    'Banff / Lake Louise': 'https://www.skilouise.com',
    'Revelstoke': 'https://www.revelstokemountainresort.com',
    'Fernie': 'https://www.skifernie.com',
    'Big White': 'https://www.bigwhite.com',
    'Sun Peaks': 'https://www.sunpeaksresort.com',
    'Red Mountain': 'https://www.redresort.com',
    'Kicking Horse': 'https://www.kickinghorseresort.com',
    'Mont Tremblant': 'https://www.tremblant.ca',
    'Blue Mountain': 'https://www.bluemountain.ca',
    'Panorama': 'https://www.panoramaresort.com',
    'Silver Star': 'https://www.skisilverstar.com',
    
    // Europe
    'Zermatt': 'https://www.zermatt.ch',
    'Chamonix': 'https://www.chamonix.com',
    
    // Asia / Far East - Japan
    'Niseko': 'https://www.niseko.ne.jp',
    'Hakuba Valley': 'https://www.hakubavalley.com',
    'Rusutsu': 'https://www.rusutsu.co.jp',
    'Furano': 'https://www.furanotourism.com',
    'Nozawa Onsen': 'https://www.nozawaski.com',
    'Myoko Kogen': 'https://www.myokokogen.net',
    'Shiga Kogen': 'https://www.shigakogen.gr.jp',
    'Appi Kogen': 'https://www.appi.co.jp',
    'Zao Onsen': 'https://www.zao-spa.or.jp',
    'Kiroro': 'https://www.kiroro.co.jp',
    'Tomamu': 'https://www.snowtomamu.jp',
    'Naeba': 'https://www.princehotels.com/naeba',
    
    // Asia / Far East - South Korea
    'Yongpyong': 'https://www.yongpyong.co.kr',
    'Alpensia': 'https://www.alpensiaresort.co.kr',
    'High1': 'https://www.high1.com',
    'Phoenix Park': 'https://www.phoenixpark.co.kr',
    'Vivaldi Park': 'https://www.vivaldipark.com',
    'Elysian Gangchon': 'https://www.elysian.co.kr',
    'Welli Hilli Park': 'https://www.wellihillipark.com',
    'Oak Valley': 'https://www.oakvalley.co.kr',
    'Jisan Forest': 'https://www.jisanresort.co.kr',
    'Daemyung Vivaldi Park': 'https://www.vivaldipark.com',
    
    // South America - Chile
    'Valle Nevado': 'https://www.vallenevado.com',
    'Portillo': 'https://www.skiportillo.com',
    'La Parva': 'https://www.laparva.cl',
    'El Colorado': 'https://www.elcolorado.cl',
    'Nevados de Chillán': 'https://www.nevadosdechillan.com',
    'Corralco': 'https://www.corralco.com',
    'Antillanca': 'https://www.antillanca.cl',
    'Termas de Chillán': 'https://www.termasdechillan.cl',
    'Valle Las Trancas': 'https://www.vallelastrancas.cl',
    'Farellones': 'https://www.farellones.cl',
    
    // South America - Argentina
    'Las Leñas': 'https://www.laslenas.com',
    'Cerro Catedral': 'https://www.catedralaltapatagonia.com',
    'Chapelco': 'https://www.chapelco.com',
    'La Hoya': 'https://www.lahoya.com.ar',
    'Cerro Castor': 'https://www.cerrocastor.com',
    'Valle de Las Leñas': 'https://www.laslenas.com',
    'Cerro Bayo': 'https://www.cerrobayo.com.ar',
    'Caviahue': 'https://www.caviahue.com',
    'Cerro Otto': 'https://www.cerrootto.com',
    'Cerro Perito Moreno': 'https://www.cerroperitomoreno.com',
    
    // Oceania - Australia
    'Perisher': 'https://www.perisher.com.au',
    'Thredbo': 'https://www.thredbo.com.au',
    'Falls Creek': 'https://www.fallscreek.com.au',
    'Mount Hotham': 'https://www.mthotham.com.au',
    'Mount Buller': 'https://www.mtbuller.com.au',
    'Charlotte Pass': 'https://www.charlottepass.com.au',
    'Selwyn Snowfields': 'https://www.selwynsnow.com.au',
    'Mount Selwyn': 'https://www.selwynsnow.com.au',
    'Mount Baw Baw': 'https://www.mountbawbaw.com.au',
    'Ben Lomond': 'https://www.benlomond.org.au',
    
    // Oceania - New Zealand
    'The Remarkables': 'https://www.nzski.com/remarkables',
    'Coronet Peak': 'https://www.nzski.com/coronet-peak',
    'Cardrona': 'https://www.cardrona.com',
    'Treble Cone': 'https://www.treblecone.com',
    'Mount Ruapehu': 'https://www.mtruapehu.com',
    'Turoa': 'https://www.mtruapehu.com/turoa',
    'Whakapapa': 'https://www.mtruapehu.com/whakapapa',
    'Mount Hutt': 'https://www.nzski.com/mount-hutt',
    'Ohau': 'https://www.ohau.co.nz',
    'Roundhill': 'https://www.roundhill.co.nz',
    
    // Eastern Europe / Balkans - Slovenia
    'Kranjska Gora': 'https://www.kranjska-gora.si',
    'Vogel': 'https://www.vogel.si',
    'Krvavec': 'https://www.krvavec.com',
    'Rogla': 'https://www.rogla.si',
    'Mariborsko Pohorje': 'https://www.pohorje.si',
    'Cerkno': 'https://www.cerkno.si',
    'Kanin': 'https://www.kanin.si',
    
    // Eastern Europe / Balkans - Bulgaria
    'Bansko': 'https://www.banskoski.com',
    'Borovets': 'https://www.borovets-bg.com',
    'Pamporovo': 'https://www.pamporovo.me',
    'Vitosha': 'https://www.vitosha.bg',
    'Chepelare': 'https://www.chepelare.bg',
    'Bachkovo': 'https://www.bachkovo.bg',
    
    // Eastern Europe / Balkans - Other
    'Jasná': 'https://www.jasna.sk',
    'Poiana Brașov': 'https://www.poianabrasov.com',
    'Predeal': 'https://www.predeal.ro',
    
    // Nordic / Arctic - Finland
    'Levi': 'https://www.levi.fi',
    'Ruka': 'https://www.ruka.fi',
    'Ylläs': 'https://www.yllas.fi',
    'Pyhä': 'https://www.pyha.fi',
    'Luosto': 'https://www.luosto.fi',
    'Salla': 'https://www.salla.fi',
    'Tahko': 'https://www.tahko.fi',
    'Vuokatti': 'https://www.vuokatti.fi',
    'Koli': 'https://www.koli.fi',
    'Himos': 'https://www.himos.fi',
    
    // Nordic / Arctic - Norway & Sweden
    'Trysil': 'https://www.trysil.com',
    'Hemsedal': 'https://www.hemsedal.com',
    'Geilo': 'https://www.geilo.no',
    'Åre': 'https://www.skistar.com/are',
    'Voss': 'https://www.vossresort.no',
    'Norefjell': 'https://www.norefjell.no',
    'Hafjell': 'https://www.hafjell.no',
    'Kvitfjell': 'https://www.kvitfjell.no',
    'Myrkdalen': 'https://www.myrkdalen.no',
    'SkiStar Vemdalen': 'https://www.skistar.com/vemdalen'
};

// Generate website URL for resort
function generateResortWebsiteUrl(resort) {
    return resortWebsites[resort.name] || `https://www.google.com/search?q=${encodeURIComponent(`${resort.name} ski resort official website`)}`;
}

// Filter resorts by search term (searches name, region, state, and country)
function filterResorts(resorts, searchTerm) {
    if (!searchTerm || searchTerm.trim() === '') {
        return resorts;
    }
    
    const term = searchTerm.toLowerCase().trim();
    return resorts.filter(resort => {
        return resort.name.toLowerCase().includes(term) ||
               resort.region.toLowerCase().includes(term) ||
               (resort.state && resort.state.toLowerCase().includes(term)) ||
               (resort.country && resort.country.toLowerCase().includes(term));
    });
}

// Filter resorts by region category
function filterByRegion(resorts, regionFilter) {
    if (!regionFilter || regionFilter === 'all') {
        return resorts;
    }
    
    return resorts.filter(resort => {
        const category = getRegionCategory(resort);
        return category === regionFilter;
    });
}

// Sort resorts based on selected criteria
function sortResorts(resorts, sortBy) {
    const sorted = [...resorts];
    
    switch (sortBy) {
        case 'name':
            return sorted.sort((a, b) => {
                return a.name.localeCompare(b.name);
            });
        
        case 'snowfall24h':
            return sorted.sort((a, b) => {
                const aVal = a.success ? (a.snowfall24h || 0) : -1;
                const bVal = b.success ? (b.snowfall24h || 0) : -1;
                return bVal - aVal; // Descending (highest first)
            });
        
        case 'snowfall7d':
            return sorted.sort((a, b) => {
                const aVal = a.success ? (a.snowfall7d || 0) : -1;
                const bVal = b.success ? (b.snowfall7d || 0) : -1;
                return bVal - aVal; // Descending (highest first)
            });
        
        case 'lastUpdate':
            return sorted.sort((a, b) => {
                if (!a.success && !b.success) return 0;
                if (!a.success) return 1;
                if (!b.success) return -1;
                const aTime = new Date(a.lastUpdate).getTime();
                const bTime = new Date(b.lastUpdate).getTime();
                return bTime - aTime; // Descending (newest first)
            });
        
        default:
            return sorted;
    }
}

// Helper function to get region category for a resort
function getRegionCategory(resort) {
    const country = resort.country || 'United States';
    
    // North America
    if (country === 'United States' || country === 'Canada') {
        return 'North America';
    }
    
    // Asia / Far East
    if (country === 'Japan' || country === 'South Korea' || country === 'China') {
        return 'Asia / Far East';
    }
    
    // South America
    if (country === 'Chile' || country === 'Argentina') {
        return 'South America';
    }
    
    // Oceania
    if (country === 'Australia' || country === 'New Zealand') {
        return 'Oceania';
    }
    
    // Eastern Europe / Balkans
    if (country === 'Slovenia' || country === 'Bulgaria' || country === 'Slovakia' || country === 'Romania') {
        return 'Eastern Europe / Balkans';
    }
    
    // Nordic / Arctic
    if (country === 'Finland' || country === 'Norway' || country === 'Sweden') {
        return 'Nordic / Arctic';
    }
    
    // Western Europe (Switzerland, France, Austria, Italy, etc.)
    if (country === 'Switzerland' || country === 'France' || country === 'Austria' || country === 'Italy' || 
        country === 'Germany' || country === 'Spain' || country === 'Andorra') {
        return 'Europe';
    }
    
    // Default fallback
    return 'Other';
}

// Group resorts by continent/region
function groupResortsByRegion(resorts) {
    const groups = {
        'North America': [],
        'Asia / Far East': [],
        'South America': [],
        'Oceania': [],
        'Eastern Europe / Balkans': [],
        'Nordic / Arctic': [],
        'Europe': [],
        'Other': []
    };
    
    resorts.forEach(resort => {
        const category = getRegionCategory(resort);
        groups[category].push(resort);
    });
    
    // Return only groups that have resorts, sorted by display order
    const displayOrder = [
        'North America',
        'Asia / Far East',
        'South America',
        'Oceania',
        'Eastern Europe / Balkans',
        'Nordic / Arctic',
        'Europe',
        'Other'
    ];
    
    return displayOrder
        .filter(region => groups[region].length > 0)
        .map(region => ({ region, resorts: groups[region] }));
}

// Apply filters and sort, then render
function applyFiltersAndSort() {
    let filtered = filterByRegion(allResortData, currentRegionFilter);
    filtered = filterResorts(filtered, currentSearchTerm);
    const sorted = sortResorts(filtered, currentSortBy);
    renderResorts(sorted);
    updateFilterChips();
}

// Update filter chips display
function updateFilterChips() {
    const filterChipsContainer = document.getElementById('filterChipsContainer');
    if (!filterChipsContainer) return;
    
    filterChipsContainer.innerHTML = '';
    
    if (currentRegionFilter !== 'all') {
        const chip = document.createElement('div');
        chip.className = 'inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-4 py-2 rounded-full shadow-lg';
        chip.innerHTML = `
            <span class="font-medium">${currentRegionFilter}</span>
            <button 
                onclick="removeRegionFilter()" 
                class="hover:bg-white/20 rounded-full p-1 transition-all"
                aria-label="Remove filter"
            >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
            </button>
        `;
        filterChipsContainer.appendChild(chip);
    }
}

// Remove region filter (global function for onclick handler)
window.removeRegionFilter = function() {
    currentRegionFilter = 'all';
    const regionSelect = document.getElementById('regionSelect');
    if (regionSelect) {
        regionSelect.value = 'all';
    }
    applyFiltersAndSort();
};

// Initialize dark mode (always enabled)
function initDarkMode() {
    const body = document.getElementById('bodyElement');
    body.classList.remove('animated-gradient');
    body.classList.add('animated-gradient-dark');
    body.classList.add('dark');
}

// Fetch snowfall data for a single resort
async function fetchResortData(resort) {
    try {
        const url = `https://api.open-meteo.com/v1/forecast?` +
            `latitude=${resort.lat}&` +
            `longitude=${resort.lon}&` +
            `hourly=snowfall,snow_depth&` +
            `daily=snowfall_sum&` +
            `timezone=auto&` +
            `forecast_days=7`;

        // Add timeout to prevent hanging requests (15 seconds)
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000);
        
        let response;
        try {
            response = await fetch(url, { 
                signal: controller.signal,
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                },
                mode: 'cors',
                cache: 'no-cache',
                credentials: 'omit'
            });
        } catch (fetchError) {
            clearTimeout(timeoutId);
            // Check for CORS or network errors
            if (fetchError.name === 'TypeError' && fetchError.message.includes('fetch')) {
                throw new Error('Network error - CORS or connectivity issue. Check browser console for details.');
            }
            if (fetchError.name === 'AbortError') {
                throw new Error('Request timeout - API took too long to respond');
            }
            throw fetchError;
        }
        clearTimeout(timeoutId);
        if (!response.ok) {
            let errorText = '';
            try {
                errorText = await response.text();
            } catch (e) {
                errorText = `HTTP ${response.status} ${response.statusText}`;
            }
            throw new Error(`HTTP ${response.status}: ${errorText.substring(0, 100)}`);
        }
        
        const data = await response.json();
        
        // Check if API returned an error
        if (data.error) {
            throw new Error(data.reason || `API error: ${data.error}`);
        }
        
        // Validate that we have the expected data structure
        if (!data.hourly || !data.daily) {
            throw new Error('Invalid API response: missing hourly or daily data');
        }
        
        // Calculate 24-hour snowfall (sum of last 24 hours)
        // API returns snowfall in cm, convert to mm for consistency
        const hourlySnowfall = data.hourly.snowfall || [];
        const last24Hours = hourlySnowfall.slice(-24);
        const snowfall24h = last24Hours.reduce((sum, val) => sum + (val || 0), 0) * 10; // cm to mm
        
        // Get 7-day snowfall sum (API returns in cm, convert to mm)
        const dailySnowfall = data.daily.snowfall_sum || [];
        const snowfall7d = dailySnowfall.reduce((sum, val) => sum + (val || 0), 0) * 10; // cm to mm
        
        // Get current snow depth (base depth) from hourly data (most recent)
        // API returns in cm, convert to mm
        const hourlySnowDepth = data.hourly.snow_depth || [];
        const snowDepth = hourlySnowDepth.length > 0 ? hourlySnowDepth[hourlySnowDepth.length - 1] * 10 : null; // cm to mm
        
        // Get last update time (use current time as API doesn't provide exact update time)
        const lastUpdate = new Date().toISOString();
        
        return {
            ...resort,
            snowfall24h: snowfall24h,
            snowfall7d: snowfall7d,
            baseDepth: snowDepth,
            lastUpdate: lastUpdate,
            success: true
        };
    } catch (error) {
        const location = resort.state || resort.country || 'Unknown';
        console.error(`Error fetching data for ${resort.name} (${location}):`, error);
        let errorMessage = error.message || 'Unknown error occurred';
        
        // Handle specific error types
        if (error.name === 'AbortError') {
            errorMessage = 'Request timeout - API took too long to respond';
        } else if (error.name === 'TypeError' && error.message.includes('fetch')) {
            errorMessage = 'Network error - check your internet connection';
        } else if (error.message && error.message.includes('CORS')) {
            errorMessage = 'CORS error - API may not allow requests from this origin';
        } else if (error.message && error.message.includes('Failed to fetch')) {
            errorMessage = 'Network request failed - API may be unavailable';
        }
        
        return {
            ...resort,
            error: errorMessage,
            success: false
        };
    }
}

// Test API connectivity
async function testAPIConnectivity() {
    try {
        const testUrl = 'https://api.open-meteo.com/v1/forecast?latitude=39.6061&longitude=-106.3550&hourly=snowfall&timezone=auto&forecast_days=1';
        
        // Add timeout to connectivity test (10 seconds)
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);
        
        console.log('Testing API connectivity to:', testUrl);
        
        let response;
        try {
            response = await fetch(testUrl, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                },
                mode: 'cors',
                cache: 'no-cache',
                signal: controller.signal,
                credentials: 'omit'
            });
            clearTimeout(timeoutId);
        } catch (fetchError) {
            clearTimeout(timeoutId);
            console.error('Fetch error details:', {
                name: fetchError.name,
                message: fetchError.message,
                stack: fetchError.stack
            });
            if (fetchError.name === 'AbortError') {
                throw new Error('API connectivity test timed out after 10 seconds');
            }
            if (fetchError.message && fetchError.message.includes('Failed to fetch')) {
                throw new Error('Network request failed. This might be a CORS issue or the API is unavailable.');
            }
            throw new Error(`Network error: ${fetchError.message}`);
        }
        
        if (!response.ok) {
            const errorText = await response.text().catch(() => '');
            throw new Error(`API test failed: HTTP ${response.status} ${response.statusText}. ${errorText.substring(0, 100)}`);
        }
        
        const data = await response.json();
        if (data.error) {
            throw new Error(`API error: ${data.reason || data.error}`);
        }
        
        console.log('API connectivity test passed');
        return true;
    } catch (error) {
        console.error('API connectivity test failed:', error);
        console.error('Error details:', {
            name: error.name,
            message: error.message,
            stack: error.stack
        });
        // Log to console for debugging on Vercel
        if (window.location.hostname.includes('vercel.app') || window.location.hostname.includes('vercel.com')) {
            console.error('Running on Vercel - check network tab for CORS errors');
        }
        return false;
    }
}

// Cancel loading function (global for onclick handler)
window.cancelLoading = function() {
    console.log('Loading cancelled by user');
    const loadingState = document.getElementById('loadingState');
    const errorState = document.getElementById('errorState');
    const errorMessage = document.getElementById('errorMessage');
    
    // Reset fetching flag so user can retry
    isFetching = false;
    
    if (loadingState) {
        loadingState.classList.add('hidden');
        loadingState.style.display = 'none';
    }
    if (errorState && errorMessage) {
        errorState.classList.remove('hidden');
        errorMessage.textContent = 'Loading was cancelled. Please refresh to try again.';
    }
    
    // Render whatever data we have so far
    if (allResortData && allResortData.length > 0) {
        applyFiltersAndSort();
    }
};

// Cache management
const CACHE_KEY = 'snowfall_resort_data';
const CACHE_TIMESTAMP_KEY = 'snowfall_cache_timestamp';
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour in milliseconds

function getCachedData() {
    try {
        const timestamp = localStorage.getItem(CACHE_TIMESTAMP_KEY);
        const data = localStorage.getItem(CACHE_KEY);
        
        if (!timestamp || !data) return null;
        
        const cacheAge = Date.now() - parseInt(timestamp);
        if (cacheAge > CACHE_DURATION) {
            return null; // Cache expired
        }
        
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading cache:', error);
        return null;
    }
}

function setCachedData(data) {
    try {
        localStorage.setItem(CACHE_KEY, JSON.stringify(data));
        localStorage.setItem(CACHE_TIMESTAMP_KEY, Date.now().toString());
    } catch (error) {
        console.error('Error saving cache:', error);
    }
}

// Fetch data for all resorts (make it globally accessible for retry button)
window.fetchAllResorts = async function(showLoadingUI = true) {
    // Prevent multiple simultaneous fetches
    if (isFetching) {
        console.log('Fetch already in progress, skipping duplicate call');
        return;
    }
    
    isFetching = true;
    
    const loadingState = document.getElementById('loadingState');
    const errorState = document.getElementById('errorState');
    const errorMessage = document.getElementById('errorMessage');
    const resortsContainer = document.getElementById('resortsContainer');
    const lastUpdate = document.getElementById('lastUpdate');
    const cancelBtn = document.getElementById('cancelLoadingBtn');
    
    // Validate required elements exist
    if (!loadingState || !errorState || !errorMessage || !resortsContainer) {
        console.error('Required DOM elements not found');
        isFetching = false;
        return;
    }
    
    // Show loading state only if showLoadingUI is true
    if (showLoadingUI) {
        loadingState.classList.remove('hidden');
        loadingState.style.display = '';
        errorState.classList.add('hidden');
        resortsContainer.innerHTML = '';
        
        // Show cancel button after 30 seconds
        if (cancelBtn) {
            cancelBtn.classList.add('hidden');
            setTimeout(() => {
                if (cancelBtn && loadingState && !loadingState.classList.contains('hidden')) {
                    cancelBtn.classList.remove('hidden');
                }
            }, 30000);
        }
    }
    
    console.log(`Starting to fetch data for ${resorts.length} resorts...`);
    
    // Update loading progress (only if showing loading UI)
    const loadingProgress = document.getElementById('loadingProgress');
    const updateProgress = (message) => {
        if (showLoadingUI && loadingProgress) {
            loadingProgress.textContent = message;
        }
        console.log(message);
    };
    
    if (showLoadingUI) {
        updateProgress(`Testing API connectivity...`);
    }
    
    // Declare results outside try block so timeout callback can access it
    let results = [];
    
    // Set a global timeout to prevent infinite loading (2 minutes max)
    let globalTimeout = setTimeout(() => {
        console.error('Global timeout reached - aborting fetch');
        if (showLoadingUI) {
            if (loadingState) {
                loadingState.classList.add('hidden');
                loadingState.style.display = 'none';
            }
            if (errorState) {
                errorState.classList.remove('hidden');
            }
            if (errorMessage) {
                errorMessage.textContent = 'Request timed out. The API may be slow or unavailable. Please try refreshing the page.';
            }
        }
        // Render whatever data we have so far
        if (results && results.length > 0) {
            allResortData = results;
            applyFiltersAndSort();
        }
    }, 120000); // 2 minutes
    
    try {
        // Test API connectivity first
        updateProgress('Testing API connectivity...');
        console.log('Starting API connectivity test...');
        
        try {
            const apiAvailable = await testAPIConnectivity();
            if (!apiAvailable) {
                clearTimeout(globalTimeout);
                isFetching = false;
                if (showLoadingUI) {
                    if (loadingState) {
                        loadingState.classList.add('hidden');
                        loadingState.style.display = 'none';
                    }
                    errorState.classList.remove('hidden');
                    errorMessage.innerHTML = 'Unable to connect to the weather API.<br><br>Possible causes:<br>• CORS policy blocking requests<br>• API temporarily unavailable<br>• Network connectivity issues<br><br>Please check the browser console (F12) for detailed error messages.<br><br><button onclick="fetchAllResorts(true)" class="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg">Retry</button>';
                }
                console.error('API connectivity test failed - aborting fetch');
                updateProgress('API test failed');
                return;
            }
        } catch (testError) {
            clearTimeout(globalTimeout);
            isFetching = false;
            if (showLoadingUI) {
                if (loadingState) {
                    loadingState.classList.add('hidden');
                    loadingState.style.display = 'none';
                }
                errorState.classList.remove('hidden');
                errorMessage.innerHTML = `Error during API connectivity test: ${testError.message}<br><br>Check the browser console (F12) for more details.<br><br><button onclick="fetchAllResorts(true)" class="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg">Retry</button>`;
            }
            console.error('Exception during API connectivity test:', testError);
            updateProgress('API test error');
            return;
        }
        
        updateProgress('API test passed. Starting to fetch resort data...');
        
        // Fetch resorts concurrently with controlled concurrency
        // Use a pool of concurrent requests (40 concurrent requests)
        const concurrencyLimit = 40;
        results = [];
        let completedCount = 0;
        const totalResorts = resorts.length;
        
        // Helper function to update progress with completion count
        const updateProgressCount = () => {
            const percentage = Math.round((completedCount / totalResorts) * 100);
            updateProgress(`Fetching resorts... (${completedCount}/${totalResorts} completed, ${percentage}%)`);
        };
        
        // Array to store results in order
        const resultsArray = new Array(totalResorts);
        
        // Process resorts with controlled concurrency
        const processResort = async (index) => {
            try {
                const result = await fetchResortData(resorts[index]);
                resultsArray[index] = result;
            } catch (error) {
                resultsArray[index] = {
                    ...resorts[index],
                    error: error.message || 'Unknown error',
                    success: false
                };
            } finally {
                completedCount++;
                updateProgressCount();
            }
        };
        
        // Create concurrent workers
        const workers = [];
        let currentIndex = 0;
        
        // Start initial batch of concurrent requests
        for (let i = 0; i < Math.min(concurrencyLimit, totalResorts); i++) {
            const worker = (async () => {
                while (currentIndex < totalResorts) {
                    const index = currentIndex++;
                    if (index < totalResorts) {
                        await processResort(index);
                    }
                }
            })();
            workers.push(worker);
        }
        
        // Wait for all workers to complete
        await Promise.all(workers);
        
        // Convert results array to results array (maintain order)
        results = resultsArray;
        
        clearTimeout(globalTimeout);
        
        const successCount = results.filter(r => r.success).length;
        const errorCount = results.filter(r => !r.success).length;
        
        if (showLoadingUI) {
            updateProgress(`Completed! ${successCount} successful, ${errorCount} errors`);
        }
        
        // Save to cache after successful fetch
        setCachedData(results);
        
        // Hide loading state only if we showed it
        if (showLoadingUI) {
            console.log('Hiding loading state...');
            if (loadingState) {
                loadingState.classList.add('hidden');
                loadingState.style.display = 'none';
                console.log('Loading state hidden successfully');
            } else {
                console.error('Loading state element not found!');
            }
            
            // Hide cancel button
            if (cancelBtn) {
                cancelBtn.classList.add('hidden');
            }
        }
        
        console.log(`Completed fetching data. Success: ${successCount}, Errors: ${errorCount}`);
        
        // Check for errors (only show error state if showing loading UI, or if it's a critical error)
        const errors = results.filter(r => !r.success);
        if (errors.length > 0 && showLoadingUI) {
            errorState.classList.remove('hidden');
            const errorResorts = errors.slice(0, 5).map(r => r.name).join(', ');
            const moreErrors = errors.length > 5 ? ` and ${errors.length - 5} more` : '';
            errorMessage.textContent = `Failed to load data for ${errors.length} resort(s): ${errorResorts}${moreErrors}. Some data may be incomplete.`;
            // Log detailed errors to console for debugging
            errors.forEach(resort => {
                console.error(`Failed to load ${resort.name}:`, resort.error);
            });
        }
        
        // Update last update time
        const updateTime = new Date().toISOString();
        if (lastUpdate) {
            lastUpdate.textContent = `Last updated: ${formatRelativeTime(updateTime)}`;
        }
        
        // Store all resort data
        allResortData = results;
        
        // Apply current filters and sort, then render
        applyFiltersAndSort();
        
    } catch (error) {
        clearTimeout(globalTimeout);
        // Ensure loading state is always hidden on error (only if we showed it)
        if (showLoadingUI) {
            if (loadingState) {
                loadingState.classList.add('hidden');
                loadingState.style.display = 'none';
            }
            errorState.classList.remove('hidden');
            errorMessage.textContent = `Failed to fetch data: ${error.message}. Please check the browser console for details.`;
        }
        console.error('Error fetching resorts:', error);
        console.error('Error stack:', error.stack);
    } finally {
        // Reset fetching flag
        isFetching = false;
        
        // Final safeguard - ensure loading state is hidden
        setTimeout(() => {
            if (loadingState && loadingState.style.display !== 'none') {
                console.warn('Loading state was still visible, forcing hide');
                loadingState.classList.add('hidden');
                loadingState.style.display = 'none';
            }
        }, 1000);
    }
};

// Generate vibrant color scheme for each resort card
function getCardColors(index) {
    const colorSchemes = [
        { bg: 'from-cyan-400 via-blue-500 to-purple-600', accent: 'text-cyan-300', border: 'border-cyan-300' },
        { bg: 'from-pink-400 via-rose-500 to-orange-500', accent: 'text-pink-300', border: 'border-pink-300' },
        { bg: 'from-emerald-400 via-teal-500 to-cyan-600', accent: 'text-emerald-300', border: 'border-emerald-300' },
        { bg: 'from-violet-400 via-purple-500 to-fuchsia-600', accent: 'text-violet-300', border: 'border-violet-300' },
        { bg: 'from-amber-400 via-orange-500 to-red-500', accent: 'text-amber-300', border: 'border-amber-300' },
        { bg: 'from-indigo-400 via-blue-500 to-cyan-500', accent: 'text-indigo-300', border: 'border-indigo-300' },
        { bg: 'from-lime-400 via-green-500 to-emerald-600', accent: 'text-lime-300', border: 'border-lime-300' },
        { bg: 'from-rose-400 via-pink-500 to-purple-600', accent: 'text-rose-300', border: 'border-rose-300' }
    ];
    return colorSchemes[index % colorSchemes.length];
}

// Get color for snowfall value
function getSnowfallColor(value) {
    const numValue = parseFloat(value);
    if (isNaN(numValue)) return 'text-white/70';
    if (numValue >= 12) return 'text-yellow-300'; // Heavy snow - bright yellow
    if (numValue >= 6) return 'text-cyan-300'; // Moderate snow - cyan
    if (numValue >= 2) return 'text-blue-300'; // Light snow - blue
    return 'text-white/80'; // Minimal snow
}

// Render a single resort card
function renderResortCard(resort, index) {
    const snowfall24hInches = resort.success ? mmToInches(resort.snowfall24h) : 'N/A';
    const snowfall7dInches = resort.success ? mmToInches(resort.snowfall7d) : 'N/A';
    const baseDepthInches = resort.success && resort.baseDepth !== null ? mmToInches(resort.baseDepth) : 'N/A';
    const updateTime = resort.success ? formatRelativeTime(resort.lastUpdate) : 'Error';
    const updateDate = resort.success ? formatTimestamp(resort.lastUpdate) : 'Error';
    const websiteUrl = generateResortWebsiteUrl(resort);
    const colors = getCardColors(index);
    
    // Display country for international resorts, state for US resorts
    const locationDisplay = resort.state 
        ? `${resort.region} • ${resort.state}` 
        : `${resort.region} • ${resort.country}`;
    
    return `
        <div class="bg-gradient-to-br ${colors.bg} rounded-2xl shadow-2xl p-6 hover:shadow-3xl transition-all duration-300 border-2 ${colors.border} hover:scale-105 transform backdrop-blur-sm">
            <div class="flex justify-between items-start mb-4">
                <div class="flex-1">
                    <h2 class="text-2xl font-bold text-white mb-1 drop-shadow-lg">${resort.name}</h2>
                    <p class="text-white/90 text-sm font-medium mb-1">${locationDisplay}</p>
                    <p class="text-white/70 text-xs font-medium">Last updated: ${updateDate}</p>
                </div>
                ${resort.success ? '' : '<span class="bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-full shadow-lg">⚠️ Error</span>'}
            </div>
            
            <div class="space-y-3">
                <div class="flex justify-between items-center py-2 border-b border-white/30">
                    <span class="text-white/90 font-semibold">24h Snowfall:</span>
                    <span class="text-2xl font-bold ${getSnowfallColor(snowfall24hInches)} drop-shadow-lg">${snowfall24hInches}"</span>
                </div>
                
                <div class="flex justify-between items-center py-2 border-b border-white/30">
                    <span class="text-white/90 font-semibold">7-Day Total:</span>
                    <span class="text-2xl font-bold ${getSnowfallColor(snowfall7dInches)} drop-shadow-lg">${snowfall7dInches}"</span>
                </div>
                
                <div class="flex justify-between items-center py-2 border-b border-white/30">
                    <span class="text-white/90 font-semibold">Base Depth:</span>
                    <span class="text-2xl font-bold ${getSnowfallColor(baseDepthInches)} drop-shadow-lg">${baseDepthInches}"</span>
                </div>
                
                <div class="pt-2 flex items-center justify-between">
                    <p class="text-xs text-white/80 font-medium">${updateTime}</p>
                    <a 
                        href="${websiteUrl}" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        class="bg-white/20 hover:bg-white/30 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-all shadow-md hover:shadow-lg transform hover:scale-105"
                    >
                        Visit Website →
                    </a>
                </div>
            </div>
        </div>
    `;
}

// Render resort cards grouped by region
function renderResorts(resortData) {
    const container = document.getElementById('resortsContainer');
    const noResultsMessage = document.getElementById('noResultsMessage');
    
    // Show/hide no results message
    if (resortData.length === 0) {
        container.innerHTML = '';
        noResultsMessage.classList.remove('hidden');
        return;
    } else {
        noResultsMessage.classList.add('hidden');
    }
    
    // Group resorts by region
    const groupedResorts = groupResortsByRegion(resortData);
    
    // Render grouped sections
    let cardIndex = 0;
    container.innerHTML = groupedResorts.map(({ region, resorts }) => {
        const sectionHeader = `
            <div class="col-span-full mb-4 mt-6 first:mt-0">
                <h2 class="text-3xl font-bold text-white drop-shadow-lg border-b-2 border-white/30 pb-2">
                    ${region}
                </h2>
            </div>
        `;
        
        const cards = resorts.map(resort => {
            const card = renderResortCard(resort, cardIndex);
            cardIndex++;
            return card;
        }).join('');
        
        return sectionHeader + cards;
    }).join('');
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    // Prevent multiple initializations
    if (window.appInitialized) {
        console.log('App already initialized, skipping duplicate initialization');
        return;
    }
    
    window.appInitialized = true;
    console.log('Page loaded, initializing app...');
    
    try {
        // Initialize dark mode
        initDarkMode();
        console.log('Dark mode initialized');
        
        // Set up event listeners
        const searchInput = document.getElementById('searchInput');
        const sortSelect = document.getElementById('sortSelect');
        const regionSelect = document.getElementById('regionSelect');
        
        if (!searchInput || !sortSelect || !regionSelect) {
            throw new Error('Required DOM elements not found');
        }
        
        console.log('Event listeners setting up...');
        
        // Search input event listener
        searchInput.addEventListener('input', (e) => {
            currentSearchTerm = e.target.value;
            applyFiltersAndSort();
        });
        
        // Region select event listener
        regionSelect.addEventListener('change', (e) => {
            currentRegionFilter = e.target.value;
            applyFiltersAndSort();
        });
        
        // Sort select event listener
        sortSelect.addEventListener('change', (e) => {
            currentSortBy = e.target.value;
            applyFiltersAndSort();
        });
        
        // Add refresh button handler
        const refreshBtn = document.getElementById('refreshBtn');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => {
                console.log('Refresh button clicked');
                fetchAllResorts(true); // Show loading UI for manual refresh
            });
            console.log('Refresh button handler attached');
        } else {
            console.error('Refresh button not found');
        }
        
        // Check for cached data first
        const cachedData = getCachedData();
        const lastUpdate = document.getElementById('lastUpdate');
        
        if (cachedData && cachedData.length > 0) {
            // Load cached data immediately - instant load!
            console.log('Loading cached data...');
            allResortData = cachedData;
            applyFiltersAndSort();
            
            // Show subtle "Refreshing..." indicator
            if (lastUpdate) {
                lastUpdate.textContent = 'Refreshing data...';
            }
            
            // Fetch fresh data in background (no loading screen)
            console.log('Fetching fresh data in background...');
            fetchAllResorts(false).then(() => {
                if (lastUpdate) {
                    const updateTime = new Date().toISOString();
                    lastUpdate.textContent = `Last updated: ${formatRelativeTime(updateTime)}`;
                }
            }).catch(error => {
                console.error('Background refresh failed:', error);
                if (lastUpdate) {
                    lastUpdate.textContent = 'Refresh failed - showing cached data';
                }
            });
        } else {
            // No cache - show loading screen and fetch
            console.log('No cached data found, starting initial fetch...');
            fetchAllResorts(true);
        }
        
    } catch (error) {
        console.error('Error during initialization:', error);
        const errorState = document.getElementById('errorState');
        const errorMessage = document.getElementById('errorMessage');
        const loadingState = document.getElementById('loadingState');
        
        if (loadingState) loadingState.classList.add('hidden');
        if (errorState) errorState.classList.remove('hidden');
        if (errorMessage) errorMessage.textContent = `Initialization error: ${error.message}. Please check the browser console.`;
    }
});

// Also try immediate execution if DOM is already loaded
if (document.readyState === 'loading') {
    console.log('DOM is still loading, waiting for DOMContentLoaded...');
} else {
    console.log('DOM already loaded, executing initialization...');
    // Don't manually dispatch event - let the event listener handle it naturally
    // The DOMContentLoaded event may have already fired, so we'll just run the init code directly
    const initCode = () => {
        console.log('Page loaded, initializing app...');
        
        try {
            // Initialize dark mode
            initDarkMode();
            console.log('Dark mode initialized');
            
            // Set up event listeners
            const searchInput = document.getElementById('searchInput');
            const sortSelect = document.getElementById('sortSelect');
            const regionSelect = document.getElementById('regionSelect');
            
            if (!searchInput || !sortSelect || !regionSelect) {
                throw new Error('Required DOM elements not found');
            }
            
            console.log('Event listeners setting up...');
            
            // Search input event listener
            searchInput.addEventListener('input', (e) => {
                currentSearchTerm = e.target.value;
                applyFiltersAndSort();
            });
            
            // Region select event listener
            regionSelect.addEventListener('change', (e) => {
                currentRegionFilter = e.target.value;
                applyFiltersAndSort();
            });
            
            // Sort select event listener
            sortSelect.addEventListener('change', (e) => {
                currentSortBy = e.target.value;
                applyFiltersAndSort();
            });
            
            // Add refresh button handler
            const refreshBtn = document.getElementById('refreshBtn');
            if (refreshBtn) {
                refreshBtn.addEventListener('click', () => {
                    console.log('Refresh button clicked');
                    fetchAllResorts(true); // Show loading UI for manual refresh
                });
                console.log('Refresh button handler attached');
            } else {
                console.error('Refresh button not found');
            }
            
            // Check for cached data first
            const cachedData = getCachedData();
            const lastUpdate = document.getElementById('lastUpdate');
            
            if (cachedData && cachedData.length > 0) {
                // Load cached data immediately - instant load!
                console.log('Loading cached data...');
                allResortData = cachedData;
                applyFiltersAndSort();
                
                // Show subtle "Refreshing..." indicator
                if (lastUpdate) {
                    lastUpdate.textContent = 'Refreshing data...';
                }
                
                // Fetch fresh data in background (no loading screen)
                console.log('Fetching fresh data in background...');
                fetchAllResorts(false).then(() => {
                    if (lastUpdate) {
                        const updateTime = new Date().toISOString();
                        lastUpdate.textContent = `Last updated: ${formatRelativeTime(updateTime)}`;
                    }
                }).catch(error => {
                    console.error('Background refresh failed:', error);
                    if (lastUpdate) {
                        lastUpdate.textContent = 'Refresh failed - showing cached data';
                    }
                });
            } else {
                // No cache - show loading screen and fetch
                console.log('No cached data found, starting initial fetch...');
                fetchAllResorts(true);
            }
            
        } catch (error) {
            console.error('Error during initialization:', error);
            const errorState = document.getElementById('errorState');
            const errorMessage = document.getElementById('errorMessage');
            const loadingState = document.getElementById('loadingState');
            
            if (loadingState) loadingState.classList.add('hidden');
            if (errorState) errorState.classList.remove('hidden');
            if (errorMessage) errorMessage.textContent = `Initialization error: ${error.message}. Please check the browser console.`;
        }
    };
    
    // Only run if not already initialized
    if (!window.appInitialized) {
        window.appInitialized = true;
        initCode();
    }
}

