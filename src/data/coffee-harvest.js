// Coffee harvest data - composed multi-source view.
//
// Guapa principle: never claim to be a source of truth. Always layer
// what the major government boards / industry bodies publish, with
// attribution, and point out which source is sharper for a given event.
//
// Auto-generated USDA data lives in coffee-usda.js (refresh.ps1).
// Everything below is hand-maintained - sources catalog, overlay series
// from other agencies, and editorial event annotations.
//
// Unit convention across all sources: millions of 60kg bags.

import { USDA_PRODUCERS, USDA_FETCHED_ON } from './coffee-usda';

// ============================================================
// SOURCES CATALOG - every agency / board / dataset we display,
// with enough info to cite, link to, and explain methodology.
// ============================================================

export const COFFEE_SOURCES = {
  usda: {
    key: 'usda',
    name: 'USDA FAS PSD',
    fullName: 'United States Department of Agriculture, Foreign Agricultural Service - Production, Supply & Distribution',
    country: 'United States (global coverage)',
    type: 'Foreign government agency',
    url: 'https://apps.fas.usda.gov/psdonline/',
    downloadUrl: 'https://apps.fas.usda.gov/psdonline/downloads/psd_coffee_csv.zip',
    license: 'U.S. Public Domain',
    licenseNote: 'OPEN Government Data Act - no restrictions on commercial or non-commercial use',
    attribution: 'Source: USDA FAS Production, Supply & Distribution',
    coverage: 'Global - ~29 significant producers (peak >= 1M bags)',
    yearRange: '1960 - present',
    yearConvention: 'Marketing year (country-specific: Brazil Jul-Jun, Vietnam Oct-Sep, Colombia Oct-Sep, etc.)',
    methodology: 'Overseas FAS attaché reports + USDA World Agricultural Outlook Board (WAOB) methodology',
    cadence: 'Monthly revisions; crop estimates firm up as the marketing year progresses',
    fetchedOn: USDA_FETCHED_ON,
  },
  conab: {
    key: 'conab',
    name: 'Conab',
    fullName: 'Companhia Nacional de Abastecimento',
    country: 'Brazil',
    type: 'Federal crop-forecasting agency (Ministry of Agriculture and Livestock)',
    url: 'https://www.conab.gov.br/',
    portal: 'https://portaldeinformacoes.conab.gov.br/safra-serie-historica-cafe.html',
    contact: 'conab.geasa@conab.gov.br',
    license: 'Open government data under Brazilian Lei 12.527/2011 (LAI) + Decree 8.777/2016',
    licenseNote: 'Public access and reuse; attribution required; no explicit commercial restriction',
    attribution: 'Source: Conab, Acompanhamento da Safra Brasileira - Cafe',
    coverage: 'Brazil only',
    yearRange: '2001 - present (full series pending direct pull)',
    yearConvention: 'Calendar/crop year (Brazilian harvest runs May-September)',
    methodology: 'Producer surveys + field visits + satellite monitoring (Parque Cafeeiro platform, 2024+)',
    cadence: 'Four crop surveys per year (Jan, May, Sep, Dec); Dec is the final survey',
    notes: 'Conab and USDA often disagree on Brazil production by 5-10M bags in any given year. Conab tends to be closer to on-the-ground reality during shock events (frosts, droughts); USDA smooths across the biennial Arabica cycle.',
    fetchedOn: '2026-04-18',
  },
  fnc: {
    key: 'fnc',
    name: 'FNC (Federación)',
    fullName: 'Federación Nacional de Cafeteros de Colombia',
    country: 'Colombia',
    type: 'Private non-profit producer association (est. 1927) - represents 540K+ Colombian coffee families',
    url: 'https://federaciondecafeteros.org/',
    license: 'Published openly; attribution required; not formally CC/open-licensed',
    attribution: 'Source: FNC - Federación Nacional de Cafeteros de Colombia',
    coverage: 'Colombia only',
    yearConvention: 'Coffee year (Oct-Sep)',
    methodology: 'National producer registry + monthly shipment tracking + member-farm production reports',
    cadence: 'Monthly production and export reports',
    notes: 'The FNC is also the steward of the Juan Valdez brand and Colombia\'s 100% origin mark.',
    status: 'pending - historical series to be pulled',
  },
  cecafe: {
    key: 'cecafe',
    name: 'Cecafé',
    fullName: 'Conselho Brasileiro dos Exportadores de Café',
    country: 'Brazil',
    type: 'Industry association (Brazilian coffee exporters council)',
    url: 'https://www.cecafe.com.br/en/',
    license: 'Published openly for industry and press use; attribution required',
    attribution: 'Source: Cecafé - Brazilian Coffee Exporters Council',
    coverage: 'Brazil only - export flows (not production)',
    yearConvention: 'Calendar year',
    methodology: 'Aggregated member-exporter shipment data',
    cadence: 'Weekly export bulletins + monthly + annual reports',
    notes: 'Cecafé is the sharpest read on Brazil export *flow* (what is actually leaving port), which differs from production.',
    status: 'pending - for export overlay, not production',
  },
  vicofa: {
    key: 'vicofa',
    name: 'VICOFA',
    fullName: 'Vietnam Coffee Cocoa Association',
    country: 'Vietnam',
    type: 'Industry association',
    url: 'https://vicofa.org.vn/',
    license: 'Published openly; attribution required',
    attribution: 'Source: VICOFA - Vietnam Coffee Cocoa Association',
    coverage: 'Vietnam',
    yearConvention: 'Coffee year (Oct-Sep)',
    methodology: 'Member exporter data + producer consultation',
    cadence: 'Annual production estimates + monthly export figures',
    status: 'pending',
  },
  ucda: {
    key: 'ucda',
    name: 'UCDA',
    fullName: 'Uganda Coffee Development Authority',
    country: 'Uganda',
    type: 'Statutory government authority',
    url: 'https://ugandacoffee.go.ug/',
    license: 'Published openly; attribution required',
    attribution: 'Source: UCDA - Uganda Coffee Development Authority',
    coverage: 'Uganda',
    methodology: 'Registered-exporter monthly returns + farmer registry',
    cadence: 'Monthly exports and production estimates',
    status: 'pending',
  },
  ecta: {
    key: 'ecta',
    name: 'ECTA',
    fullName: 'Ethiopian Coffee and Tea Authority',
    country: 'Ethiopia',
    type: 'Federal regulatory authority (est. 2016)',
    url: 'https://ecta.gov.et/',
    license: 'Published openly; attribution required',
    attribution: 'Source: ECTA - Ethiopian Coffee and Tea Authority',
    coverage: 'Ethiopia',
    methodology: 'Export permits + cooperative union returns + Ethiopian Commodity Exchange (ECX) data',
    cadence: 'Quarterly reports',
    status: 'pending',
  },
  ico: {
    key: 'ico',
    name: 'ICO',
    fullName: 'International Coffee Organization',
    country: 'Intergovernmental (HQ London)',
    type: 'UN-recognized intergovernmental body (est. 1963)',
    url: 'https://ico.org/',
    license: 'Member-only for full database; monthly summary reports are public',
    attribution: 'Source: International Coffee Organization',
    coverage: 'Global',
    methodology: 'Aggregates national-board figures from 49 member countries',
    cadence: 'Monthly coffee market report; annual Coffee Development Report',
    notes: 'Often used as the neutral cross-reference between USDA and national boards. Not used directly here because the full dataset is gated.',
    status: 'reference only (not ingested)',
  },
};

