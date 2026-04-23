// Composed multi-source roaster dataset.
//
// Sources layer from ground truth up:
//   1. coffee-roasters-wikidata.js (CC0, auto-generated, named companies)
//   2. coffee-roasters-osm.js (ODbL, geographic long tail with coordinates)
//   3. coffee-roasters-editorial.js (hand-maintained Guapa voice)
//
// Every composed record carries a `sources` array so the UI can surface
// attribution pills (Wikidata, OSM, Editorial) the same way the country
// grid surfaces USDA/Conab/FNC.

import { WIKIDATA_ROASTERS, WIKIDATA_FETCHED_ON } from './coffee-roasters-wikidata';
import { OSM_ROASTERS, OSM_FETCHED_ON } from './coffee-roasters-osm';
import { ROASTER_EDITORIAL } from './coffee-roasters-editorial';

export const ROASTER_SOURCES = {
  wikidata: {
    key: 'wikidata',
    name: 'Wikidata',
    license: 'CC0',
    url: 'https://www.wikidata.org/',
    fetched: WIKIDATA_FETCHED_ON,
    note: 'Public-domain structured data from the Wikimedia Foundation. Queried via SPARQL for entities of class Q2363097 (coffee roaster).',
  },
  osm: {
    key: 'osm',
    name: 'OpenStreetMap',
    license: 'ODbL',
    url: 'https://www.openstreetmap.org/',
    fetched: OSM_FETCHED_ON,
    note: 'Volunteer-edited geographic database. Queried via Overpass for nodes tagged craft=coffee_roaster. Attribution required: (c) OpenStreetMap contributors.',
  },
  editorial: {
    key: 'editorial',
    name: 'Editorial',
    license: 'Guapa Data',
    url: null,
    fetched: null,
    note: 'Hand-written Guapa commentary. Why a roaster matters, what they taste like, the stance that distinguishes them.',
  },
};

function normaliseName(s) {
  return String(s || '').toLowerCase().replace(/[^a-z0-9]+/g, '');
}

function composeRoasters() {
  const byKey = new Map();

  for (const w of WIKIDATA_ROASTERS) {
    const key = w.qid;
    byKey.set(key, {
      id: key,
      qid: w.qid,
      slug: null,
      name: w.name,
      country: w.country,
      hq: w.hq,
      founded: w.founded,
      founders: w.founders,
      website: w.website,
      instagram: w.instagram,
      logo: w.logo,
      lat: null,
      lon: null,
      stance: null,
      take: null,
      regions: null,
      sources: ['wikidata'],
    });
  }

  const wikidataByName = new Map();
  const wikidataByQid = new Map();
  for (const w of WIKIDATA_ROASTERS) {
    wikidataByName.set(normaliseName(w.name), w.qid);
    wikidataByQid.set(w.qid, w.qid);
  }

  // OSM enrichment: OSM nodes carry a wikidata tag sometimes. When present,
  // attach coordinates + city to the matching Wikidata record. When absent,
  // add the OSM node as a standalone entry so we keep the long tail.
  for (const o of OSM_ROASTERS) {
    let targetKey = null;
    if (o.wikidata && wikidataByQid.has(o.wikidata)) {
      targetKey = o.wikidata;
    } else {
      const matchedQid = wikidataByName.get(normaliseName(o.name));
      if (matchedQid) targetKey = matchedQid;
    }
    if (targetKey) {
      const rec = byKey.get(targetKey);
      if (rec.lat == null && o.lat != null) {
        rec.lat = o.lat;
        rec.lon = o.lon;
      }
      if (!rec.hq && o.city) rec.hq = o.city;
      if (!rec.website && o.website) rec.website = o.website;
      if (!rec.sources.includes('osm')) rec.sources.push('osm');
    } else {
      const osmKey = `osm:${o.osmType}:${o.osmId}`;
      byKey.set(osmKey, {
        id: osmKey,
        qid: null,
        slug: null,
        name: o.name,
        country: o.country,
        hq: o.city,
        founded: null,
        founders: [],
        website: o.website,
        instagram: null,
        logo: null,
        lat: o.lat,
        lon: o.lon,
        stance: null,
        take: null,
        regions: null,
        sources: ['osm'],
      });
    }
  }

  for (const e of ROASTER_EDITORIAL) {
    let targetKey = null;
    if (e.qid && byKey.has(e.qid)) {
      targetKey = e.qid;
    } else {
      const matchedQid = wikidataByName.get(normaliseName(e.name));
      if (matchedQid) targetKey = matchedQid;
    }
    if (targetKey) {
      const rec = byKey.get(targetKey);
      rec.slug = e.slug || rec.slug;
      rec.stance = e.stance || rec.stance;
      rec.take = e.take || rec.take;
      rec.regions = e.regions || rec.regions;
      rec.founders = (e.founders && e.founders.length) ? e.founders : rec.founders;
      rec.country = rec.country || e.country;
      rec.hq = rec.hq || e.hq;
      rec.founded = rec.founded || e.founded;
      rec.website = rec.website || e.website;
      rec.instagram = rec.instagram || e.instagram;
      if (!rec.sources.includes('editorial')) rec.sources.push('editorial');
    } else {
      const slug = e.slug || normaliseName(e.name);
      byKey.set(`ed:${slug}`, {
        id: `ed:${slug}`,
        qid: null,
        slug,
        name: e.name,
        country: e.country || null,
        hq: e.hq || null,
        founded: e.founded || null,
        founders: e.founders || [],
        website: e.website || null,
        instagram: e.instagram || null,
        logo: null,
        stance: e.stance || null,
        take: e.take || null,
        regions: e.regions || null,
        sources: ['editorial'],
      });
    }
  }

  return [...byKey.values()].sort((a, b) => a.name.localeCompare(b.name));
}

export const COFFEE_ROASTERS = composeRoasters();

export function roastersByCountry(country) {
  return COFFEE_ROASTERS.filter(r => r.country === country);
}

export function featuredRoasters() {
  return COFFEE_ROASTERS.filter(r => r.take);
}

export function roasterBySlug(slug) {
  return COFFEE_ROASTERS.find(r => r.slug === slug) || null;
}
