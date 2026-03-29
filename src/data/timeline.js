// Timeline event data organized by lens
// Used for event bar heights — years with entries get taller bars

export const TIMELINE = {
  guapa: {
    2024: true, 2025: true, 2026: true,
  },
  music: {
    1960: true, 1964: true, 1969: true, 1973: true, 1977: true,
    1982: true, 1991: true, 1994: true, 1999: true, 2008: true,
    2015: true, 2020: true, 2023: true, 2026: true,
  },
  // World coffee production in millions of 60kg bags (USDA/ICO historical data)
  coffee: {
    1960: 69, 1961: 60, 1962: 73, 1963: 68, 1964: 55, 1965: 78, 1966: 65,
    1967: 70, 1968: 63, 1969: 72, 1970: 63, 1971: 76, 1972: 71, 1973: 67,
    1974: 60, 1975: 82, 1976: 55, 1977: 48, 1978: 75, 1979: 82, 1980: 84,
    1981: 92, 1982: 82, 1983: 90, 1984: 83, 1985: 97, 1986: 85, 1987: 102,
    1988: 90, 1989: 95, 1990: 93, 1991: 101, 1992: 96, 1993: 93, 1994: 97,
    1995: 87, 1996: 103, 1997: 97, 1998: 106, 1999: 114, 2000: 113,
    2001: 110, 2002: 123, 2003: 106, 2004: 116, 2005: 111, 2006: 128,
    2007: 120, 2008: 128, 2009: 123, 2010: 134, 2011: 140, 2012: 149,
    2013: 150, 2014: 143, 2015: 152, 2016: 158, 2017: 162, 2018: 170,
    2019: 169, 2020: 170, 2021: 167, 2022: 172, 2023: 178, 2024: 175,
    2025: 180, 2026: 178,
  },
  economics: {
    1971: true, 1980: true, 1999: true, 2008: true, 2020: true,
    2022: true, 2023: true, 2026: true,
  },
};

// Lens metadata
export const LENS_COLORS = {
  music: '#e8a0b0', coffee: '#c89b6a', economics: '#7ec89b',
};

export const LENS_ICONS = {
  music: '\u266B', coffee: '\u2615', economics: '\u{1F4CA}',
};

export const LENS_LABELS = {
  music: 'Music', coffee: 'Coffee', economics: 'Economics',
};

// Helpers
export function hashStr(s) {
  let h = 0;
  const str = String(s);
  for (let i = 0; i < str.length; i++) h = ((h << 5) - h + str.charCodeAt(i)) | 0;
  return Math.abs(h);
}
