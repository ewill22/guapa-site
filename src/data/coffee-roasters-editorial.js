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

export const ROASTER_EDITORIAL = [
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
    sources: ['editorial'],
  },
];
