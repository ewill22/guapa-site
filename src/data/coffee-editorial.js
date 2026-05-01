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

// Legacy bean-to-cup journey templates. Retained as a fallback if the live
// offerings dataset (coffee-offerings.js) is empty. The UI prefers real
// roaster-published offerings; see journeyForToday() in App.jsx.
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

// Processing methods — how the fruit comes off the bean. Order is roughly
// "classic → experimental". Match keys to what fetch-offerings.ps1 infers
// from titles/body so Today's Journey can tag an offering's process.
export const COFFEE_PROCESSES = [
  {
    key: 'washed',
    name: 'Washed',
    aka: 'wet process',
    tagline: 'Clean. Bright. The benchmark.',
    body: 'Pulp the cherry, ferment off the mucilage in tanks (12–48 hours), rinse, dry on patios or beds. Removes the fruit before it can influence the bean. Lets origin, variety, and altitude show through without a filter. The standard in Kenya, Colombia, Ethiopia\'s high-altitude washing stations, most of Central America.',
    flavors: 'Clarity, acidity, florals, citrus, black tea, tomato (Kenya), jasmine (Ethiopia).',
  },
  {
    key: 'natural',
    name: 'Natural',
    aka: 'dry process',
    tagline: 'Whole cherry, sun-dried. Fruit bomb.',
    body: 'Skip the pulping. Lay whole cherries on raised beds or patios, let them dry with the fruit still on (2–4 weeks), then hull the dried husk off. The fruit ferments onto the bean. Invented in Ethiopia and Yemen out of necessity — no water to waste — now a global style.',
    flavors: 'Blueberry, strawberry, jam, wine, funk. Heavier body, lower acidity than washed.',
  },
  {
    key: 'honey',
    name: 'Honey',
    aka: 'semi-washed, pulped natural',
    tagline: 'Split the difference.',
    body: 'Pulp the cherry but leave some or all of the sticky mucilage on the bean during drying. Named "honey" for the sticky coating, not the flavor. Labeled yellow/red/black honey by how much mucilage stays and how long it dries. Costa Rica built its specialty reputation on this. Also huge in El Salvador and Brazil microlots.',
    flavors: 'Caramel, brown sugar, stone fruit. Body of a natural, clarity closer to washed.',
  },
  {
    key: 'wet-hulled',
    name: 'Wet-Hulled',
    aka: 'giling basah',
    tagline: 'The Sumatran signature.',
    body: 'Indonesian specialty. Pulp, ferment briefly, then hull the parchment off while the bean is still wet (30–50% moisture), then dry the naked bean. Cuts drying time in the archipelago\'s humidity but gives the green bean a distinctive blue-green color and a processing-driven flavor no one else has.',
    flavors: 'Earthy, mushroomy, tobacco, cedar, low-acid, heavy body. Polarizing on purpose.',
  },
  {
    key: 'anaerobic',
    name: 'Anaerobic',
    aka: 'sealed fermentation',
    tagline: 'Tank it. Let the microbes drive.',
    body: 'Cherries (or depulped beans) sealed in an oxygen-free tank for 48–120 hours. Specific microbes take over, producing flavor compounds that aerobic fermentation can\'t. Arrived in specialty around 2015–2017 via Costa Rica and Colombia competition lots. Now the dominant fourth-wave experimental process.',
    flavors: 'Tropical fruit, cinnamon, rum, lychee, bubblegum, sometimes boozy. Loved or hated.',
  },
  {
    key: 'carbonic',
    name: 'Carbonic Maceration',
    aka: 'CM',
    tagline: 'Borrowed from Beaujolais.',
    body: 'Whole cherries sealed in a CO2-purged tank — the fermentation happens inside each intact cherry, cell by cell. Wine technique imported by Sasa Sestic (2015 World Barista Champion) and now used by competition-focused farms in Colombia, Costa Rica, Panama. Extreme fruit character, extreme cost.',
    flavors: 'Red wine, raspberry, cherry cola, floral, sharply defined fruit.',
  },
  {
    key: 'thermal-shock',
    name: 'Thermal Shock',
    aka: 'hot/cold fermentation',
    tagline: 'New-school experimental.',
    body: 'Cycle the fermenting lot through hot then cold water baths to stress the microbes into producing specific compounds. Popularized by Colombian producers around 2020. Polarizing — some cuppers call it the next frontier, others call it a flavor additive dressed up as process.',
    flavors: 'Intense tropical fruit, candy-sweet, sometimes one-note. Unmistakable on the cup table.',
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
  'Peru': 'The sleeper. High-altitude Arabica from the Andes — Cajamarca, Junín, Cusco, Amazonas. Long fragmented from civil unrest in the 80s and 90s; cooperatives rebuilt the export pipeline through fair-trade and organic certifications. Cup-clean washed profiles, often nutty and chocolaty, increasingly winning specialty buyers.',
  'Uganda': 'The Robusta heart of East Africa. Arabica grows in the eastern Mt. Elgon and western Rwenzori belts; Robusta dominates everywhere else. UCDA (Uganda Coffee Development Authority) shepherds the industry. Coffee is Uganda\'s biggest export by volume — what tea is to Sri Lanka.',
  'Mexico': 'The northernmost producer. Chiapas and Veracruz at the Guatemala border carry the volume; Oaxaca and Puebla supply specialty microlots. Hit hard by leaf rust in 2012-13; recovery skewed toward shade-grown and organic certifications. Profile leans mild, balanced, chocolaty — a base for blends.',
  'Guatemala': 'Eight defined regions, eight microclimates. Antigua\'s volcanic soil, Huehuetenango\'s high-altitude precision, Atitlán\'s lake-influenced lots. Anacafé (Asociación Nacional del Café) markets the regional brands hard. Bourbon and Caturra dominate; specialty buyers love the chocolate-and-citrus signature.',
  'Nicaragua': 'Jinotega and Matagalpa northern highlands. Recovering from decades of political instability and Hurricane Mitch (1998), which wiped out a third of farms. Cup of Excellence has been a turning point — Nicaraguan microlots regularly hit world-class scores. Caturra, Catuaí, Maracaturra varietals.',
  'Costa Rica': 'The wet-mill engineers. Strict regulation: only Arabica is legally allowed to be planted (since 1989). Tarrazú, Central Valley, West Valley dominate. Pioneered the modern honey process and micromill movement of the 2000s, exporting clean-cup precision worldwide.',
  'El Salvador': 'Bourbon survivor. Civil war (1980–92) left infrastructure intact but cut yields. Old Bourbon-heritage trees never replaced means classic, sweet, balanced cups. Pacamara — discovered here, a Pacas × Maragogipe hybrid — is the country\'s signature varietal. Apaneca-Ilamatepec mountain range carries most production.',
  'Tanzania': 'Kilimanjaro\'s foothills. Arabica in the north (Mt. Meru, Kilimanjaro, Mbeya); Robusta along Lake Victoria in the west. Smallholder-dominant. Profile leans bright, winey, blackcurrant-heavy — the closest thing East Africa has to a Kenyan understudy.',
  'India': 'The monsooned country. Karnataka, Kerala, Tamil Nadu carry production; the famous Monsooned Malabar — beans deliberately exposed to monsoon winds — gives that aged, low-acid, mushroomy profile some buyers swear by. Mostly Robusta by volume; Arabica is the specialty wedge.',
  'Papua New Guinea': 'The Eastern Highlands. Smallholder-dominant — over 2.5 million people involved in coffee. Sigri and Kainantu are well-known regional names. Profile typically washed, herbal, bright; Tipica and Bourbon varietals at high altitude.',
  "Cote d'Ivoire": "West Africa's Robusta volume leader. Smallholder-driven; the Ivorian government has subsidized renovation pushes for decades. Quality reputation suffered through the 2000s civil conflict; recent rebuild focused on export logistics and replacing aging trees.",
  'Cameroon': 'Mixed Arabica and Robusta along the volcanic west and central highlands. Production has steadily fallen since the 1990s as cocoa pulled growers away. Mount Cameroon\'s slopes still produce small volumes of high-quality Arabica that rarely reach Western specialty buyers.',
  'Ecuador': 'Andean sierra Arabica. Loja, Pichincha, El Oro — small production, loud quality. Ecuadorian coffee has been a specialty insider tip for years; Galapagos has its own micro-origin marketing. Tipica and Bourbon trees still common.',
  'Venezuela': 'The collapsed origin. Once a major producer rivaling Colombia in the early 1900s; collapsed under decades of economic crisis. Mérida and Táchira Andean regions still grow excellent washed Arabica. Most exports are informal, cross-border to Colombia.',
  'Dominican Republic': 'The Caribbean producer. Cordillera Central altitudes give long, layered harvests. Mostly washed Arabica, Tipica varietal-heavy. Domestic consumption is high — a chunk of production never leaves the island. Reputation: clean, mild, slightly nutty.',
  'Angola': 'The recovering ghost. Largest Robusta producer in the world before independence in 1975 and the civil war that followed. Production collapsed by 99% from peak. Slow rebuild since 2002; the government targets a return to relevance, but the supply chain rebuild is generational.',
  'Congo (Kinshasa)': 'Robusta from the lowlands, Arabica from the Kivu lakes. Decades of conflict gutted exports; the rebirth has been led by cooperatives in eastern Kivu working with specialty buyers. Bukavu and Goma regions produce remarkable washed lots when stability allows.',
  'Madagascar': 'Robusta-dominant Indian Ocean island. Mostly smallholder-driven; coffee has lost ground to vanilla and cloves as cash crops. Eastern lowlands carry production; the country has never broken into major specialty circuits.',
  'Malaysia': 'Liberica country. One of the few origins where Coffea liberica is grown commercially — bigger beans, bigger flavor, polarizing. Most production feeds the domestic kopi market — local instant blends. Sabah and Sarawak (Borneo) supply the volume; specialty exports are minimal.',
  'China': 'Yunnan\'s quiet rise. The southwestern province now produces over 95% of China\'s coffee. Originally planted by French missionaries in the 1890s; the modern industry rebuilt in the 1980s by Nestlé. Catimor varietals dominate; specialty Arabica from higher altitudes is starting to land in international competitions.',
  'Thailand': 'Doi Chang country. Northern hill tribes grow Arabica replacing former opium fields — a Royal Project initiative starting in the 1970s that turned coffee into a poverty-reduction crop. Chiang Rai and Chiang Mai provinces dominate. Profile: balanced, soft acidity, often with dried-fruit notes.',
  'Philippines': 'The Liberica revivalist. Once a major producer in the 1880s before coffee rust destroyed the industry; the country still produces all four major species (Arabica, Robusta, Liberica, Excelsa). Batangas and Cavite remain Liberica strongholds. Cordillera Arabica is the modern specialty story.',
};
