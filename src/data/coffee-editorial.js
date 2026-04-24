// Coffee editorial — newspaper-style content for the coffee lens.
// Four pieces:
//   1. WAVES — historical eras of specialty coffee, keyed to year ranges.
//      Year slider drives which wave's paragraph is showing.
//   2. JOURNEYS — bean-to-cup routes. One rotates daily on the front page.
//   3. FAMOUS_BEANS — legendary origin varieties worth knowing, fixed list.
//   4. COUNTRY_STORIES — editorial paragraph per producer country, shown
//      when that country is selected in the grid. Seeded with the big three;
//      fill in the rest when you have something to say.

export const COFFEE_WAVES = [
  {
    key: 'first',
    label: 'First Wave',
    range: [1900, 1965],
    tagline: 'Coffee as commodity',
    body: 'Canned, vacuum-sealed, blended for consistency not character. Folgers and Maxwell House ruled American kitchens; the bean\'s origin was nobody\'s business. You drank it because it was there.',
  },
  {
    key: 'second',
    label: 'Second Wave',
    range: [1966, 1998],
    tagline: 'Coffee as destination',
    body: 'Peet\'s opened in Berkeley in 1966, Starbucks in Seattle\'s Pike Place in 1971. Coffee stopped being a grocery item and started being somewhere you went. Dark roasts, espresso drinks, cafés as third places between home and work. By the mid-90s the green apron was everywhere.',
  },
  {
    key: 'third',
    label: 'Third Wave',
    range: [1999, 2014],
    tagline: 'Coffee as craft',
    body: 'Stumptown opened in a Portland hair salon in 1999. Counter Culture, Intelligentsia, Tim Wendelboe. Coffee became single-origin, direct-trade, seasonal. Roasts got lighter. The bean\'s farm, variety, and processing method started showing up on the bag. Coffee acquired a vocabulary.',
  },
  {
    key: 'fourth',
    label: 'Fourth Wave',
    range: [2015, 2099],
    tagline: 'Coffee as process',
    body: 'Process replaces origin as the hero. Anaerobic, carbonic, thermal shock, extended fermentation. The farm and the variety still matter, but what happens in the 48 hours after picking matters more. La Cabra, April, and the Scandinavian next generation built subscriptions around weird ferments. Your flat white tastes like strawberry now, and that\'s intentional.',
  },
];

export function waveForYear(year) {
  if (!year) return COFFEE_WAVES[COFFEE_WAVES.length - 1];
  for (const w of COFFEE_WAVES) {
    if (year >= w.range[0] && year <= w.range[1]) return w;
  }
  return COFFEE_WAVES[COFFEE_WAVES.length - 1];
}

