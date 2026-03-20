import { useState, useEffect, useMemo, useCallback } from 'react';
import { MUSIC_DATA, GENRE_ORIGINS } from '../data/music-data';
import './GenreExplorer.css';

function formatDuration(ms) {
  if (!ms) return '--:--';
  const secs = Math.floor(ms / 1000);
  return `${Math.floor(secs / 60)}:${(secs % 60).toString().padStart(2, '0')}`;
}

export default function GenreExplorer({ year, catalog, deepLink, onDeepLinkHandled }) {
  const [activeGenre, setActiveGenre] = useState(null);
  const [selectedSub, setSelectedSub] = useState(null);
  const [discoArtist, setDiscoArtist] = useState(null);
  const [discoAlbums, setDiscoAlbums] = useState(null);
  const [loading, setLoading] = useState(false);

  const base = import.meta.env.BASE_URL;

  // Deep link — find artist in MUSIC_DATA and open genre/sub/artist
  useEffect(() => {
    if (!deepLink?.artist) return;
    const target = deepLink.artist.toLowerCase();
    for (const [genreId, genre] of Object.entries(MUSIC_DATA)) {
      for (const [subId, sub] of Object.entries(genre.subgenres)) {
        for (const [artId, artist] of Object.entries(sub.artists)) {
          if (artist.name.toLowerCase() === target) {
            setActiveGenre(genreId);
            setSelectedSub(subId);
            // Build artist object matching the shape handleArtistClick expects
            const fullArtist = { id: artId, ...artist };
            // Trigger discography load
            setDiscoArtist(fullArtist);
            setDiscoAlbums(null);
            setLoading(true);
            // Load from catalog
            if (catalog) {
              const key = Object.keys(catalog).find(k =>
                catalog[k].name.toLowerCase() === target
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
                onDeepLinkHandled?.();
                return;
              }
            }
            // Fallback
            const albums = [...artist.albums]
              .sort((a, b) => (b.year || 0) - (a.year || 0))
              .map(a => ({ title: a.title, release_year: a.year, tracks: [], artistName: artist.name }));
            setDiscoAlbums(albums);
            setLoading(false);
            onDeepLinkHandled?.();
            return;
          }
        }
      }
    }
    onDeepLinkHandled?.();
  }, [deepLink, catalog, onDeepLinkHandled]);

  // Reset selections when year changes (keep genre open)
  useEffect(() => {
    if (activeGenre && selectedSub) {
      const genre = MUSIC_DATA[activeGenre];
      const sub = genre?.subgenres[selectedSub];
      if (sub && sub.status[year] === 'hidden') {
        setSelectedSub(null);
        setDiscoArtist(null);
        setDiscoAlbums(null);
      }
    }
  }, [year, activeGenre, selectedSub]);

  // Genre tabs with visible subgenre counts
  const genreTabs = useMemo(() => {
    return Object.entries(MUSIC_DATA).map(([id, genre]) => {
      const visibleCount = Object.values(genre.subgenres).filter(s => s.status[year] !== 'hidden').length;
      return { id, name: genre.name, icon: genre.icon, visibleCount };
    });
  }, [year]);

  // Visible subgenres for active genre
  const visibleSubgenres = useMemo(() => {
    if (!activeGenre) return [];
    const genre = MUSIC_DATA[activeGenre];
    if (!genre) return [];
    return Object.entries(genre.subgenres)
      .filter(([, sub]) => sub.status[year] !== 'hidden')
      .map(([id, sub]) => ({ id, ...sub, status: sub.status[year] }));
  }, [activeGenre, year]);

  // Artists for selected subgenre
  const artists = useMemo(() => {
    if (!activeGenre || !selectedSub) return [];
    const sub = MUSIC_DATA[activeGenre]?.subgenres[selectedSub];
    if (!sub) return [];
    return Object.entries(sub.artists).map(([id, a]) => ({ id, ...a }));
  }, [activeGenre, selectedSub]);

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
    }
  }, [selectedSub]);

  const handleArtistClick = useCallback(async (artist) => {
    setDiscoArtist(artist);
    setDiscoAlbums(null);
    setLoading(true);

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
    const genre = MUSIC_DATA[activeGenre];
    if (origin && year < origin.emergeYear) {
      return { genre: genre.name, year: origin.emergeYear, story: origin.story, preExist: true };
    }
    return { genre: genre.name, preExist: false };
  }, [activeGenre, visibleSubgenres, year]);

  return (
    <div className="ge">
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

      {/* Subgenre Grid */}
      {activeGenre && visibleSubgenres.length > 0 && (
        <div className="ge-subgenres">
          {visibleSubgenres.map(sub => (
            <div
              key={sub.id}
              className={`ge-sub ${sub.status} ${selectedSub === sub.id ? 'active' : ''}`}
              onClick={() => handleSubClick(sub.id)}
            >
              <div className="ge-sub-header">
                <span className="ge-sub-icon">{sub.icon}</span>
                <span className="ge-sub-name">{sub.name}</span>
              </div>
              <div className="ge-sub-artists">
                {Object.values(sub.artists).map(a => (
                  <span key={a.name}>{a.name}</span>
                ))}
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
        <div className="ge-artists">
          <div className="ge-artists-header">
            <span>{MUSIC_DATA[activeGenre]?.subgenres[selectedSub]?.icon}</span>
            <span>{MUSIC_DATA[activeGenre]?.subgenres[selectedSub]?.name}</span>
            <span className="ge-artists-meta">
              {MUSIC_DATA[activeGenre]?.name} — {MUSIC_DATA[activeGenre]?.subgenres[selectedSub]?.status[year]?.toUpperCase()} — {year}
            </span>
          </div>
          <div className="ge-artists-grid">
            {artists.map(artist => (
              <div
                key={artist.id}
                className={`ge-artist-card ${discoArtist?.name === artist.name ? 'active' : ''}`}
                onClick={() => handleArtistClick(artist)}
              >
                <span className="ge-artist-icon">{artist.icon}</span>
                <div>
                  <h4 className="ge-artist-name">{artist.name}</h4>
                  <p className="ge-artist-desc">{artist.description}</p>
                  <span className="ge-artist-count">{artist.albums.length} album{artist.albums.length !== 1 ? 's' : ''}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Discography */}
      {discoArtist && (
        <div className="ge-disco">
          <div className="ge-disco-header">
            <span className="ge-disco-icon">{discoArtist.icon}</span>
            <div>
              <h2 className="ge-disco-name">{discoArtist.name}</h2>
              <p className="ge-disco-bio">{discoArtist.description}</p>
            </div>
            <button className="ge-disco-close" onClick={() => { setDiscoArtist(null); setDiscoAlbums(null); }}>Close</button>
          </div>

          {loading ? (
            <div className="ge-disco-loading">Loading discography...</div>
          ) : discoAlbums && discoAlbums.length > 0 ? (
            <div className="ge-disco-list">
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
                  <div key={idx} className={`ge-album ${isLatest ? 'ge-album--latest' : ''}`}>
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
          ) : (
            <div className="ge-disco-loading">No album data available.</div>
          )}
        </div>
      )}
    </div>
  );
}