// ============================================================
// OVERLAY DATA - hand-curated series from non-USDA sources.
// Structure: OVERLAY_PRODUCERS[sourceKey][country] = { peak, latest, production: { year: bags } }
// ============================================================

export const OVERLAY_PRODUCERS = {
  conab: {
    // Conab Brazil historical series - SEED ONLY. Only years with firm
    // citations are populated. Full series pending direct pull from
    // portaldeinformacoes.conab.gov.br or email to conab.geasa@conab.gov.br.
    Brazil: {
      region: 'South America',
      production: {
        2021: 47.72, // Conab final survey, Dec 2021 (frost + drought year). Cited: Global Coffee Report, Rio Times.
        2022: 50.92, // Conab final survey. Cited: Revista Cultivar.
        2023: 54.94, // Conab forecast / near-final. Cited: StoneX.
        2024: 54.20, // Conab 4th survey 2024. Cited: Comunicaffe.
      },
      notes: 'Seed series only - 4 years verified from secondary citations. Full series (2001-present, quarterly) pending direct pull.',
    },
  },
  fnc: {
    Colombia: {
      region: 'South America',
      production: {},
      notes: 'Pending direct pull from federaciondecafeteros.org monthly production reports.',
    },
  },
};

// ============================================================
// EVENTS - editorial annotations where sources diverge meaningfully.
// Surface these next to the tile/bar for the relevant country x year.
// ============================================================

