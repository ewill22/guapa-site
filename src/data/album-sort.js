// Album sort utilities — consistent ordering across the entire site
//
// Priority: release_date (YYYY-MM-DD) > release_year > catalog index (_idx)
// release_date comes from Spotify API enrichment (backend pipeline)
// Until the backend populates release_date, catalog index is the tiebreaker
//
// IMPORTANT: Always .map((a, i) => ({ ...a, _idx: i })) before sorting
// to capture the original catalog array position as the final tiebreaker.

function compareDates(a, b) {
  if (a.release_date && b.release_date) {
    if (a.release_date < b.release_date) return -1;
    if (a.release_date > b.release_date) return 1;
    return 0;
  }
  // If only one has a date, it wins (more precise)
  if (a.release_date && !b.release_date) return -1;
  if (!a.release_date && b.release_date) return 1;
  return 0;
}

// Ascending: oldest first (playback order, aux schedule)
export function sortAlbumsAsc(albums) {
  return albums
    .map((a, i) => ({ ...a, _idx: i }))
    .sort((a, b) =>
      (a.release_year || 0) - (b.release_year || 0) ||
      compareDates(a, b) ||
      a._idx - b._idx
    );
}

// Descending: newest first (disco list, genre explorer)
export function sortAlbumsDesc(albums) {
  return albums
    .map((a, i) => ({ ...a, _idx: i }))
    .sort((a, b) =>
      (b.release_year || 0) - (a.release_year || 0) ||
      compareDates(b, a) ||
      b._idx - a._idx
    );
}
