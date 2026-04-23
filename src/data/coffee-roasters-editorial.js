// Hand-maintained editorial layer for coffee roasters.
// Wikidata gives us the catalog (facts, licensing-safe). This file gives each
// featured roaster the Guapa voice: why they matter, what they taste like,
// the stance that distinguishes them from the next roaster over.
//
// Two shapes of entry:
//  - Keyed by Wikidata QID: enriches an existing Wikidata record.
//  - Keyed by editorial slug (no qid): for roasters Wikidata does not cover
//    yet (e.g. small independents). Requires name + country + hq locally.
//
// The composed dataset in coffee-roasters.js merges both into a single list.
//
// Only roasters with a `take` show up in the UI's featured pill selector.
// Everything else stays catalog-only.

export const ROASTER_EDITORIAL = [
  // --- Editorial-only (not in Wikidata yet) ---
  {
    slug: 'panther-coffee',
    name: 'Panther Coffee',
    country: 'United States',
    hq: 'Miami, Florida',
    founded: 2010,
    founders: ['Leticia Pollock', 'Joel Pollock'],
    website: 'https://panthercoffee.com',
    instagram: 'panthercoffee',
    stance: 'direct-trade',
    take: 'Miami specialty with Latin American backbone. Joel and Leticia travel to origin, build decade-plus relationships with producers in Colombia and Nicaragua, and roast to let the fruit lead. Less Nordic-light than Heart, less dark than 1960s Italian espresso — the middle that Miami demanded.',
    regions: ['South America', 'Central America', 'Africa'],
    origins: ['Colombia', 'Nicaragua', 'Guatemala', 'Honduras', 'El Salvador', 'Costa Rica', 'Brazil', 'Ethiopia'],
  },
  {
    slug: 'onyx-coffee-lab',
    name: 'Onyx Coffee Lab',
    country: 'United States',
    hq: 'Rogers, Arkansas',
    founded: 2012,
    founders: ['Jon Allen', 'Andrea Allen'],
    website: 'https://onyxcoffeelab.com',
    instagram: 'onyxcoffeelab',
    stance: 'competition-forward',
    take: 'Arkansas of all places. Onyx built a national specialty brand on loud design, US Barista Championship hardware, and a willingness to pay auction-lot prices for single farms. If the bag looks like a graphic design thesis, it is probably theirs.',
    regions: ['South America', 'Central America', 'Africa'],
    origins: ['Ethiopia', 'Colombia', 'Costa Rica', 'Panama', 'Kenya', 'Guatemala', 'Honduras', 'Burundi', 'Rwanda', 'El Salvador'],
  },
  {
    slug: 'heart-coffee-roasters',
    name: 'Heart Coffee Roasters',
    country: 'United States',
    hq: 'Portland, Oregon',
    founded: 2009,
    founders: ['Wille Yli-Luoma'],
    website: 'https://heartroasters.com',
    instagram: 'heartroasters',
    stance: 'nordic-light',
    take: 'Finnish-born Wille Yli-Luoma brought the Scandinavian playbook to Portland: very light roasts, very clean origin expression, no hiding behind caramel. Drinks like tea, cups like fruit juice. Polarising by design.',
    regions: ['South America', 'Central America', 'Africa'],
    origins: ['Ethiopia', 'Kenya', 'Colombia', 'Guatemala', 'Burundi', 'Rwanda', 'Costa Rica'],
  },
  {
    slug: 'tim-wendelboe',
    name: 'Tim Wendelboe',
    country: 'Norway',
    hq: 'Oslo',
    founded: 2007,
    founders: ['Tim Wendelboe'],
    website: 'https://timwendelboe.no',
    instagram: 'timwendelboe',
    stance: 'nordic-light',
    take: 'The reference point for the entire Nordic light-roast movement. 2004 World Barista Champion, now owns a farm in Colombia (Finca Tamana) so the same person roasts and grows. One small shop in Oslo, hundreds of imitators globally.',
    regions: ['South America', 'Africa'],
    origins: ['Colombia', 'Kenya', 'Ethiopia', 'Brazil', 'Rwanda'],
  },
  {
    slug: 'george-howell-coffee',
    name: 'George Howell Coffee',
    country: 'United States',
    hq: 'Acton, Massachusetts',
    founded: 1974,
    founders: ['George Howell'],
    website: 'https://georgehowellcoffee.com',
    instagram: 'georgehowellcoffee',
    stance: 'origin-purist',
    take: 'George Howell invented Cup of Excellence and refused to let a bean be anything other than what it is. Barely any roast colour. No flavoured drinks. Has been arguing for single-origin transparency since before most specialty roasters were born. Boston institution.',
    regions: ['South America', 'Central America', 'Africa'],
    origins: ['Brazil', 'Guatemala', 'Ethiopia', 'Colombia', 'Costa Rica', 'El Salvador', 'Honduras', 'Nicaragua', 'Kenya'],
  },

  // --- Wikidata-matched (editorial adds voice to existing catalog record) ---
  {
    qid: 'Q14947035',
    name: 'Stumptown Coffee Roasters',
    slug: 'stumptown',
    stance: 'third-wave-pioneer',
    take: 'Duane Sorenson started Stumptown in a Portland hair salon in 1999 and more or less invented US third-wave coffee culture as we know it — direct trade, single origin, rail-car-strong espresso. Peet\'s bought them in 2015; purists argue about what changed, but the bar for American specialty still points back here.',
    regions: ['South America', 'Central America', 'Africa'],
    origins: ['Ethiopia', 'Colombia', 'Guatemala', 'Indonesia', 'Honduras', 'Rwanda', 'Costa Rica', 'Kenya'],
  },
  {
    qid: 'Q4930629',
    name: 'Blue Bottle Coffee Company',
    slug: 'blue-bottle',
    stance: 'design-forward',
    take: 'James Freeman roasted out of a potting shed in Oakland starting 2002, selling 48-hours-off-roast beans at farmers markets before that was a genre. Nestlé took a majority stake in 2017. The minimalist blue bottle logo is on airport kiosks now, which is either a win or a tell depending on your priors.',
    regions: ['South America', 'Central America', 'Africa'],
    origins: ['Ethiopia', 'Rwanda', 'Colombia', 'Guatemala', 'Kenya', 'Burundi', 'Brazil'],
  },
  {
    qid: 'Q5176575',
    name: 'Counter Culture Coffee',
    slug: 'counter-culture',
    stance: 'educator',
    take: 'Durham, NC roaster that treats coffee as curriculum. Training labs in every major US city, an annual sustainability report before the rest of the industry bothered, and a preference for washed Ethiopians roasted light enough to taste like a lemon. B Corp certified.',
    regions: ['Central America', 'Africa', 'South America'],
    origins: ['Ethiopia', 'Rwanda', 'Colombia', 'Nicaragua', 'Kenya', 'Burundi', 'Peru', 'Honduras', 'Guatemala'],
  },
  {
    qid: 'Q6460055',
    name: 'La Colombe Coffee Roasters',
    slug: 'la-colombe',
    stance: 'old-guard',
    take: 'Philadelphia roaster founded 1994, old enough to predate the third wave and pragmatic enough not to be ruined by it. Canned draft latte is the mass-market bet that worked. Their blends still taste like someone trained in Italy, which one of the founders was.',
    regions: ['South America', 'Central America', 'Africa'],
    origins: ['Brazil', 'Colombia', 'Guatemala', 'Ethiopia', 'Honduras', 'Peru'],
  },
];
