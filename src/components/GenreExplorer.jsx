import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { MUSIC_DATA, GENRE_ORIGINS } from '../data/music-data';
import { isConfirmed } from '../data/confirmed-artists';
import './GenreExplorer.css';

function formatDuration(ms) {
  if (!ms) return '--:--';
  const secs = Math.floor(ms / 1000);
  return `${Math.floor(secs / 60)}:${(secs % 60).toString().padStart(2, '0')}`;
}

// Use window.scrollTo instead of scrollIntoView — iOS Safari auto-zooms on scrollIntoView
function safeScrollTo(el, block = 'start') {
  if (!el) return;
  const rect = el.getBoundingClientRect();
  const scrollMargin = parseInt(getComputedStyle(el).scrollMarginTop) || 0;
  let top;
  if (block === 'center') {
    top = window.scrollY + rect.top - window.innerHeight / 2 + rect.height / 2;
  } else {
    top = window.scrollY + rect.top - scrollMargin;
  }
  window.scrollTo({ top, behavior: 'smooth' });
}

// Map catalog genre names → editorial keys
const GENRE_KEY_MAP = {
  'POP': 'pop', 'ROCK': 'rock', 'SOUL / R&B': 'soul', 'HIP HOP': 'hiphop',
  'ELECTRONIC': 'electronic', 'COUNTRY': 'country', 'FOLK': 'folk',
  'JAZZ': 'jazz', 'BLUES': 'blues', 'METAL': 'metal',
};

const GENRE_ICONS = {
  metal: '🤘', pop: '🎀', rock: '🎸', soul: '💫', hiphop: '🎤',
  electronic: '🎛️', country: '🤠', folk: '🍃', jazz: '🎷', blues: '🔵',
};

function subKey(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/_+$/, '');
}

function buildStatus(minYr, maxYr) {
  const s = {};
  for (let y = 1920; y <= 2030; y++) s[y] = 'hidden';
  if (!minYr || !maxYr) return s;
  const span = maxYr - minYr;
  for (let y = minYr; y <= maxYr; y++) {
    const pos = span > 0 ? (y - minYr) / span : 0.5;
    if (pos < 0.15) s[y] = 'emerging';
    else if (pos < 0.35) s[y] = 'rising';
    else if (pos > 0.85) s[y] = 'fading';
    else s[y] = 'peak';
  }
  // Extend fading 3 years past last album
  for (let y = maxYr + 1; y <= Math.min(maxYr + 3, 2030); y++) s[y] = 'fading';
  return s;
}

function buildMergedData(catalog, editorialData) {
  // Deep clone editorial data
  const merged = {};
  for (const [gk, genre] of Object.entries(editorialData)) {
    merged[gk] = {
      ...genre,
      subgenres: {},
    };
    for (const [sk, sub] of Object.entries(genre.subgenres)) {
      merged[gk].subgenres[sk] = {
        ...sub,
        artists: { ...sub.artists },
      };
    }
  }

  if (!catalog) return merged;

  // Index editorial artist names for fast lookup
  const editorialNames = new Set();
  for (const genre of Object.values(editorialData)) {
    for (const sub of Object.values(genre.subgenres)) {
      for (const artist of Object.values(sub.artists)) {
        editorialNames.add(artist.name.toLowerCase());
      }
    }
  }

  // Add catalog-only artists (must be guapa-confirmed)
  for (const [, catArtist] of Object.entries(catalog)) {
    if (editorialNames.has(catArtist.name.toLowerCase())) continue;
    if (!catArtist.genre || !catArtist.subgenre) continue;
    if (!isConfirmed(catArtist.name)) continue;

    const gk = GENRE_KEY_MAP[catArtist.genre] || subKey(catArtist.genre);
    const sk = subKey(catArtist.subgenre);

    // Ensure genre exists
    if (!merged[gk]) {
      merged[gk] = {
        name: catArtist.genre,
        icon: GENRE_ICONS[gk] || '🎵',
        status: buildStatus(1920, 2030),
        subgenres: {},
      };
    }

    // Ensure subgenre exists
    if (!merged[gk].subgenres[sk]) {
      // Compute year range from all catalog artists in this subgenre
      let subMin = Infinity, subMax = -Infinity;
      for (const a of Object.values(catalog)) {
        if ((a.subgenre || '') === catArtist.subgenre) {
          for (const alb of (a.albums || [])) {
            if (alb.release_year) {
              if (alb.release_year < subMin) subMin = alb.release_year;
              if (alb.release_year > subMax) subMax = alb.release_year;
            }
          }
        }
      }
      merged[gk].subgenres[sk] = {
        name: catArtist.subgenre,
        icon: '',
        status: buildStatus(subMin === Infinity ? null : subMin, subMax === -Infinity ? null : subMax),
        artists: {},
      };
    }

    // Add artist
    const ak = subKey(catArtist.name);
    const albumCount = (catArtist.albums || []).length;
    merged[gk].subgenres[sk].artists[ak] = {
      name: catArtist.name,
      icon: '',
      description: '',
      albums: (catArtist.albums || []).slice(0, 3).map(a => ({
        title: a.title,
        year: a.release_year,
      })),
      _albumCount: albumCount,
    };
  }

  return merged;
}

