// Coffee Timeline — daily roast tracking and roaster profiles
// Modeled after dev-timeline.js — day-by-day activity for featured roasters
// Backend will eventually feed real batch/roast data; this is the POC seed

export const COFFEE_FIRST_DATE = '2026-03-01';

// Featured roaster profile
export const FEATURED_ROASTER = {
  name: 'Panther Coffee',
  location: 'Miami, FL',
  founded: 2010,
  founders: 'Leticia & Joel Pollock',
  philosophy: 'Direct trade, small-batch roasting. 40+ years combined experience. They travel to origin and build relationships with producers.',
  url: 'https://panthercoffee.com',
  instagram: '@panthercoffee',
};

// Current offerings — scraped from Panther Coffee's public Shopify catalog
export const PANTHER_OFFERINGS = [
  {
    name: 'Mejor',
    type: 'single-origin',
    region: 'South America',
    origin: 'Popayan, Cauca, Colombia',
    variety: 'Castillo',
    elevation: '1,700–1,900 MASL',
    process: 'Washed',
    notes: 'Montmorency cherry citrus, milk chocolate, sweet and silky',
    price: 22,
    url: 'https://panthercoffee.com/products/mejor',
  },
  {
    name: 'Israel Salazar',
    type: 'single-origin',
    region: 'South America',
    origin: 'San Isidro, Sotara, Cauca, Colombia',
    variety: 'Castillo',
    elevation: '2,000 MASL',
    process: 'Washed, raised bed dried',
    notes: 'Orange, lemon zest, graham cracker — intense, bright, fruit forward',
    price: 25,
    url: 'https://panthercoffee.com/products/israel-salazar',
    producerNote: '8+ year direct relationship',
  },
  {
    name: 'La Amistad',
    type: 'single-origin',
    region: 'Central America',
    origin: 'Las Cuchillas, Jinotega, Nicaragua',
    variety: 'Catuai, Caturra',
    elevation: '1,200 MASL',
    process: 'Fully washed',
    notes: 'Caramel, apricot, sweet and delicate acidity, butter caramel finish',
    price: 23,
    url: 'https://panthercoffee.com/products/la-amistad',
    producerNote: '17+ year direct relationship',
  },
  {
    name: 'Kangocho AA',
    type: 'single-origin',
    region: 'Africa',
    origin: 'Karatina, Nyeri, Kenya',
    variety: 'SL28, SL34, Batian',
    elevation: '1,700 MASL',
    process: 'Washed, fermented underwater overnight, shade dried on raised beds',
    notes: 'Black currant, honey, lemon — creamy, bright, very sweet',
    price: 32,
    url: 'https://panthercoffee.com/products/kangocho-aa',
  },
  {
    name: 'Refisa',
    type: 'single-origin',
    region: 'Africa',
    origin: 'Ethiopia',
    variety: 'Heirloom',
    elevation: '1,800+ MASL',
    process: 'Natural',
    notes: 'Blueberry, strawberry, wine-like body',
    price: 25,
    url: 'https://panthercoffee.com/products/refisa',
  },
  {
    name: 'Decaf Mountain Water',
    type: 'single-origin',
    region: 'South America',
    origin: 'Caldas/Risaralda/Quindio, Colombia',
    variety: 'Castillo',
    elevation: '1,500–1,800 MASL',
    process: 'Washed + Mountain Water decaf',
    notes: 'Chocolate, red fruit, honey-like sweetness, creamy body',
    price: 22,
    url: 'https://panthercoffee.com/products/decaf-mountain-water',
  },
  {
    name: '1927',
    type: 'blend',
    region: 'Blend',
    origin: 'Multi-origin',
    process: 'Varies',
    notes: 'Dark chocolate, nutty, syrupy — Northern Italian espresso style',
    price: 19,
    url: 'https://panthercoffee.com/products/1927',
  },
  {
    name: '1985 Espresso',
    type: 'blend',
    region: 'Blend',
    origin: 'Central & South America',
    process: 'Varies',
    notes: 'Milk chocolate, toasted almond, full bodied and mild',
    price: 19,
    url: 'https://panthercoffee.com/products/1985-espresso',
  },
];

