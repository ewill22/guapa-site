// Blurb data organized by lens → year
// Artist names wrapped in {curly braces} become clickable links to the music page
// Each blurb: { type: 'news'|'metric'|'trending'|'release', text, metric?, value?, change? }

export const BLURBS = {
  guapa: {
    2026: [
      { type: 'news', text: 'Guapa RE — our real estate analytics tool for Atlantic County — is now in active development. 388,000+ parcel records and counting.' },
      { type: 'update', text: 'The Music page got a full genre explorer with decade navigation, artist rankings, and subgenre browsing from 1960 to today.' },
      { type: 'update', text: 'Data Solutions page is live with a lead form. Three products listed: Guapa RE, Natural Wine Assistant, and Marketing Analytics Consulting.' },
      { type: 'news', text: 'Coffee page launched with a roaster timeline. Origins, regions, and processing methods — the start of the virtual coffee shop.' },
      { type: 'update', text: 'Guapa base design system published. Shared CSS tokens now available across all Guapa projects.' },
      { type: 'news', text: 'New lenses added to the timeline: Music, Coffee, and Economics. Select one below to dive in.' },
    ],
  },
  music: {
    2026: [
      { type: 'trending', text: '{Kendrick Lamar} drops surprise album "Mirror Land" — 200M streams in 48 hours. Critics are calling it his most introspective work since DAMN.' },
      { type: 'metric', label: 'Vinyl Sales', value: '$1.4B', change: '+8% YoY' },
      { type: 'news', text: 'AI-generated tracks are now eligible for Grammy consideration, sparking heated debate across the industry.' },
      { type: 'release', text: '{Sza} and {Frank Ocean} announce a joint EP recorded in Tokyo. No release date yet.' },
      { type: 'metric', label: 'Streaming Revenue', value: '$23.1B', change: '+12% YoY' },
      { type: 'trending', text: '{Tyler, The Creator} announces a world tour with a full orchestra. First stop: Red Rocks.' },
      { type: 'news', text: 'Bandcamp launches an artist-owned cooperative model. Independent labels are paying attention.' },
      { type: 'release', text: '{Radiohead} reissues OK Computer on vinyl with unreleased B-sides from the original sessions.' },
    ],
    2023: [
      { type: 'trending', text: 'Olivia Rodrigo dominates with GUTS — "vampire" becomes the most-streamed song of the summer.' },
      { type: 'news', text: 'AI music generation explodes. Grimes open-sources her voice. {Drake} deepfakes go viral.' },
      { type: 'metric', label: 'Global Streams', value: '4T+', change: 'Spotify hits 600M users' },
      { type: 'release', text: 'Boygenius releases "the record" — Phoebe Bridgers, Lucy Dacus, and Julien Baker deliver indie rock album of the year.' },
      { type: 'trending', text: '{Travis Scott} headlines Coachella. The production budget reportedly exceeds $10M.' },
    ],
    2020: [
      { type: 'news', text: 'Lockdowns turn bedrooms into studios. Phoebe Bridgers releases Punisher to universal acclaim.' },
      { type: 'trending', text: '{The Weeknd} drops After Hours. "Blinding Lights" becomes the #1 Billboard song of all time.' },
      { type: 'metric', label: 'Concert Revenue', value: '-$30B', change: 'Live music collapses' },
      { type: 'release', text: 'Fiona Apple returns with Fetch the Bolt Cutters — recorded entirely at home. Perfect 10 from Pitchfork.' },
      { type: 'news', text: 'TikTok becomes the primary music discovery platform. {Fleetwood Mac} re-enters the charts via a skateboarding video.' },
    ],
    2015: [
      { type: 'trending', text: '{Kendrick Lamar} releases To Pimp a Butterfly — a jazz-rap masterpiece that redefines the genre.' },
      { type: 'news', text: '{Taylor Swift} pulls her catalog from Spotify, then returns. The streaming economics debate rages.' },
      { type: 'metric', label: 'Streaming', value: '68M', change: 'Paid subscribers globally' },
      { type: 'release', text: 'Adele drops 25 — "Hello" breaks every streaming record that existed at the time.' },
      { type: 'trending', text: '{D\'Angelo} finally returns with Black Messiah after a 14-year absence. Worth the wait.' },
    ],
    2008: [
      { type: 'news', text: 'Spotify launches in Sweden. The music industry is skeptical. Listeners are not.' },
      { type: 'release', text: '{Kanye West} drops 808s & Heartbreak — auto-tune and vulnerability. It changes hip-hop forever.' },
      { type: 'trending', text: '{Radiohead} releases In Rainbows on a pay-what-you-want model. The industry panics.' },
      { type: 'metric', label: 'CD Sales', value: '-20%', change: 'Physical media in freefall' },
    ],
    1994: [
      { type: 'release', text: '{Nas} drops Illmatic — 10 tracks, 39 minutes, one of the greatest hip-hop albums ever made.' },
      { type: 'trending', text: '{The Notorious B.I.G.} releases Ready to Die. East Coast hip-hop has its king.' },
      { type: 'news', text: 'Kurt Cobain dies at 27. Grunge loses its reluctant spokesman. An era ends.' },
      { type: 'release', text: '{OutKast} drops Southernplayalisticadillacmuzik — Atlanta enters the hip-hop conversation.' },
    ],
    1991: [
      { type: 'release', text: '{Nirvana} drops Nevermind. "Smells Like Teen Spirit" kills hair metal overnight.' },
      { type: 'trending', text: '{A Tribe Called Quest} releases The Low End Theory — jazz samples meet hip-hop perfection.' },
      { type: 'release', text: 'My Bloody Valentine drops Loveless. Shoegaze peaks. Kevin Shields nearly bankrupts Creation Records.' },
      { type: 'metric', label: 'CD Sales', value: '$7.8B', change: 'CDs overtake cassettes' },
    ],
    1977: [
      { type: 'trending', text: '{Sex Pistols} release Never Mind the Bollocks. Punk is here and it doesn\'t care what you think.' },
      { type: 'release', text: '{The Clash} drop their debut. Punk with a political conscience.' },
      { type: 'news', text: 'Studio 54 opens in Manhattan. Disco is at its peak. {Donna Summer} is queen.' },
      { type: 'release', text: '{Fleetwood Mac} releases Rumours — recorded while the band falls apart. 40 million copies sold.' },
    ],
    1969: [
      { type: 'news', text: '400,000 people descend on a farm in Bethel, NY. {Jimi Hendrix} plays the Star-Spangled Banner. Woodstock becomes legend.' },
      { type: 'release', text: '{The Beatles} release Abbey Road. The rooftop concert. The long and winding road to the end.' },
      { type: 'trending', text: '{Led Zeppelin} releases their debut and Led Zeppelin II in the same year. Heavy metal is born.' },
      { type: 'release', text: '{Miles Davis} records Bitches Brew — jazz fuses with rock. Purists are furious.' },
    ],
  },
  coffee: {
    2026: [
      { type: 'news', text: 'Climate change pushes arabica growing zones 300m higher. Colombian farmers adapt with new shade-growing techniques.' },
      { type: 'metric', label: 'Specialty Market', value: '$58B', change: '+15% since 2023' },
      { type: 'trending', text: 'Smart grinders with AI-assisted dialing hit the consumer market. Niche Coffee releases the C2 at $399.' },
      { type: 'news', text: 'Natural processing overtakes washed as the preferred method among specialty roasters for the first time.' },
      { type: 'metric', label: 'Home Brewing', value: '67%', change: 'of specialty drinkers brew at home daily' },
    ],
    2023: [
      { type: 'trending', text: 'Anaerobic fermentation becomes the hottest processing method. Ethiopian producers lead the charge.' },
      { type: 'metric', label: 'Coffee Price', value: '$1.98/lb', change: 'C-price volatile all year' },
      { type: 'news', text: 'James Hoffmann hits 2M YouTube subscribers. The specialty coffee media landscape has a clear leader.' },
      { type: 'news', text: 'Robusta gets a rebrand — "fine robusta" commands specialty prices for the first time.' },
    ],
    2020: [
      { type: 'news', text: 'Lockdowns create a home brewing revolution. Grinder and espresso machine sales spike 40%.' },
      { type: 'metric', label: 'Cafe Closures', value: '16%', change: 'of independent cafes close permanently' },
      { type: 'trending', text: 'Light roast subscription boxes boom. Trade, Onyx, and Counter Culture see record signups.' },
    ],
    2015: [
      { type: 'news', text: 'Blue Bottle sells to Nestle for $500M. Third wave goes corporate. Purists mourn.' },
      { type: 'trending', text: 'Cold brew goes mainstream. Stumptown and Chameleon hit grocery shelves nationwide.' },
      { type: 'metric', label: 'Specialty Share', value: '55%', change: 'of US coffee market by value' },
    ],
    2002: [
      { type: 'news', text: 'Third wave coffee emerges. Intelligentsia, Counter Culture, and Stumptown treat coffee like wine — origin, terroir, traceability.' },
      { type: 'trending', text: 'Direct trade gains traction. Roasters visit farms, build relationships, pay premiums.' },
    ],
    1971: [
      { type: 'news', text: 'Three Peet\'s customers open a bean shop in Seattle\'s Pike Place Market. They call it Starbucks.' },
      { type: 'trending', text: 'Coffee consumption in the US hits its lowest point. The percolator era is fading.' },
    ],
  },
  economics: {
    2026: [
      { type: 'news', text: 'The two-speed economy widens. AI-driven sectors grow at 8%, traditional sectors stall at 1.2%.' },
      { type: 'metric', label: 'Fed Rate', value: '4.25%', change: 'Holding steady' },
      { type: 'trending', text: 'AI capex supercycle continues — Amazon $200B, Alphabet $175B in infrastructure spending.' },
      { type: 'metric', label: 'Housing', value: '+3.1%', change: 'Prices climb despite rate pressure' },
      { type: 'news', text: 'Remote work stabilizes at 28% of all work days. Office REITs still struggling to find a floor.' },
      { type: 'metric', label: 'S&P 500', value: '5,840', change: '+14% YTD, AI heavyweights lead' },
    ],
    2023: [
      { type: 'news', text: 'Silicon Valley Bank collapses in 48 hours. The fastest bank run in history, powered by group chats and Twitter.' },
      { type: 'metric', label: 'Inflation', value: '3.4%', change: 'Down from 9.1% peak' },
      { type: 'trending', text: 'The Fed pauses after 11 consecutive rate hikes. Markets cheer. The soft landing narrative takes hold.' },
      { type: 'news', text: 'Commercial real estate distress spreads. Office vacancy hits 20% nationally.' },
    ],
    2020: [
      { type: 'metric', label: 'GDP', value: '-3.4%', change: 'Worst contraction since WWII' },
      { type: 'news', text: 'The Fed cuts to zero and buys everything. $5T in fiscal stimulus flows into the economy.' },
      { type: 'trending', text: 'Retail trading explodes. Robinhood, GameStop, and meme stocks rewrite the rules of market participation.' },
      { type: 'metric', label: 'Unemployment', value: '14.7%', change: 'April peak, recovers to 6.7% by Dec' },
    ],
    2008: [
      { type: 'news', text: 'Lehman Brothers collapses. The financial system nearly dies. $700B TARP bailout follows.' },
      { type: 'metric', label: 'Housing', value: '-27%', change: 'Peak-to-trough nationally' },
      { type: 'trending', text: 'Credit default swaps — the financial instrument almost nobody understood — nearly destroys the global economy.' },
      { type: 'metric', label: 'Unemployment', value: '10%', change: 'by October 2009' },
    ],
    1999: [
      { type: 'news', text: 'Irrational exuberance in full swing. Pets.com IPOs at $11. It will be worth $0.19 in a year.' },
      { type: 'metric', label: 'NASDAQ', value: '5,048', change: 'Peak before the crash' },
      { type: 'trending', text: 'Every company adds ".com" to its name. Valuations defy gravity. Greenspan warned you.' },
    ],
    1980: [
      { type: 'news', text: 'Paul Volcker raises the federal funds rate to 20%. The most aggressive monetary tightening in US history.' },
      { type: 'metric', label: 'Inflation', value: '13.5%', change: 'CPI peaks' },
      { type: 'trending', text: 'Unemployment hits 7.8% and climbing. Volcker knows the recession is the cure. The pain is deliberate.' },
    ],
    1971: [
      { type: 'news', text: 'Nixon closes the gold window. The Bretton Woods system collapses. The dollar floats freely for the first time.' },
      { type: 'metric', label: 'Gold', value: '$35/oz', change: 'About to be unpegged' },
      { type: 'trending', text: 'The era of fiat currency begins. Inflation will define the next decade.' },
    ],
  },
};