export default function GenreExplorer({ year, catalog, deepLink, onDeepLinkHandled }) {
  const [activeGenre, setActiveGenre] = useState(null);
  const [selectedSub, setSelectedSub] = useState(null);
  const [discoArtist, setDiscoArtist] = useState(null);
  const [discoAlbums, setDiscoAlbums] = useState(null);
  const [loading, setLoading] = useState(false);
  const [highlightAlbum, setHighlightAlbum] = useState(null);
  const pendingAlbumRef = useRef(null);
  const discoListRef = useRef(null);
  const geRef = useRef(null);
  const artistPanelRef = useRef(null);
  const discoRef = useRef(null);

  const base = import.meta.env.BASE_URL;

  // Merge editorial + catalog data
  const mergedData = useMemo(() => buildMergedData(catalog, MUSIC_DATA), [catalog]);

  // Build subgenre year ranges from catalog album-level tags
  // { "KRAUTROCK / SYNTH": { min: 1970, max: 2003 }, ... }
  const catalogSubRanges = useMemo(() => {
    if (!catalog) return {};
    const ranges = {};
    for (const artist of Object.values(catalog)) {
      if (!isConfirmed(artist.name)) continue;
      for (const album of (artist.albums || [])) {
        const sub = album.subgenre || artist.subgenre;
        const yr = album.release_year;
        if (!sub || !yr) continue;
        if (!ranges[sub]) ranges[sub] = { min: yr, max: yr };
        else {
          if (yr < ranges[sub].min) ranges[sub].min = yr;
          if (yr > ranges[sub].max) ranges[sub].max = yr;
        }
      }
    }
    return ranges;
  }, [catalog]);

  // Check if a subgenre is visible: editorial status OR catalog albums span this year
  const isSubVisible = useCallback((sub, yr) => {
    if (sub.status[yr] !== 'hidden') return true;
    const range = catalogSubRanges[sub.name];
    return range && yr >= range.min && yr <= range.max;
  }, [catalogSubRanges]);

  // Deep link — load artist discography directly (skip genre/sub navigation)
  useEffect(() => {
    if (!deepLink?.artist) return;
    const target = deepLink.artist.toLowerCase();
    pendingAlbumRef.current = deepLink.album || null;

    // Find editorial info if available (for icon/description) + genre/sub
    let editorialArtist = null;
    let foundGenre = null;
    let foundSub = null;
    for (const [genreId, genre] of Object.entries(mergedData)) {
      for (const [subId, sub] of Object.entries(genre.subgenres)) {
        for (const [artId, artist] of Object.entries(sub.artists)) {
          if (artist.name.toLowerCase() === target) {
            editorialArtist = { id: artId, ...artist };
            foundGenre = genreId;
            foundSub = subId;
            break;
          }
        }
        if (editorialArtist) break;
      }
      if (editorialArtist) break;
    }

    // Set genre/sub if found, otherwise clear
    setActiveGenre(foundGenre);
    setSelectedSub(foundSub);

    // Build artist object
    const artistObj = editorialArtist || { id: target, name: deepLink.artist, icon: '', description: '', albums: [] };
    setDiscoArtist(artistObj);
    setDiscoAlbums(null);
    setLoading(true);

    // Load from catalog
    if (catalog) {
      const key = Object.keys(catalog).find(k =>
        catalog[k].name.toLowerCase() === target
      );
      if (key && catalog[key].albums?.length) {
        const catArtist = catalog[key];
        const albums = [...catArtist.albums]
          .sort((a, b) => (b.release_year || 0) - (a.release_year || 0));
        setDiscoAlbums(albums.map(a => ({
          ...a,
          artistName: catArtist.name,
          artistWiki: catArtist.url_wikipedia,
          artistSpotify: catArtist.url_spotify,
        })));
        setLoading(false);
        onDeepLinkHandled?.();
        return;
      }
    }

    // Fallback to editorial data
    if (editorialArtist) {
      const albums = [...editorialArtist.albums]
        .sort((a, b) => (b.year || 0) - (a.year || 0))
        .map(a => ({ title: a.title, release_year: a.year, tracks: [], artistName: editorialArtist.name }));
      setDiscoAlbums(albums);
    }
    setLoading(false);
    onDeepLinkHandled?.();
  }, [deepLink, catalog, onDeepLinkHandled, mergedData]);

  // Reset selections when year changes (keep genre open)
  // Skip if a discography is showing — don't wipe it when year syncs to playing album
  useEffect(() => {
    if (discoArtist) return;
    if (activeGenre && selectedSub) {
      const genre = mergedData[activeGenre];
      const sub = genre?.subgenres[selectedSub];
      if (sub && !isSubVisible(sub, year)) {
        setSelectedSub(null);
      }
    }
  }, [year, activeGenre, selectedSub, discoArtist, isSubVisible]);

  // Scroll to specific album after discography loads
  useEffect(() => {
    if (!discoAlbums || !pendingAlbumRef.current) return;
    const targetAlbum = pendingAlbumRef.current;
    pendingAlbumRef.current = null;
    // Wait for DOM to render album cards, then scroll
    setTimeout(() => {
      const el = discoListRef.current?.querySelector(`[data-album-title="${CSS.escape(targetAlbum)}"]`);
      if (el) {
        safeScrollTo(el, 'center');
        setHighlightAlbum(targetAlbum);
        setTimeout(() => setHighlightAlbum(null), 3000);
      }
    }, 500);
  }, [discoAlbums]);

  // Genre tabs with visible subgenre counts
  const genreTabs = useMemo(() => {
    return Object.entries(mergedData).map(([id, genre]) => {
      const visibleCount = Object.values(genre.subgenres).filter(s => isSubVisible(s, year)).length;
      return { id, name: genre.name, icon: genre.icon, visibleCount };
    });
  }, [year, isSubVisible, mergedData]);

  // Visible subgenres for active genre
  const visibleSubgenres = useMemo(() => {
    if (!activeGenre) return [];
    const genre = mergedData[activeGenre];
    if (!genre) return [];
    return Object.entries(genre.subgenres)
      .filter(([, sub]) => isSubVisible(sub, year))
      .map(([id, sub]) => ({
        id, ...sub,
        status: sub.status[year] === 'hidden' ? 'fading' : sub.status[year]
      }));
  }, [activeGenre, year, isSubVisible, mergedData]);

  // Artists for selected subgenre
  const artists = useMemo(() => {
    if (!activeGenre || !selectedSub) return [];
    const sub = mergedData[activeGenre]?.subgenres[selectedSub];
    if (!sub) return [];
    return Object.entries(sub.artists).map(([id, a]) => ({ id, ...a }));
  }, [activeGenre, selectedSub, mergedData]);

  const closeAll = useCallback(() => {
    setActiveGenre(null);
    setSelectedSub(null);
    setDiscoArtist(null);
    setDiscoAlbums(null);
    // Delay scroll so state clears first, then scroll
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 50);
  }, []);

  // Escape key closes everything
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape' && (activeGenre || selectedSub || discoArtist)) {
        closeAll();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [activeGenre, selectedSub, discoArtist, closeAll]);

  const handleGenreClick = useCallback((genreId) => {
    if (activeGenre === genreId) {
      setActiveGenre(null);
      setSelectedSub(null);
      setDiscoArtist(null);
      setDiscoAlbums(null);
    } else {
      setActiveGenre(genreId);
      setSelectedSub(null);
      setDiscoArtist(null);
      setDiscoAlbums(null);
    }
  }, [activeGenre]);

  const handleSubClick = useCallback((subId) => {
    if (selectedSub === subId) {
      setSelectedSub(null);
      setDiscoArtist(null);
      setDiscoAlbums(null);
    } else {
      setSelectedSub(subId);
      setDiscoArtist(null);
      setDiscoAlbums(null);
      // Only scroll on mobile
      if (window.innerWidth <= 768) {
        setTimeout(() => {
          safeScrollTo(artistPanelRef.current);
        }, 100);
      }
    }
  }, [selectedSub]);

  const handleArtistClick = useCallback(async (artist) => {
    setDiscoArtist(artist);
    setDiscoAlbums(null);
    setLoading(true);
    setTimeout(() => {
      safeScrollTo(discoRef.current);
    }, 100);

    // Try to find real data from catalog
    if (catalog) {
      const key = Object.keys(catalog).find(k =>
        catalog[k].name.toLowerCase() === artist.name.toLowerCase()
      );
      if (key && catalog[key].albums?.length) {
        const albums = [...catalog[key].albums]
          .sort((a, b) => (b.release_year || 0) - (a.release_year || 0));
        setDiscoAlbums(albums.map(a => ({
          ...a,
          artistName: artist.name,
          artistWiki: catalog[key].url_wikipedia,
          artistSpotify: catalog[key].url_spotify,
        })));
        setLoading(false);
        return;
      }
    }

    // Fallback: use editorial data with placeholder tracks
    const albums = [...artist.albums]
      .sort((a, b) => (b.year || 0) - (a.year || 0))
      .map(a => ({
        title: a.title,
        release_year: a.year,
        tracks: [],
        artistName: artist.name,
      }));
    setDiscoAlbums(albums);
    setLoading(false);
  }, [catalog]);

  // Origin story when genre has no visible subgenres
  const originStory = useMemo(() => {
    if (!activeGenre || visibleSubgenres.length > 0) return null;
    const origin = GENRE_ORIGINS[activeGenre];
    const genre = mergedData[activeGenre];
    if (origin && year < origin.emergeYear) {
      return { genre: genre.name, year: origin.emergeYear, story: origin.story, preExist: true };
    }
    return { genre: genre.name, preExist: false };
  }, [activeGenre, visibleSubgenres, year]);

  return (
    <div className="ge" ref={geRef}>
      {/* Genre Tabs */}
      <div className="ge-tabs">
        {genreTabs.map(g => (
          <button
            key={g.id}
            className={`ge-tab ${activeGenre === g.id ? 'active' : ''}`}
            style={g.visibleCount === 0 ? { opacity: 0.3 } : {}}
            onClick={() => handleGenreClick(g.id)}
          >
            <span className="ge-tab-icon">{g.icon}</span>
            {g.name}
            <span className="ge-tab-count">{g.visibleCount}</span>
          </button>
        ))}
      </div>

      {/* Subgenre Grid — hide others when discography is open */}
      {activeGenre && visibleSubgenres.length > 0 && (
        <div className="ge-subgenres">
          {(discoArtist ? visibleSubgenres.filter(sub => sub.id === selectedSub) : visibleSubgenres).map(sub => (
            <div
              key={sub.id}
              className={`ge-sub ${sub.status} ${selectedSub === sub.id ? 'active' : ''}`}
              onClick={() => handleSubClick(sub.id)}
            >
              <div className="ge-sub-header">
                {sub.icon && <span className="ge-sub-icon">{sub.icon}</span>}
                <span className="ge-sub-name">{sub.name}</span>
                <span className="ge-sub-count">{Object.keys(sub.artists).length}</span>
              </div>
              <div className="ge-sub-artists">
                {Object.values(sub.artists).slice(0, 6).map(a => (
                  <span key={a.name}>{a.name}</span>
                ))}
                {Object.keys(sub.artists).length > 6 && (
                  <span className="ge-sub-more">+{Object.keys(sub.artists).length - 6} more</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Origin story */}
      {originStory && (
        <div className="ge-origin">
          {originStory.preExist ? (
            <>
              <p className="ge-origin-title">{originStory.genre} doesn't exist yet in {year}.</p>
              <p>{originStory.story}</p>
              <p className="ge-origin-hint">Move the timeline to <strong>{originStory.year}</strong> or later.</p>
            </>
          ) : (
            <p>No {originStory.genre.toLowerCase()} subgenres active in {year}. Try a different year.</p>
          )}
        </div>
      )}

      {/* Artist Panel */}
      {selectedSub && artists.length > 0 && (
        <div className="ge-artists" ref={artistPanelRef}>
          <div className="ge-artists-header">
            <span>{mergedData[activeGenre]?.subgenres[selectedSub]?.icon}</span>
            <span>{mergedData[activeGenre]?.subgenres[selectedSub]?.name}</span>
            <span className="ge-artists-meta" style={{
              color: { emerging: 'var(--green, #7ec89b)', rising: 'var(--blue, #88a8d4)', peak: 'var(--pink)', fading: '#a05050' }[mergedData[activeGenre]?.subgenres[selectedSub]?.status[year] === 'hidden' ? 'fading' : mergedData[activeGenre]?.subgenres[selectedSub]?.status[year]] || undefined
            }}>
              {mergedData[activeGenre]?.name} — SUBGENRE {(mergedData[activeGenre]?.subgenres[selectedSub]?.status[year] === 'hidden' ? 'FADING' : mergedData[activeGenre]?.subgenres[selectedSub]?.status[year]?.toUpperCase())} — {year}
            </span>
          </div>
          <div className="ge-artists-grid">
            {artists.map(artist => (
              <div
                key={artist.id}
                className={`ge-artist-card ${discoArtist?.name === artist.name ? 'active' : ''}`}
                onClick={() => handleArtistClick(artist)}
              >
                {artist.icon && <span className="ge-artist-icon">{artist.icon}</span>}
                <div>
                  <h4 className="ge-artist-name">{artist.name}</h4>
                  {artist.description && <p className="ge-artist-desc">{artist.description}</p>}
                  <span className="ge-artist-count">{(artist._albumCount || artist.albums.length)} album{(artist._albumCount || artist.albums.length) !== 1 ? 's' : ''}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Discography */}
      {discoArtist && (
        <div className="ge-disco" ref={discoRef}>
          <div className="ge-disco-header">
            {discoArtist.icon && <span className="ge-disco-icon">{discoArtist.icon}</span>}
            <div>
              <h2 className="ge-disco-name">
                {discoArtist.name}
                {discoAlbums && <span className="ge-disco-album-count">{discoAlbums.length} album{discoAlbums.length !== 1 ? 's' : ''}</span>}
              </h2>
            </div>
          </div>

          {loading ? (
            <div className="ge-disco-loading">Loading discography...</div>
          ) : discoAlbums && discoAlbums.length > 0 ? (
            <div className="ge-disco-body">
              <div className="ge-disco-list" ref={discoListRef}>
                {discoAlbums.map((album, idx) => {
                  const art = album.cover_art_large || album.cover_art_small;
                  const spotifyUrl = album.url_spotify || (album.spotify_id ? `https://open.spotify.com/album/${album.spotify_id}` : (album.artistSpotify || '#'));
                  const wikiTitle = (album.title || '').replace(/ /g, '_');
                  const wikiUrl = album.url_wikipedia || `https://en.wikipedia.org/wiki/${encodeURIComponent(wikiTitle)}`;
                  const amazonQ = encodeURIComponent(`${album.artistName || ''} ${album.title} vinyl`);
                  const buyUrl = album.url_amazon || `https://www.amazon.com/s?k=${amazonQ}&tag=guapainc-20`;
                  const tracks = album.tracks || [];
                  const isLatest = idx === 0;

                  return (
                    <div key={idx} className={`ge-album ${isLatest ? 'ge-album--latest' : ''} ${highlightAlbum === album.title ? 'ge-album--highlight' : ''}`} data-album-title={album.title}>
                      <div className="ge-album-header">
                        <div className="ge-album-art" style={art ? { backgroundImage: `url(${art})` } : {}} />
                        <div className="ge-album-info">
                          <span className="ge-album-year">{isLatest ? 'Latest \u00b7 ' : ''}{album.release_year || '?'}</span>
                          <span className="ge-album-artist">{album.artistName}</span>
                          <h3 className="ge-album-title">{album.title}</h3>
                          <div className="ge-album-actions">
                            <a href={spotifyUrl} target="_blank" rel="noopener" className="ge-link ge-link--spotify" onClick={e => e.stopPropagation()}>Spotify</a>
                            <a href={buyUrl} target="_blank" rel="noopener" className="ge-link ge-link--buy" onClick={e => e.stopPropagation()}>Buy Vinyl</a>
                            <a href={wikiUrl} target="_blank" rel="noopener" className="ge-link ge-link--wiki" onClick={e => e.stopPropagation()}>Wiki</a>
                          </div>
                        </div>
                      </div>
                      {tracks.length > 0 && (
                        <div className="ge-tracklist">
                          <div className="ge-tracklist-header">
                            <span className="ge-th-num">#</span>
                            <span className="ge-th-title">Title</span>
                            <span className="ge-th-dur">Time</span>
                          </div>
                          {tracks.map((t, ti) => (
                            <div key={ti} className="ge-track">
                              <span className="ge-track-num">{t.track_number || ti + 1}</span>
                              <span className="ge-track-title">
                                {t.title}
                                {t.spotify_id && (
                                  <a href={`https://open.spotify.com/track/${t.spotify_id}`} target="_blank" rel="noopener" className="ge-track-play" onClick={e => e.stopPropagation()}>&#9654;</a>
                                )}
                              </span>
                              <span className="ge-track-dur">{formatDuration(t.duration_ms)}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              {discoAlbums.length > 1 && (
                <div className="ge-nav-rail">
                  <button className="ge-nav-btn" onClick={() => {
                    const el = discoListRef.current?.querySelector('.ge-album:first-child');
                    safeScrollTo(el);
                  }}><span className="ge-nav-label">Latest Album</span><span className="ge-nav-arrow">&uarr;</span></button>
                  <button className="ge-nav-btn" onClick={() => {
                    const el = discoListRef.current?.querySelector('.ge-album:last-child');
                    safeScrollTo(el);
                  }}><span className="ge-nav-label">First Album</span><span className="ge-nav-arrow">&darr;</span></button>
                  <button className="ge-nav-btn ge-nav-btn--close" onClick={closeAll}>&times;</button>
                </div>
              )}
            </div>
          ) : (
            <div className="ge-disco-loading">No album data available.</div>
          )}
        </div>
      )}
    </div>
  );
}