// Regions represented in current offerings
export const PANTHER_REGIONS = [
  { name: 'South America', countries: ['Colombia'], count: 3, color: '#7ec89b' },
  { name: 'Central America', countries: ['Nicaragua'], count: 1, color: '#88a8d4' },
  { name: 'Africa', countries: ['Kenya', 'Ethiopia'], count: 2, color: '#e8a0b0' },
  { name: 'Blend', countries: [], count: 2, color: '#c89b6a' },
];

// Placeholder daily roast counts — backend will replace with real batch data
// Format mirrors DEV_COMMITS: date → roast count
export const COFFEE_ROASTS = {
  '2026-03-01': 3,
  '2026-03-02': 0,
  '2026-03-03': 4,
  '2026-03-04': 2,
  '2026-03-05': 5,
  '2026-03-06': 3,
  '2026-03-07': 0,
  '2026-03-08': 4,
  '2026-03-09': 0,
  '2026-03-10': 6,
  '2026-03-11': 3,
  '2026-03-12': 4,
  '2026-03-13': 2,
  '2026-03-14': 0,
  '2026-03-15': 5,
  '2026-03-16': 0,
  '2026-03-17': 7,
  '2026-03-18': 3,
  '2026-03-19': 4,
  '2026-03-20': 2,
  '2026-03-21': 0,
  '2026-03-22': 5,
  '2026-03-23': 0,
  '2026-03-24': 6,
  '2026-03-25': 4,
  '2026-03-26': 3,
  '2026-03-27': 5,
  '2026-03-28': 2,
};

// Daily coffee blurbs — what's happening at the roaster
export const COFFEE_BLURBS = {
  '2026-03-01': [
    { type: 'roast', text: 'Mejor batch #012 pulled — cherry citrus notes dialed in. 22 lbs, medium roast.' },
    { type: 'origin', text: 'New Kangocho AA lot landed from Nyeri, Kenya. SL28/SL34 blend, washed and shade dried.' },
  ],
  '2026-03-03': [
    { type: 'roast', text: 'La Amistad roasted for wholesale. 17th consecutive year sourcing from Las Cuchillas.' },
    { type: 'metric', label: 'Bags Roasted', value: '48', change: 'La Amistad wholesale run' },
  ],
  '2026-03-05': [
    { type: 'roast', text: 'Israel Salazar micro-lot. Raised bed dried at 2,000 MASL. Graham cracker and lemon zest coming through clean.' },
    { type: 'origin', text: 'Refisa natural process from Ethiopia cupped at 87 points. Blueberry forward, wine finish.' },
  ],
  '2026-03-08': [
    { type: 'roast', text: '1985 Espresso blend dialed for spring menu. Milk chocolate and toasted almond, full body.' },
    { type: 'metric', label: 'Retail Bags', value: '120', change: 'weekly shop + online orders' },
  ],
  '2026-03-10': [
    { type: 'roast', text: 'Heavy roast day — 6 batches. Mejor, 1927, and Decaf Mountain Water all pulled.' },
    { type: 'origin', text: 'Mountain Water decaf process preserves the Castillo chocolate notes better than Swiss Water at this elevation.' },
  ],
  '2026-03-15': [
    { type: 'roast', text: 'Kangocho AA sample roast for cupping. Black currant and honey — this lot is exceptional.' },
    { type: 'metric', label: 'Green Coffee', value: '340 lbs', change: 'Kangocho AA inventory' },
  ],
  '2026-03-17': [
    { type: 'roast', text: 'Biggest roast day this month — 7 batches across all single origins. Weekend prep for Wynwood and Sunset Harbour locations.' },
    { type: 'origin', text: 'Joel confirms next Colombia trip for May. Visiting Cauca producers for 2026-27 harvest contracts.' },
    { type: 'metric', label: 'Batches', value: '7', change: 'single-day record this month' },
  ],
  '2026-03-22': [
    { type: 'roast', text: 'Refisa and Mejor pulled back to back. The Ethiopian natural vs Colombian washed contrast is what specialty coffee is about.' },
  ],
  '2026-03-24': [
    { type: 'roast', text: '1927 Italian-style espresso blend roasted dark. The crowd favorite — nutty, syrupy, no apologies.' },
    { type: 'origin', text: 'New crop samples arriving from Nicaragua. La Amistad relationship entering its 18th year.' },
  ],
  '2026-03-27': [
    { type: 'roast', text: 'End of month push — 5 batches. All single origins restocked for April.' },
    { type: 'metric', label: 'Monthly Batches', value: '84', change: 'March 2026 total (placeholder)' },
  ],
};