export const COFFEE_EVENTS = [
  {
    country: 'Brazil',
    year: 2021,
    slug: '2021-brazil-frost',
    headline: '2021 Brazil Frost',
    summary: 'Four rounds of frost hit Minas Gerais between late June and July 2021 - the most severe frost in 40-50 years. Combined with drought, it damaged over 200,000 hectares of coffee trees.',
    note: 'USDA reports Brazil 2021 at 58.1M bags; Conab\'s final survey put it at 47.72M - a 24% crop loss. The gap reflects methodology: Conab\'s farmer-surveyed damage estimate is the sharper read for this specific event, while USDA smooths across the biennial Arabica cycle.',
    preferredSource: 'conab',
    sources: ['usda', 'conab'],
  },
  // Future events to annotate as we add overlay data:
  //  - 1975 Brazil "Black Frost" (USDA shows the dip; Conab doesn't cover pre-2001)
  //  - 1989 ICA collapse (economic, not weather)
  //  - 2014 Brazil drought
  //  - 2024 Vietnam robusta price spike (supply)
];

// ============================================================
// COMPOSED: merge USDA with overlays into a single producer map.
// Each producer exposes every source that has data for it.
// ============================================================

function buildComposedProducers() {
  const out = {};
  for (const [country, usdaData] of Object.entries(USDA_PRODUCERS)) {
    out[country] = {
      region: usdaData.region,
      defaultSource: 'usda',
      sources: {
        usda: {
          peak: usdaData.peak,
          latest: usdaData.latest,
          production: usdaData.production,
        },
      },
    };
  }
  for (const [sourceKey, countries] of Object.entries(OVERLAY_PRODUCERS)) {
    for (const [country, overlayData] of Object.entries(countries)) {
      const years = Object.keys(overlayData.production).map(Number);
      if (years.length === 0) continue;
      if (!out[country]) {
        out[country] = { region: overlayData.region, defaultSource: sourceKey, sources: {} };
      }
      const values = Object.values(overlayData.production);
      const maxY = Math.max(...years);
      out[country].sources[sourceKey] = {
        peak: Math.max(...values),
        latest: { year: maxY, bags: overlayData.production[maxY] },
        production: { ...overlayData.production },
      };
    }
  }
  return out;
}

export const COFFEE_PRODUCERS = buildComposedProducers();

// ============================================================
// REGIONS metadata - stable across sources
// ============================================================

export const COFFEE_REGIONS = [
  { key: 'south-america',   name: 'South America',   color: '#7ec89b' },
  { key: 'central-america', name: 'Central America', color: '#88a8d4' },
  { key: 'africa',          name: 'Africa',          color: '#e8a0b0' },
  { key: 'asia-pacific',    name: 'Asia/Pacific',    color: '#c89b6a' },
];

