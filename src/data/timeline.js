// Timeline event data organized by lens
// Used for event bar heights — years with entries get taller bars

export const TIMELINE = {
  music: {
    1960: true, 1964: true, 1969: true, 1973: true, 1977: true,
    1982: true, 1991: true, 1994: true, 1999: true, 2008: true,
    2015: true, 2020: true, 2023: true, 2026: true,
  },
  coffee: {
    1966: true, 1971: true, 1990: true, 2002: true, 2015: true,
    2020: true, 2023: true, 2026: true,
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
