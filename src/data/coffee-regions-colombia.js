// Colombia coffee departments — editorial v1
// Six departments that carry the FNC coffee axis. Geographically there are 32
// departments and most grow some coffee, but these are the ones that show up
// on every cupping table and every FNC monthly report.
//
// Source notes:
// - Altitude / harvest windows from FNC department pages and Cafe de Colombia
//   regional briefs (https://federaciondecafeteros.org).
// - Character notes are editorial, drafted in the Guapa voice.
// - Backend will eventually layer per-department production data from FNC
//   (volume, area, price). Until then this is descriptive only.

export const COLOMBIA_COFFEE_DEPARTMENTS = {
  Cauca: {
    name: 'Cauca',
    capital: 'Popayán',
    altitude: '1,700–2,100m',
    harvest: 'Mar–Jun (main), Oct–Dec (mitaca)',
    character: 'High, cold, volcanic. Bright acidity, citrus and panela. Indigenous and Afro-Colombian growers; Cauca Denomination of Origin since 2011.',
    fncRef: 'https://federaciondecafeteros.org/wp/regiones-cafeteras/cauca/',
  },
  Huila: {
    name: 'Huila',
    capital: 'Neiva',
    altitude: '1,500–2,000m',
    harvest: 'Sep–Dec (main), Apr–Jun (mitaca)',
    character: 'Largest producer in Colombia. Tropical fruit, caramel, balanced body. Magdalena valley microclimates with two harvests a year — competition lots come from here.',
    fncRef: 'https://federaciondecafeteros.org/wp/regiones-cafeteras/huila/',
  },
  Nariño: {
    name: 'Nariño',
    capital: 'Pasto',
    altitude: '1,800–2,300m',
    harvest: 'May–Aug',
    character: 'Highest in the country, right against the Ecuador border. Crystalline acidity, lemon-lime, intense sweetness. Equatorial sunlight at altitude — the Nariño signature.',
    fncRef: 'https://federaciondecafeteros.org/wp/regiones-cafeteras/narino/',
  },
  Antioquia: {
    name: 'Antioquia',
    capital: 'Medellín',
    altitude: '1,300–2,000m',
    harvest: 'Sep–Dec (main), Apr–Jun (mitaca)',
    character: 'The historical heartland. Where the FNC was founded in 1927. Rounded, chocolatey, classic Colombia profile — what most of the world thinks of as "Colombian coffee."',
    fncRef: 'https://federaciondecafeteros.org/wp/regiones-cafeteras/antioquia/',
  },
  Caldas: {
    name: 'Caldas',
    capital: 'Manizales',
    altitude: '1,300–1,800m',
    harvest: 'Sep–Dec (main), Apr–Jun (mitaca)',
    character: 'Eje Cafetero — the Coffee Axis. UNESCO Coffee Cultural Landscape. Caramel, hazelnut, soft acidity. Cenicafé research center is here; most varietal innovation in Colombia traces back to Caldas.',
    fncRef: 'https://federaciondecafeteros.org/wp/regiones-cafeteras/caldas/',
  },
  Tolima: {
    name: 'Tolima',
    capital: 'Ibagué',
    altitude: '1,400–2,000m',
    harvest: 'Apr–Jun (main), Oct–Dec (mitaca)',
    character: 'Quiet giant. Long ignored due to conflict, now one of the cleanest cup profiles on the FNC table. Stone fruit, brown sugar, structured acidity. Planadas and Gaitania are the names to know.',
    fncRef: 'https://federaciondecafeteros.org/wp/regiones-cafeteras/tolima/',
  },
};

// SVG aria-label values for the 32 departments + Bogotá. We highlight only
// the six coffee-axis departments above; the rest render as inert outlines.
export const COLOMBIA_COFFEE_DEPARTMENT_LABELS = Object.keys(COLOMBIA_COFFEE_DEPARTMENTS);

export const COLOMBIA_MAP_ATTRIBUTION = {
  source: 'svg-maps/colombia',
  author: 'Victor Cazanave',
  url: 'https://github.com/VictorCazanave/svg-maps',
  license: 'CC BY 4.0',
  licenseUrl: 'https://creativecommons.org/licenses/by/4.0/',
};
