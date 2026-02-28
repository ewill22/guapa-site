// Timeline event data organized by lens
// Each year entry: { vibe, ev: { cat, title, desc } }

export const TIMELINE = {
  world: {
    1960: { vibe: 'the space race begins', ev: { cat: 'Space', title: 'The Final Frontier', desc: 'JFK promises the moon. The Cold War goes orbital. Everything feels possible and terrifying.' }},
    1963: { vibe: 'innocence lost', ev: { cat: 'History', title: 'Dallas, November', desc: 'Kennedy assassinated. The 60s take a dark turn. Nothing feels safe anymore.' }},
    1969: { vibe: 'one giant leap', ev: { cat: 'Space', title: 'Moon Landing', desc: 'Armstrong walks on the moon. 600 million people watch. Humanity\'s greatest flex.' }},
    1970: { vibe: 'the hangover decade', ev: { cat: 'Culture', title: 'Post-60s Reality', desc: 'Vietnam drags on. Watergate looms. The optimism fades into disco and malaise.' }},
    1977: { vibe: 'a new hope', ev: { cat: 'Culture', title: 'Star Wars', desc: 'George Lucas creates a universe. Blockbusters are born. Escapism becomes an industry.' }},
    1980: { vibe: 'morning in america', ev: { cat: 'Politics', title: 'Reagan Era Begins', desc: 'Conservative revolution. MTV launches. Greed is good. The 80s arrive in neon.' }},
    1989: { vibe: 'walls come down', ev: { cat: 'History', title: 'Berlin Wall Falls', desc: 'Cold War ends with sledgehammers. History is over, they say. New world order.' }},
    1990: { vibe: 'the end of history?', ev: { cat: 'Tech', title: 'World Wide Web', desc: 'Tim Berners-Lee invents the web. Nobody knows it yet, but everything changes.' }},
    1994: { vibe: 'grunge and apathy', ev: { cat: 'Culture', title: 'Cobain\'s Last Year', desc: 'Generation X peaks. Nirvana ends. The internet starts creeping into homes.' }},
    2000: { vibe: 'y2k survived', ev: { cat: 'Tech', title: 'Dot-Com Bubble', desc: 'The millennium bug was nothing. The real crash is coming. Napster changes music forever.' }},
    2001: { vibe: 'everything changed', ev: { cat: 'History', title: 'September 11', desc: 'The towers fall. The 21st century actually begins. Security theater forever.' }},
    2007: { vibe: 'the world in your pocket', ev: { cat: 'Tech', title: 'iPhone Launches', desc: 'Steve Jobs reveals the future. Smartphones consume everything. Attention becomes currency.' }},
    2010: { vibe: 'the social era', ev: { cat: 'Tech', title: 'Social Media Dominates', desc: 'Facebook hits 500M users. Twitter drives news. Everyone becomes a broadcaster.' }},
    2016: { vibe: 'post-truth arrives', ev: { cat: 'Politics', title: 'Brexit & Trump', desc: 'Populism surges. Algorithms radicalize. Reality becomes negotiable.' }},
    2020: { vibe: 'the great pause', ev: { cat: 'History', title: 'COVID-19 Pandemic', desc: 'The world stops. Remote everything. A collective trauma we\'re still processing.' }},
    2023: { vibe: 'ai awakening', ev: { cat: 'Tech', title: 'ChatGPT Moment', desc: 'AI goes mainstream. Everyone\'s job feels uncertain. The future arrives faster than expected.' }},
    2026: { vibe: 'the algorithm age', ev: { cat: 'Now', title: 'The Age of AI', desc: 'Large language models reshape work, creativity, and how we find information. Everyone\'s trying to figure out what it means.' }},
  },
  music: {
    1960: { vibe: 'the birth of soul', ev: { cat: 'Genre', title: 'Motown Rises', desc: 'Berry Gordy builds a hit factory in Detroit. Soul becomes the sound of the world.' }},
    1964: { vibe: 'the british invasion', ev: { cat: 'Movement', title: 'Beatles Land in America', desc: 'Ed Sullivan. 73 million viewers. Rock and roll will never be the same.' }},
    1969: { vibe: 'three days of peace', ev: { cat: 'Culture', title: 'Woodstock', desc: '400,000 people on a farm. Hendrix plays the anthem. The counterculture gets its communion.' }},
    1973: { vibe: 'the bronx is burning', ev: { cat: 'Genre', title: 'Hip-Hop Is Born', desc: 'DJ Kool Herc throws a back-to-school party at 1520 Sedgwick Ave. The breakbeat is born.' }},
    1977: { vibe: 'no future', ev: { cat: 'Movement', title: 'Punk Explodes', desc: 'Sex Pistols. Ramones. The Clash. Three chords and the truth. DIY becomes an ethos.' }},
    1982: { vibe: 'the king of pop', ev: { cat: 'Album', title: 'Thriller', desc: 'Michael Jackson sells 70 million copies. Music videos become cinema.' }},
    1991: { vibe: 'smells like teen spirit', ev: { cat: 'Movement', title: 'Grunge Arrives', desc: 'Nevermind drops. Seattle is the center of the universe. Flannel replaces spandex.' }},
    1994: { vibe: 'east vs west', ev: { cat: 'Genre', title: 'Hip-Hop\'s Golden Age', desc: 'Nas drops Illmatic. Biggie rises. The coasts are at war and the music is transcendent.' }},
    1999: { vibe: 'the napster effect', ev: { cat: 'Industry', title: 'File Sharing Begins', desc: 'Napster launches. 80 million users. The music industry\'s business model starts to die.' }},
    2008: { vibe: 'streaming starts', ev: { cat: 'Industry', title: 'Spotify Launches', desc: 'A Swedish startup bets on streaming. The labels are skeptical. Listeners aren\'t.' }},
    2015: { vibe: 'the streaming era', ev: { cat: 'Industry', title: 'Streaming Dominates', desc: 'Streaming revenue surpasses downloads. Drake is everywhere. Playlists replace albums.' }},
    2020: { vibe: 'bedroom pop', ev: { cat: 'Culture', title: 'Pandemic Music', desc: 'Lockdowns produce home recordings. TikTok becomes A&R. Virality is the new radio.' }},
    2026: { vibe: 'ai producers', ev: { cat: 'Now', title: 'AI Meets Music', desc: 'Generative AI creates beats and masters tracks. The definition of "artist" is being renegotiated.' }},
  },
  tech: {
    1960: { vibe: 'mainframe era', ev: { cat: 'Computing', title: 'IBM Dominates', desc: 'Mainframes fill rooms. Computing is for corporations and governments. The era of the priesthood.' }},
    1976: { vibe: 'garage revolution', ev: { cat: 'Company', title: 'Apple Founded', desc: 'Two Steves in a garage. The Apple I is hand-built. Personal computing starts here.' }},
    1990: { vibe: 'the web is born', ev: { cat: 'Internet', title: 'World Wide Web', desc: 'Tim Berners-Lee writes HTTP, HTML, and the first browser. Information wants to be free.' }},
    1998: { vibe: 'search everything', ev: { cat: 'Company', title: 'Google Founded', desc: 'Two Stanford PhDs organize the world\'s information. PageRank changes everything.' }},
    2004: { vibe: 'the social web', ev: { cat: 'Company', title: 'Facebook Launches', desc: 'A Harvard dorm room project becomes the social graph of humanity.' }},
    2007: { vibe: 'everything is mobile', ev: { cat: 'Hardware', title: 'iPhone', desc: 'Steve Jobs: "An iPod, a phone, and an internet communicator." The pocket computer era begins.' }},
    2016: { vibe: 'AI winter ends', ev: { cat: 'AI', title: 'DeepMind Beats Go', desc: 'AlphaGo defeats Lee Sedol. The AI race begins in earnest.' }},
    2023: { vibe: 'the GPT moment', ev: { cat: 'AI', title: 'ChatGPT & LLMs', desc: 'OpenAI\'s ChatGPT reaches 100M users in 2 months. Every company pivots to AI.' }},
    2025: { vibe: 'capex supercycle', ev: { cat: 'Industry', title: '$200B AI Infra', desc: 'Amazon $200B, Alphabet $175B. The GPU buildout rivals the 1990s telecom boom.' }},
    2026: { vibe: 'agents everywhere', ev: { cat: 'Now', title: 'Agentic AI', desc: 'AI agents write code, manage workflows, and make decisions. The labor market transforms.' }},
  },
  coffee: {
    1966: { vibe: 'a dutch import', ev: { cat: 'Company', title: 'Peet\'s Opens', desc: 'Alfred Peet opens in Berkeley. He teaches America what coffee can be.' }},
    1971: { vibe: 'pike place', ev: { cat: 'Company', title: 'Starbucks Founded', desc: 'Three Peet\'s customers open a bean shop in Seattle\'s Pike Place Market.' }},
    1990: { vibe: 'second wave crests', ev: { cat: 'Movement', title: 'Second Wave Coffee', desc: 'Starbucks goes national. Espresso drinks go mainstream. Coffee becomes a lifestyle.' }},
    2002: { vibe: 'the origin matters', ev: { cat: 'Movement', title: 'Third Wave Begins', desc: 'Coffee treated like wine — terroir, processing, single origins matter.' }},
    2015: { vibe: 'light roast revolution', ev: { cat: 'Trend', title: 'Specialty Mainstream', desc: 'Light roasts and natural processing go mainstream. Blue Bottle sells to Nestlé.' }},
    2020: { vibe: 'home brewing boom', ev: { cat: 'Culture', title: 'Pandemic Coffee', desc: 'Lockdowns turn everyone into a home barista. Grinder sales skyrocket.' }},
    2026: { vibe: 'precision and access', ev: { cat: 'Now', title: 'Fourth Wave?', desc: 'Smart grinders dial in recipes. Climate change threatens arabica. Preservation is the mission.' }},
  },
  economics: {
    1971: { vibe: 'gold window closes', ev: { cat: 'Monetary', title: 'End of Gold Standard', desc: 'Nixon closes the gold window. Bretton Woods collapses. The dollar floats freely.' }},
    1980: { vibe: 'volcker shock', ev: { cat: 'Monetary', title: 'Rates Hit 20%', desc: 'Paul Volcker crushes inflation with brutal rate hikes. Recession follows.' }},
    1999: { vibe: 'irrational exuberance', ev: { cat: 'Markets', title: 'Dot-Com Peak', desc: 'Pets.com is worth billions. Greenspan warned you.' }},
    2008: { vibe: 'the great recession', ev: { cat: 'Crisis', title: 'Financial Crisis', desc: 'Lehman collapses. Housing implodes. The system nearly dies.' }},
    2020: { vibe: 'money printer go brrr', ev: { cat: 'Monetary', title: 'Pandemic Stimulus', desc: '$5 trillion in fiscal stimulus. Fed balance sheet explodes.' }},
    2022: { vibe: 'inflation arrives', ev: { cat: 'Monetary', title: 'Rate Hikes Begin', desc: 'CPI hits 9.1%. The Fed hikes aggressively. Free money era ends.' }},
    2026: { vibe: 'divergence', ev: { cat: 'Now', title: 'Two-Speed Economy', desc: 'AI sectors boom. Traditional sectors lag. The labor market transforms.' }},
  },
};

// Lens metadata
export const LENS_COLORS = {
  world: '#f0c014', music: '#e8a0b0', tech: '#6ab0e8',
  coffee: '#c89b6a', economics: '#7ec89b',
};

export const LENS_ICONS = {
  world: '◉', music: '♫', tech: '⚡', coffee: '☕', economics: '📊',
};

export const LENS_LABELS = {
  world: 'The World', music: 'Music', tech: 'Tech',
  coffee: 'Coffee', economics: 'Economics',
};

export const FULL_LABELS = {
  world: 'The World According to Guapa',
  music: 'The World of Music',
  tech: 'The World of Tech',
  coffee: 'The World of Coffee',
  economics: 'The World of Economics',
};

// Helpers
export function getEvent(lens, year) {
  const d = TIMELINE[lens];
  if (!d) return null;
  if (d[year]) return d[year];
  const yrs = Object.keys(d).map(Number).sort((a, b) => b - a);
  for (const y of yrs) if (y <= year) return d[y];
  return d[yrs[yrs.length - 1]];
}

export function hashStr(s) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = ((h << 5) - h + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}