// Bean-to-cup journeys — one rotates daily via hash(today + index).
// Each journey has a template with {origin} and {roaster} tokens so the UI
// can render those tokens as clickable links into the country grid and the
// roaster card below.
export const COFFEE_JOURNEYS = [
  {
    template: 'Cherries picked in {origin} last November → washed at a family mill → green shipped via Buenaventura → roasted in Copenhagen by {roaster} → pulled as espresso on Jægersborggade.',
    originLabel: 'Huila, Colombia', country: 'Colombia',
    roasterLabel: 'The Coffee Collective', roasterSlug: 'coffee-collective',
  },
  {
    template: '{origin} heirloom picked by smallholders → natural-dried on raised beds → auction in Addis Ababa → container through Djibouti → roasted in Oslo by {roaster} → brewed as V60.',
    originLabel: 'Yirgacheffe, Ethiopia', country: 'Ethiopia',
    roasterLabel: 'Tim Wendelboe', roasterSlug: 'tim-wendelboe',
  },
  {
    template: '{origin} from Nyeri → washed at a coop factory → Mombasa auction → green to Amsterdam → roasted by {roaster} → pulled 1:2.5 at their Kinkerstraat bar.',
    originLabel: 'Kenyan AA', country: 'Kenya',
    roasterLabel: 'Lot61', roasterSlug: 'lot61',
  },
  {
    template: 'Brazilian naturals from {origin} → sun-dried on patios → truck to Santos port → green warehoused in Antwerp → roasted in Berlin by {roaster} → drip-brewed at Kreuzberg.',
    originLabel: 'Minas Gerais', country: 'Brazil',
    roasterLabel: 'Five Elephant', roasterSlug: 'five-elephant',
  },
  {
    template: '{origin} from Boquete → honey process → Best of Panama auction → airfreighted to Portland → roasted by {roaster} for filter → brewed at competition ratios.',
    originLabel: 'Panama Geisha', country: 'Panama',
    roasterLabel: 'Heart', roasterSlug: 'heart-coffee-roasters',
  },
  {
    template: '{origin} micro-lot → honey-processed → warehoused in San José → green to Arkansas → roasted by {roaster} → batch-brewed as their weekend single-origin.',
    originLabel: 'Costa Rican Tarrazú', country: 'Costa Rica',
    roasterLabel: 'Onyx', roasterSlug: 'onyx-coffee-lab',
  },
  {
    template: '{origin} bourbon → washed at a station run by women smallholders → Kigali auction → Rotterdam container → roasted by {roaster} in Amsterdam → served at a De Pijp café.',
    originLabel: 'Rwandan Nyamasheke', country: 'Rwanda',
    roasterLabel: 'Bocca', roasterSlug: 'bocca',
  },
  {
    template: '{origin} Pacamara → natural process → bagged in Matagalpa → green to Miami → roasted by {roaster} → dialed in as their weekend single-origin.',
    originLabel: 'Nicaraguan Jinotega', country: 'Nicaragua',
    roasterLabel: 'Panther', roasterSlug: 'panther-coffee',
  },
  {
    template: '{origin} → anaerobic experimental lot → direct contract with the station → green flown to Stockholm → roasted by {roaster} → extracted 1:16 as pourover.',
    originLabel: 'Ethiopian Sidamo', country: 'Ethiopia',
    roasterLabel: 'Drop', roasterSlug: 'drop-coffee',
  },
  {
    template: '{origin} → wet-hulled by local collectors → Medan port → green to New York → roasted by {roaster} → blended into Hair Bender.',
    originLabel: 'Sumatra Mandheling', country: 'Indonesia',
    roasterLabel: 'Stumptown', roasterSlug: 'stumptown',
  },
  {
    template: '{origin} → washed at a family finca → Puerto Quetzal → container to Boston → roasted by {roaster} → brewed as auto-drip at the Acton roastery.',
    originLabel: 'Guatemalan Huehuetenango', country: 'Guatemala',
    roasterLabel: 'George Howell', roasterSlug: 'george-howell-coffee',
  },
  {
    template: '{origin} bourbon → washed at a specialty station → Bujumbura bags → airfreighted to Copenhagen → roasted by {roaster} → cupped on the weekend tasting flight.',
    originLabel: 'Burundi Kayanza', country: 'Burundi',
    roasterLabel: 'La Cabra', roasterSlug: 'la-cabra',
  },
];

export function journeyForToday() {
  const today = new Date().toISOString().slice(0, 10);
  let h = 0;
  for (let i = 0; i < today.length; i++) h = (h * 31 + today.charCodeAt(i)) | 0;
  const idx = Math.abs(h) % COFFEE_JOURNEYS.length;
  return COFFEE_JOURNEYS[idx];
}