// ============================================================
// GROW CALENDAR - hand-curated flowering + harvest months per
// top producer. Month indices are 1-12. Some countries have two
// harvests per year (main + fly/mitaca); we capture both.
// Sources: ICO country reports, USDA FAS attache reports.
// ============================================================

export const COFFEE_GROW_CALENDAR = {
  Brazil:              { flowering: [9, 10],    harvest: [[5, 9]],              note: 'Main Arabica harvest May-Sep; biennial cycle alternates high/low years.' },
  Colombia:            { flowering: [2, 3, 8],  harvest: [[10, 1], [4, 6]],     note: 'Two harvests: main (Oct-Jan, ~60%) and mitaca (Apr-Jun, ~40%).' },
  Vietnam:             { flowering: [1, 3],     harvest: [[10, 1]],             note: 'Robusta-dominant; concentrated Oct-Jan harvest in Central Highlands.' },
  Ethiopia:            { flowering: [3, 5],     harvest: [[10, 12]],            note: 'Dry-processed (natural) dominant; late-year harvest in Sidama/Yirgacheffe.' },
  Honduras:            { flowering: [4, 5],     harvest: [[11, 4]],             note: 'Long harvest window spanning most altitude bands.' },
  Peru:                { flowering: [9, 11],    harvest: [[4, 9]],              note: 'High-altitude Arabica; harvest Apr-Sep.' },
  Uganda:              { flowering: [2, 4, 9],  harvest: [[10, 2], [4, 6]],     note: 'Two crops: main (Oct-Feb) and fly (Apr-Jun).' },
  Indonesia:           { flowering: [9, 11],    harvest: [[4, 9]],              note: 'Robusta Sumatra/Java dominant; harvest Apr-Sep.' },
  Mexico:              { flowering: [3, 5],     harvest: [[10, 3]],             note: 'Chiapas and Veracruz dominant.' },
  Guatemala:           { flowering: [2, 4],     harvest: [[11, 3]],             note: 'Antigua, Huehuetenango regions; harvest Nov-Mar.' },
  Nicaragua:           { flowering: [3, 5],     harvest: [[10, 3]],             note: 'Jinotega and Matagalpa dominant.' },
  'Costa Rica':        { flowering: [3, 5],     harvest: [[11, 3]],             note: 'Tarrazu, Central Valley; strict wet-mill tradition.' },
  'El Salvador':       { flowering: [3, 5],     harvest: [[10, 2]],             note: 'Bourbon-heritage varietals.' },
  Kenya:               { flowering: [2, 4, 10], harvest: [[10, 12], [5, 7]],    note: 'Two crops: main (Oct-Dec) and fly (May-Jul); SL28/SL34 varietals.' },
  Tanzania:            { flowering: [9, 11],    harvest: [[7, 12]],             note: 'Arabica (North) + Robusta (West); harvest Jul-Dec.' },
  India:               { flowering: [2, 4],     harvest: [[11, 2]],             note: 'Monsooned Malabar; blossom showers trigger flowering.' },
  'Papua New Guinea':  { flowering: [8, 10],    harvest: [[4, 9]],              note: 'Smallholder-dominant, Eastern Highlands.' },
  "Cote d'Ivoire":     { flowering: [3, 5],     harvest: [[11, 4]],             note: 'Robusta-dominant.' },
  Cameroon:            { flowering: [3, 5],     harvest: [[10, 1]],             note: 'Mixed Arabica/Robusta.' },
  Ecuador:             { flowering: [10, 12],   harvest: [[5, 9]],              note: 'Arabica Sierra; harvest May-Sep.' },
  Venezuela:           { flowering: [4, 6],     harvest: [[10, 2]],             note: 'Andean Arabica; harvest Oct-Feb.' },
  'Dominican Republic':{ flowering: [3, 5],     harvest: [[10, 5]],             note: 'Long harvest window across altitude bands.' },
  Angola:               { flowering: [9, 11],    harvest: [[4, 9]],              note: 'Robusta-dominant; recovering post-war industry.' },
  'Congo (Kinshasa)':  { flowering: [2, 4, 8],  harvest: [[3, 6], [9, 12]],     note: 'Two seasons (Robusta-dominant, with Arabica in Kivu).' },
  Madagascar:          { flowering: [9, 11],    harvest: [[5, 10]],             note: 'Robusta-dominant.' },
  Malaysia:            { flowering: [2, 4],     harvest: [[3, 10]],             note: 'Liberica and Robusta; long harvest window.' },
  China:               { flowering: [3, 5],     harvest: [[11, 2]],             note: 'Yunnan-dominant Arabica; harvest Nov-Feb.' },
  Thailand:            { flowering: [3, 5],     harvest: [[10, 2]],             note: 'North Arabica + South Robusta.' },
  Philippines:         { flowering: [3, 5],     harvest: [[10, 3]],             note: 'Four species grown; varies by region.' },
};

