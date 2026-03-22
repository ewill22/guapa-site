// Load and parse artist-editorial.csv at runtime
// Returns Map keyed by lowercase artist name → { name, confirmed, icon, description }

export async function loadEditorial(baseUrl) {
  const res = await fetch(`${baseUrl}data/artist-editorial.csv`);
  const text = await res.text();
  return parseEditorialCSV(text);
}

// Normalize curly quotes, unicode hyphens to ASCII equivalents
export function normalizeName(name) {
  return name
    .replace(/[\u2018\u2019\u2032]/g, "'")
    .replace(/[\u2010\u2013\u2014]/g, '-')
    .toLowerCase();
}

export function parseEditorialCSV(text) {
  const map = new Map();
  const lines = text.split('\n');
  if (lines.length < 2) return map;

  // Skip BOM if present
  let header = lines[0];
  if (header.charCodeAt(0) === 0xFEFF) header = header.slice(1);

  const cols = parseCSVRow(header);
  const nameIdx = cols.indexOf('name');
  const confIdx = cols.indexOf('confirmed');
  const iconIdx = cols.indexOf('icon');
  const descIdx = cols.indexOf('description');

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    const fields = parseCSVRow(line);
    const name = fields[nameIdx] || '';
    if (!name) continue;

    const entry = {
      name,
      confirmed: (fields[confIdx] || '').toLowerCase() === 'yes',
      icon: fields[iconIdx] || '',
      description: fields[descIdx] || '',
    };

    // Index by lowercase name and "the " variants, with unicode normalization
    const lower = normalizeName(name);
    map.set(lower, entry);
    if (lower.startsWith('the ')) {
      map.set(lower.slice(4), entry);
    } else {
      map.set('the ' + lower, entry);
    }
  }

  return map;
}

// Simple CSV row parser that handles quoted fields (for descriptions with commas)
function parseCSVRow(row) {
  const fields = [];
  let i = 0;
  while (i <= row.length) {
    if (i === row.length) { fields.push(''); break; }
    if (row[i] === '"') {
      // Quoted field
      let val = '';
      i++; // skip opening quote
      while (i < row.length) {
        if (row[i] === '"') {
          if (row[i + 1] === '"') { val += '"'; i += 2; }
          else { i++; break; } // closing quote
        } else {
          val += row[i]; i++;
        }
      }
      fields.push(val);
      if (row[i] === ',') i++; // skip comma after closing quote
    } else {
      // Unquoted field
      const next = row.indexOf(',', i);
      if (next === -1) { fields.push(row.slice(i)); break; }
      fields.push(row.slice(i, next));
      i = next + 1;
    }
  }
  return fields;
}