// Legendary origin varieties. Fixed list, not year-driven. Use the dash-line
// format so each row reads like a dictionary entry.
export const FAMOUS_BEANS = [
  {
    name: 'Panama Geisha',
    country: 'Panama',
    note: 'The auction king. Rediscovered at Hacienda La Esmeralda in 2004, cupped 95+, broke every record since. $10k/lb lots exist. Jasmine, bergamot, tropical fruit.',
  },
  {
    name: 'Ethiopian Heirloom',
    country: 'Ethiopia',
    note: 'Not a variety — a catch-all. Ethiopia grows thousands of indigenous arabica cultivars, mostly unnamed, all labeled heirloom on the bag. The original genetic diversity.',
  },
  {
    name: 'Jamaica Blue Mountain',
    country: 'Jamaica',
    note: 'The marketing story. Grown 3,000–5,500 ft in Jamaica\'s Blue Mountains. Coveted in Japan, sold at premium. Cleanly balanced, rarely spectacular. Reputation doing the lifting.',
  },
  {
    name: 'Hawaiian Kona',
    country: 'United States',
    note: 'Volcanic soil, small farms, American terroir. Low-acid, nutty, chocolatey — a style unlike the bright washed coffees of specialty. Heavily counterfeited. If it\'s cheap, it\'s not real.',
  },
  {
    name: 'Yemen Mocha',
    country: 'Yemen',
    note: 'The original. Yemen was coffee\'s first commercial producer centuries before Ethiopia exported. Mocha (the port) gave chocolate-coffee drinks their name. Wild, fermented, funky — and nearly extinct under civil war.',
  },
  {
    name: 'Sumatra Mandheling',
    country: 'Indonesia',
    note: 'The wet-hulled one. Indonesian processing skips the usual drying step — green beans hulled wet, giving earthy, mushroomy, tobacco character. Loved for body, polarising on acidity.',
  },
];

// Per-country editorial. Keyed by country name exactly as it appears in the
// producer country grid. Missing entries fall back to no-story rendering.
export const COUNTRY_STORIES = {
  'Colombia': 'The reliable one. Mountainous, year-round harvest split across 23 growing regions — Huila and Nariño showcase the craft end, Antioquia and Caldas produce the volume. The Federación Nacional (FNC), founded 1927, still sets a price floor, though climate pressure is cracking the model. 14M bags in a good year. Washed, bright, balanced — the specialty baseline.',
  'Ethiopia': 'The birthplace. Every arabica plant on earth descends from forests in the Kaffa region. Ethiopia grows thousands of indigenous heirloom varieties no one has fully catalogued. Yirgacheffe, Sidamo, Guji — floral, tea-like, jasmine and bergamot notes no other origin produces. Washed and natural both matter here; the natural process was invented out of necessity and is now a global standard.',
  'Brazil': 'The giant. Grows more coffee than the next three countries combined — 58M+ bags in a peak year, centered in Minas Gerais and São Paulo. Mostly sun-dried naturals. Historically a volume producer for blends and espresso bases; the specialty end (Mogiana, Cerrado microlots, Cup of Excellence winners) has been quietly excellent since the late 90s. The 2021 frost dented global supply and crashed the specialty market.',
  'Vietnam': 'The robusta giant. Second-largest producer globally, second only to Brazil — but almost entirely coffea canephora (robusta), not arabica. The Central Highlands around Buôn Ma Thuột supply the instant-coffee industry and the espresso-blend filler of most of Europe. Quietly, a specialty arabica movement is forming in Đà Lạt, but it\'s a rounding error on the total.',
  'Indonesia': 'The archipelago. Sumatra\'s wet-hull processing gives the country its instantly-recognisable earthy profile. Java, Bali, Sulawesi all add their own signatures. Kopi Luwak — the much-marketed civet-processed coffee — originated here and remains mostly a tourist-trap category. The real story is smallholders working volcanic soil at altitude.',
  'Honduras': 'Central America\'s quiet volume leader. Six growing regions — Copán, Opalaca, Montecillos, Comayagua, Agalta, El Paraíso — with washed profiles that cup clean and bright. Rust outbreaks in the 2010s decimated yields; the recovery shifted growers toward disease-resistant varieties and specialty processing. Underrated on the Cup of Excellence rankings.',
  'Kenya': 'The benchmark for washed African coffee. SL28 and SL34 varieties, developed at Scott Labs in the 1930s, still define the Kenyan profile — blackcurrant, tomato, sugarcane acidity. Auction system routes coffee through Nairobi; cooperatives do the processing at local factories. The grading system (AA, AB, PB) is its own shorthand worldwide.',
};