export function growCalendarFor(country) {
  return COFFEE_GROW_CALENDAR[country] || null;
}

// Which harvest phase is a country in for a given month (1-12)?
// Returns 'flowering' | 'harvest' | 'resting' | null
export function growPhaseIn(country, month) {
  const cal = COFFEE_GROW_CALENDAR[country];
  if (!cal) return null;
  const inRange = (m, [a, b]) => (a <= b ? m >= a && m <= b : m >= a || m <= b);
  if (cal.harvest?.some(range => inRange(month, range))) return 'harvest';
  if (cal.flowering?.includes(month)) return 'flowering';
  return 'resting';
}

// ============================================================
// HELPERS - every function accepts an optional `source` arg.
// Pass null (default) to use each producer's defaultSource.
// ============================================================

function pickSeries(producer, source) {
  if (!producer) return null;
  const key = source || producer.defaultSource;
  return producer.sources[key] || producer.sources[producer.defaultSource] || null;
}

export function producerSeries(country, source = null) {
  return pickSeries(COFFEE_PRODUCERS[country], source);
}

export function regionTotal(regionName, year, source = null) {
  let total = 0;
  for (const producer of Object.values(COFFEE_PRODUCERS)) {
    if (producer.region !== regionName) continue;
    const series = pickSeries(producer, source);
    const v = series?.production?.[year];
    if (typeof v === 'number') total += v;
  }
  return Math.round(total * 100) / 100;
}

export function globalTotal(year, source = null) {
  let total = 0;
  for (const producer of Object.values(COFFEE_PRODUCERS)) {
    const series = pickSeries(producer, source);
    const v = series?.production?.[year];
    if (typeof v === 'number') total += v;
  }
  return Math.round(total * 100) / 100;
}

export function countriesInRegion(regionName, year = null, source = null) {
  const out = [];
  for (const [country, producer] of Object.entries(COFFEE_PRODUCERS)) {
    if (producer.region !== regionName) continue;
    const series = pickSeries(producer, source);
    if (!series) continue;
    if (year !== null) {
      const v = series.production[year];
      if (typeof v !== 'number' || v <= 0) continue;
      out.push({ country, bags: v, source: source || producer.defaultSource });
    } else {
      out.push({ country, bags: series.latest.bags, year: series.latest.year, source: source || producer.defaultSource });
    }
  }
  return out.sort((a, b) => b.bags - a.bags);
}

export function eventsFor(country, year = null) {
  return COFFEE_EVENTS.filter(e =>
    e.country === country && (year === null || e.year === year)
  );
}

export function sourcesForProducer(country) {
  const producer = COFFEE_PRODUCERS[country];
  if (!producer) return [];
  return Object.keys(producer.sources);
}
