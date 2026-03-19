// Music genre data — extracted from music.html
// Genre → Subgenre → Artist hierarchy with status per year

const MIN_YEAR = 1960;
const MAX_YEAR = 2025;

function S(ranges) {
  const s = {};
  for (let y = MIN_YEAR; y <= MAX_YEAR; y++) s[y] = 'hidden';
  ranges.forEach(([start, end, status]) => {
    for (let y = start; y <= end; y++) s[y] = status;
  });
  return s;
}

export const MUSIC_DATA = {
            pop: {
                name: "POP", icon: "🎀",
                status: S([[1960, 2025, 'peak']]),
                subgenres: {
                    teen_pop_60s: { name: "TEEN POP", icon: "💖",
                        status: S([[1960, 1963, 'peak'], [1964, 1966, 'fading']]),
                        artists: {
                            ronettes: { name: "The Ronettes", icon: "💄", description: "Be My Baby. Phil Spector's wall of sound, Ronnie's voice on top.", albums: [{ title: "Presenting the Fabulous Ronettes", year: 1964 }] },
                            lesley_gore: { name: "Lesley Gore", icon: "🎂", description: "It's My Party. Teen pop with backbone.", albums: [{ title: "I'll Cry If I Want To", year: 1963 }] }
                        }
                    },
                    bubblegum: { name: "BUBBLEGUM", icon: "🫧",
                        status: S([[1966, 1967, 'emerging'], [1968, 1969, 'peak'], [1970, 1972, 'fading']]),
                        artists: {
                            archies: { name: "The Archies", icon: "🎪", description: "Sugar Sugar. A cartoon band that outsold the Beatles in 1969.", albums: [{ title: "Everything's Archie", year: 1969 }] },
                            monkees: { name: "The Monkees", icon: "🐒", description: "Manufactured for TV, became real. Hey Hey.", albums: [{ title: "The Monkees", year: 1966 }, { title: "Headquarters", year: 1967 }] }
                        }
                    },
                    glam_pop: { name: "GLAM", icon: "✨",
                        status: S([[1970, 1971, 'emerging'], [1972, 1974, 'peak'], [1975, 1977, 'fading']]),
                        artists: {
                            bowie: { name: "David Bowie", icon: "⚡", description: "Ziggy Stardust. Chameleon. Alien. The most important artist of the 70s.", albums: [{ title: "Hunky Dory", year: 1971 }, { title: "Ziggy Stardust", year: 1972 }, { title: "Aladdin Sane", year: 1973 }, { title: "Low", year: 1977 }] },
                            t_rex: { name: "T. Rex", icon: "🦖", description: "Marc Bolan. Electric Warrior. Invented glam rock over a weekend.", albums: [{ title: "Electric Warrior", year: 1971 }, { title: "The Slider", year: 1972 }] },
                            elton: { name: "Elton John", icon: "🎹", description: "Tiny Dancer. Rocket Man. Spectacles and sequins over pure songcraft.", albums: [{ title: "Goodbye Yellow Brick Road", year: 1973 }, { title: "Captain Fantastic", year: 1975 }] }
                        }
                    },
                    synth_pop: { name: "SYNTH POP", icon: "🔮",
                        status: S([[1978, 1979, 'emerging'], [1980, 1982, 'rising'], [1983, 1986, 'peak'], [1987, 1990, 'fading']]),
                        artists: {
                            depeche: { name: "Depeche Mode", icon: "⬛", description: "Basildon boys who made darkness danceable. Never stopped.", albums: [{ title: "Speak & Spell", year: 1981 }, { title: "Violator", year: 1990 }] },
                            new_order: { name: "New Order", icon: "💠", description: "From the ashes of Joy Division. Blue Monday changed everything.", albums: [{ title: "Power, Corruption & Lies", year: 1983 }, { title: "Technique", year: 1989 }] },
                            tears: { name: "Tears for Fears", icon: "🌍", description: "Everybody Wants to Rule the World. Ambition as pop.", albums: [{ title: "Songs from the Big Chair", year: 1985 }] }
                        }
                    },
                    mtv_pop: { name: "MTV POP", icon: "📺",
                        status: S([[1981, 1982, 'emerging'], [1983, 1988, 'peak'], [1989, 1992, 'fading']]),
                        artists: {
                            mj: { name: "Michael Jackson", icon: "🌟", description: "The King of Pop. Thriller. Moonwalk. Changed music, dance, video, everything.", albums: [{ title: "Off the Wall", year: 1979 }, { title: "Thriller", year: 1982 }, { title: "Bad", year: 1987 }] },
                            madonna: { name: "Madonna", icon: "👸", description: "Material Girl to icon. Reinvented herself every era.", albums: [{ title: "Like a Virgin", year: 1984 }, { title: "True Blue", year: 1986 }, { title: "Ray of Light", year: 1998 }] },
                            prince: { name: "Prince", icon: "💜", description: "Purple Rain. Genius. Played every instrument. Danced harder than anyone.", albums: [{ title: "1999", year: 1982 }, { title: "Purple Rain", year: 1984 }, { title: "Sign o' the Times", year: 1987 }] }
                        }
                    },
                    boy_bands: { name: "BOY BANDS / TEEN POP", icon: "💅",
                        status: S([[1996, 1997, 'rising'], [1998, 2001, 'peak'], [2002, 2004, 'fading']]),
                        artists: {
                            nsync: { name: "*NSYNC", icon: "⭐", description: "Bye Bye Bye. JT origin story. Pop perfection.", albums: [{ title: "*NSYNC", year: 1998 }, { title: "No Strings Attached", year: 2000 }] },
                            backstreet: { name: "Backstreet Boys", icon: "🖤", description: "I Want It That Way. Sold 100 million records.", albums: [{ title: "Millennium", year: 1999 }] },
                            spice_girls: { name: "Spice Girls", icon: "🌶️", description: "Girl Power. Wannabe. Five personalities, one cultural earthquake.", albums: [{ title: "Spice", year: 1996 }] }
                        }
                    },
                    modern_pop: { name: "STREAMING POP", icon: "📱",
                        status: S([[2008, 2011, 'emerging'], [2012, 2015, 'rising'], [2016, 2025, 'peak']]),
                        artists: {
                            taylor: { name: "Taylor Swift", icon: "🐍", description: "Country kid turned pop titan turned indie. Eras Tour broke records.", albums: [{ title: "1989", year: 2014 }, { title: "folklore", year: 2020 }, { title: "Midnights", year: 2022 }] },
                            billie: { name: "Billie Eilish", icon: "🕷️", description: "Bedroom pop to global domination. Whispered a generation into existence.", albums: [{ title: "When We All Fall Asleep...", year: 2019 }, { title: "Happier Than Ever", year: 2021 }] },
                            weeknd: { name: "The Weeknd", icon: "🌙", description: "Abel Tesfaye. Dark R&B turned stadium pop. Blinding Lights.", albums: [{ title: "Trilogy", year: 2012 }, { title: "After Hours", year: 2020 }] }
                        }
                    }
                }
            },
            rock: {
                name: "ROCK", icon: "🎸",
                status: S([[1960, 2025, 'peak']]),
                subgenres: {
                    rock_and_roll: { name: "ROCK & ROLL", icon: "🎹",
                        status: S([[1960, 1961, 'peak'], [1962, 1969, 'fading']]),
                        artists: {
                            elvis: { name: "Elvis Presley", icon: "👑", description: "The King. Took blues and country, made it dangerous, then safe, then strange again.", albums: [{ title: "Elvis Is Back!", year: 1960 }, { title: "From Elvis in Memphis", year: 1969 }] },
                            chuck_berry: { name: "Chuck Berry", icon: "🦆", description: "Invented the rock guitar solo. Every riff traces back here.", albums: [{ title: "Chuck Berry Is on Top", year: 1959 }, { title: "St. Louis to Liverpool", year: 1964 }] }
                        }
                    },
                    british_invasion: { name: "BRITISH INVASION", icon: "🇬🇧",
                        status: S([[1962, 1963, 'emerging'], [1964, 1966, 'peak'], [1967, 1969, 'fading']]),
                        artists: {
                            beatles: { name: "The Beatles", icon: "🍏", description: "Liverpool four-piece that rewrote the rules. Again. And again.", albums: [{ title: "A Hard Day's Night", year: 1964 }, { title: "Rubber Soul", year: 1965 }, { title: "Revolver", year: 1966 }, { title: "Abbey Road", year: 1969 }] },
                            rolling_stones: { name: "Rolling Stones", icon: "👅", description: "The anti-Beatles. Blues, swagger, menace.", albums: [{ title: "Out of Our Heads", year: 1965 }, { title: "Aftermath", year: 1966 }, { title: "Let It Bleed", year: 1969 }, { title: "Sticky Fingers", year: 1971 }, { title: "Exile on Main St.", year: 1972 }] },
                            the_who: { name: "The Who", icon: "💥", description: "Maximum R&B. Townshend's windmill, Moon's chaos.", albums: [{ title: "My Generation", year: 1965 }, { title: "Tommy", year: 1969 }, { title: "Who's Next", year: 1971 }] },
                            them: { name: "Them", icon: "🔥", description: "Belfast R&B. Van Morrison's raw start. Gloria.", albums: [{ title: "The Angry Young Them", year: 1965 }, { title: "Them Again", year: 1966 }] }
                        }
                    },
                    psychedelic: { name: "PSYCHEDELIC", icon: "🌀",
                        status: S([[1965, 1966, 'emerging'], [1967, 1968, 'peak'], [1969, 1972, 'fading']]),
                        artists: {
                            hendrix: { name: "Jimi Hendrix", icon: "🔥", description: "Rewired the electric guitar. Seattle via London via another dimension.", albums: [{ title: "Are You Experienced", year: 1967 }, { title: "Electric Ladyland", year: 1968 }] },
                            doors: { name: "The Doors", icon: "🚪", description: "Morrison's poetry, Manzarek's keys. LA noir meets Dionysus.", albums: [{ title: "The Doors", year: 1967 }, { title: "Strange Days", year: 1967 }] },
                            jefferson_airplane: { name: "Jefferson Airplane", icon: "✈️", description: "San Francisco's flagship. Grace Slick's voice cut through the haze.", albums: [{ title: "Surrealistic Pillow", year: 1967 }, { title: "Crown of Creation", year: 1968 }] }
                        }
                    },
                    surf: { name: "SURF ROCK", icon: "🏄",
                        status: S([[1960, 1961, 'rising'], [1962, 1963, 'peak'], [1964, 1966, 'fading']]),
                        artists: {
                            beach_boys: { name: "The Beach Boys", icon: "☀️", description: "California myth-makers. Brian Wilson's genius took them far beyond surfing.", albums: [{ title: "Surfin' USA", year: 1963 }, { title: "Pet Sounds", year: 1966 }] },
                            dick_dale: { name: "Dick Dale", icon: "🌊", description: "King of the Surf Guitar. Misirlou. That reverb.", albums: [{ title: "Surfers' Choice", year: 1962 }] }
                        }
                    },
                    classic_rock: { name: "CLASSIC / ARENA ROCK", icon: "🏟️",
                        status: S([[1968, 1969, 'emerging'], [1970, 1972, 'rising'], [1973, 1979, 'peak'], [1980, 1985, 'fading']]),
                        artists: {
                            led_zep: { name: "Led Zeppelin", icon: "🔨", description: "The hammer of the gods. Bonham, Page, Plant, Jones. Heavy.", albums: [{ title: "Led Zeppelin II", year: 1969 }, { title: "Led Zeppelin IV", year: 1971 }, { title: "Physical Graffiti", year: 1975 }] },
                            pink_floyd: { name: "Pink Floyd", icon: "🌈", description: "Dark Side. The Wall. Comfortably Numb. Art as stadium rock.", albums: [{ title: "Dark Side of the Moon", year: 1973 }, { title: "Wish You Were Here", year: 1975 }, { title: "The Wall", year: 1979 }] },
                            queen: { name: "Queen", icon: "👑", description: "Freddie Mercury's range. Brian May's guitar. Bohemian Rhapsody.", albums: [{ title: "A Night at the Opera", year: 1975 }, { title: "News of the World", year: 1977 }] },
                            fleetwood_pop: { name: "Fleetwood Mac", icon: "🐦", description: "Reinvented as pop-rock royalty. Rumours: heartbreak as art.", albums: [{ title: "Fleetwood Mac", year: 1975 }, { title: "Rumours", year: 1977 }] }
                        }
                    },
                    punk: { name: "PUNK", icon: "🦴",
                        status: S([[1974, 1975, 'emerging'], [1976, 1978, 'peak'], [1979, 1981, 'fading'], [1993, 1996, 'rising'], [1997, 2000, 'peak'], [2001, 2005, 'fading']]),
                        artists: {
                            ramones: { name: "Ramones", icon: "🦅", description: "Queens. 1-2-3-4! Two-minute songs that launched a thousand bands.", albums: [{ title: "Ramones", year: 1976 }, { title: "Rocket to Russia", year: 1977 }] },
                            sex_pistols: { name: "Sex Pistols", icon: "🔧", description: "Anarchy in the UK. One album. Changed everything.", albums: [{ title: "Never Mind the Bollocks", year: 1977 }] },
                            clash: { name: "The Clash", icon: "⭐", description: "The only band that matters. Punk plus reggae plus everything.", albums: [{ title: "The Clash", year: 1977 }, { title: "London Calling", year: 1979 }] },
                            green_day: { name: "Green Day", icon: "💣", description: "Brought punk to the suburbs. Dookie to American Idiot.", albums: [{ title: "Dookie", year: 1994 }, { title: "American Idiot", year: 2004 }] }
                        }
                    },
                    new_wave: { name: "NEW WAVE / POST-PUNK", icon: "📻",
                        status: S([[1977, 1978, 'emerging'], [1979, 1981, 'rising'], [1982, 1985, 'peak'], [1986, 1989, 'fading']]),
                        artists: {
                            talking_heads: { name: "Talking Heads", icon: "🏠", description: "David Byrne's big suit. Psycho Killer. Same as it ever was.", albums: [{ title: "Remain in Light", year: 1980 }, { title: "Speaking in Tongues", year: 1983 }] },
                            the_cure: { name: "The Cure", icon: "💋", description: "Robert Smith's lipstick and hair. Goth, pop, heartbreak, joy.", albums: [{ title: "Disintegration", year: 1989 }, { title: "Wish", year: 1992 }] },
                            joy_division: { name: "Joy Division", icon: "📊", description: "Ian Curtis. Unknown Pleasures. Atmosphere. Post-punk's beating heart.", albums: [{ title: "Unknown Pleasures", year: 1979 }, { title: "Closer", year: 1980 }] }
                        }
                    },
                    grunge: { name: "GRUNGE", icon: "🌧️",
                        status: S([[1988, 1990, 'emerging'], [1991, 1992, 'rising'], [1993, 1996, 'peak'], [1997, 2000, 'fading']]),
                        artists: {
                            nirvana: { name: "Nirvana", icon: "😐", description: "Nevermind. Kurt Cobain screamed and whispered a generation awake.", albums: [{ title: "Nevermind", year: 1991 }, { title: "In Utero", year: 1993 }] },
                            pearl_jam: { name: "Pearl Jam", icon: "🌊", description: "Eddie Vedder's baritone. Ten. Alive. Still going.", albums: [{ title: "Ten", year: 1991 }, { title: "Vs.", year: 1993 }] },
                            soundgarden: { name: "Soundgarden", icon: "🕳️", description: "Chris Cornell's voice. Black Hole Sun. Heavy, strange, beautiful.", albums: [{ title: "Badmotorfinger", year: 1991 }, { title: "Superunknown", year: 1994 }] },
                            alice: { name: "Alice in Chains", icon: "⛓️", description: "Layne Staley and Jerry Cantrell. Harmonies from the abyss.", albums: [{ title: "Dirt", year: 1992 }, { title: "Jar of Flies", year: 1994 }] }
                        }
                    },
                    britpop: { name: "BRITPOP", icon: "🇬🇧",
                        status: S([[1993, 1994, 'rising'], [1995, 1997, 'peak'], [1998, 2000, 'fading']]),
                        artists: {
                            oasis: { name: "Oasis", icon: "🌅", description: "Gallagher brothers. Wonderwall. Definitely Maybe. Lads.", albums: [{ title: "Definitely Maybe", year: 1994 }, { title: "(What's the Story) Morning Glory?", year: 1995 }] },
                            blur: { name: "Blur", icon: "🎨", description: "Damon Albarn's art school cool. Parklife to experimental.", albums: [{ title: "Parklife", year: 1994 }, { title: "Blur", year: 1997 }] },
                            radiohead: { name: "Radiohead", icon: "🤖", description: "OK Computer. Kid A. Kept evolving past everyone.", albums: [{ title: "The Bends", year: 1995 }, { title: "OK Computer", year: 1997 }, { title: "Kid A", year: 2000 }, { title: "In Rainbows", year: 2007 }] }
                        }
                    },
                    indie_rock: { name: "INDIE ROCK", icon: "🎪",
                        status: S([[1998, 2001, 'emerging'], [2002, 2005, 'rising'], [2006, 2015, 'peak'], [2016, 2025, 'fading']]),
                        artists: {
                            strokes: { name: "The Strokes", icon: "🗽", description: "Is This It. NYC garage revival. Made rock cool again in 2001.", albums: [{ title: "Is This It", year: 2001 }, { title: "Room on Fire", year: 2003 }] },
                            arcade_fire: { name: "Arcade Fire", icon: "🔥", description: "Montreal collective. Funeral. Arena indie before that was a thing.", albums: [{ title: "Funeral", year: 2004 }, { title: "The Suburbs", year: 2010 }] },
                            white_stripes: { name: "The White Stripes", icon: "🔴", description: "Jack and Meg. Two people, one guitar, one drum kit. Seven Nation Army.", albums: [{ title: "White Blood Cells", year: 2001 }, { title: "Elephant", year: 2003 }] },
                            tame: { name: "Tame Impala", icon: "🌀", description: "Kevin Parker's one-man psych-pop universe. Currents changed the game.", albums: [{ title: "Lonerism", year: 2012 }, { title: "Currents", year: 2015 }] }
                        }
                    }
                }
            },
            soul: {
                name: "SOUL / R&B", icon: "💫",
                status: S([[1960, 2025, 'peak']]),
                subgenres: {
                    motown: { name: "MOTOWN", icon: "🏭",
                        status: S([[1960, 1962, 'rising'], [1963, 1972, 'peak'], [1973, 1978, 'fading']]),
                        artists: {
                            supremes: { name: "The Supremes", icon: "💎", description: "Diana Ross and Motown's crown jewels. Hit after hit.", albums: [{ title: "Where Did Our Love Go", year: 1964 }, { title: "I Hear a Symphony", year: 1966 }] },
                            temptations: { name: "The Temptations", icon: "🕺", description: "My Girl. Five voices, perfect choreography, unstoppable.", albums: [{ title: "The Temptations Sing Smokey", year: 1965 }, { title: "Cloud Nine", year: 1969 }] },
                            stevie_wonder: { name: "Stevie Wonder", icon: "🎹", description: "Little Stevie became a genius. The 70s run is untouchable.", albums: [{ title: "Uptight", year: 1966 }, { title: "Innervisions", year: 1973 }, { title: "Songs in the Key of Life", year: 1976 }] },
                            marvin_gaye: { name: "Marvin Gaye", icon: "🎤", description: "What's Going On. Let's Get It On. Soul with a conscience.", albums: [{ title: "How Sweet It Is", year: 1965 }, { title: "What's Going On", year: 1971 }, { title: "Let's Get It On", year: 1973 }] }
                        }
                    },
                    southern_soul: { name: "SOUTHERN SOUL", icon: "🌙",
                        status: S([[1960, 1961, 'emerging'], [1962, 1963, 'rising'], [1964, 1968, 'peak'], [1969, 1973, 'fading']]),
                        artists: {
                            otis: { name: "Otis Redding", icon: "💙", description: "Stax's greatest voice. Raw, urgent, gone too soon.", albums: [{ title: "Otis Blue", year: 1965 }, { title: "Dictionary of Soul", year: 1966 }] },
                            aretha: { name: "Aretha Franklin", icon: "👑", description: "The Queen. Respect. That's it. That's the description.", albums: [{ title: "I Never Loved a Man", year: 1967 }, { title: "Lady Soul", year: 1968 }] },
                            sam_cooke: { name: "Sam Cooke", icon: "✨", description: "Gospel smoothness turned secular. A Change Is Gonna Come.", albums: [{ title: "Night Beat", year: 1963 }, { title: "Ain't That Good News", year: 1964 }] }
                        }
                    },
                    funk: { name: "FUNK", icon: "🔊",
                        status: S([[1965, 1967, 'emerging'], [1968, 1969, 'rising'], [1970, 1979, 'peak'], [1980, 1985, 'fading']]),
                        artists: {
                            james_brown: { name: "James Brown", icon: "🦶", description: "The Godfather. Invented funk. The one.", albums: [{ title: "Live at the Apollo", year: 1963 }, { title: "I Got You", year: 1966 }, { title: "The Payback", year: 1974 }] },
                            sly_stone: { name: "Sly & The Family Stone", icon: "🌈", description: "Integrated band, integrated sound. Everyday People.", albums: [{ title: "Stand!", year: 1969 }, { title: "There's a Riot Goin' On", year: 1971 }] },
                            parliament: { name: "Parliament-Funkadelic", icon: "🛸", description: "George Clinton's mothership. One nation under a groove.", albums: [{ title: "Mothership Connection", year: 1975 }, { title: "One Nation Under a Groove", year: 1978 }] },
                            earth_wind: { name: "Earth, Wind & Fire", icon: "🌍", description: "September. Boogie Wonderland. Joy as a musical philosophy.", albums: [{ title: "That's the Way of the World", year: 1975 }, { title: "All 'N All", year: 1977 }] }
                        }
                    },
                    disco: { name: "DISCO", icon: "🪩",
                        status: S([[1974, 1975, 'emerging'], [1976, 1977, 'rising'], [1978, 1979, 'peak'], [1980, 1982, 'fading']]),
                        artists: {
                            bee_gees: { name: "Bee Gees", icon: "🕺", description: "Stayin' Alive. The Gibbs brothers owned Saturday night.", albums: [{ title: "Saturday Night Fever", year: 1977 }] },
                            donna_summer: { name: "Donna Summer", icon: "🔥", description: "Queen of Disco. I Feel Love. Moroder's synths + her voice.", albums: [{ title: "I Remember Yesterday", year: 1977 }, { title: "Bad Girls", year: 1979 }] },
                            chic: { name: "Chic", icon: "🎸", description: "Nile Rodgers and Bernard Edwards. Le Freak. Good Times. The groove.", albums: [{ title: "C'est Chic", year: 1978 }, { title: "Risqué", year: 1979 }] }
                        }
                    },
                    neo_soul: { name: "NEO-SOUL", icon: "🌿",
                        status: S([[1995, 1997, 'emerging'], [1998, 2003, 'peak'], [2004, 2010, 'fading']]),
                        artists: {
                            dangelo: { name: "D'Angelo", icon: "🙏", description: "Voodoo. Brown Sugar. Made R&B organic and raw again.", albums: [{ title: "Brown Sugar", year: 1995 }, { title: "Voodoo", year: 2000 }, { title: "Black Messiah", year: 2014 }] },
                            erykah: { name: "Erykah Badu", icon: "🌻", description: "Baduizm. High priestess of neo-soul. Analog Girl in a Digital World.", albums: [{ title: "Baduizm", year: 1997 }, { title: "Mama's Gun", year: 2000 }] },
                            lauryn: { name: "Lauryn Hill", icon: "👸", description: "Miseducation. One perfect solo album. That's enough.", albums: [{ title: "The Miseducation of Lauryn Hill", year: 1998 }] },
                            amy: { name: "Amy Winehouse", icon: "🖤", description: "Back to Black. Voice from another era trapped in this one.", albums: [{ title: "Frank", year: 2003 }, { title: "Back to Black", year: 2006 }] }
                        }
                    },
                    modern_rnb: { name: "MODERN R&B", icon: "💫",
                        status: S([[2010, 2013, 'emerging'], [2014, 2025, 'peak']]),
                        artists: {
                            frank_ocean: { name: "Frank Ocean", icon: "🌊", description: "Channel Orange. Blonde. Redefined vulnerability in R&B.", albums: [{ title: "Channel Orange", year: 2012 }, { title: "Blonde", year: 2016 }] },
                            sza: { name: "SZA", icon: "🦋", description: "Ctrl. SOS. Messy, honest, enormous. Generation-defining.", albums: [{ title: "Ctrl", year: 2017 }, { title: "SOS", year: 2022 }] },
                            beyonce: { name: "Beyoncé", icon: "🐝", description: "Destiny's Child to solo dominance. Lemonade. Renaissance. The standard.", albums: [{ title: "B'Day", year: 2006 }, { title: "Lemonade", year: 2016 }, { title: "Renaissance", year: 2022 }] }
                        }
                    }
                }
            },
            hiphop: {
                name: "HIP HOP", icon: "🎤",
                status: S([[1979, 1984, 'emerging'], [1985, 1989, 'rising'], [1990, 2025, 'peak']]),
                subgenres: {
                    old_school: { name: "OLD SCHOOL", icon: "📻",
                        status: S([[1979, 1981, 'emerging'], [1982, 1984, 'rising'], [1985, 1987, 'peak'], [1988, 1991, 'fading']]),
                        artists: {
                            grandmaster: { name: "Grandmaster Flash", icon: "⚡", description: "The Message. The turntable as instrument. Hip hop's first masterpiece.", albums: [{ title: "The Message", year: 1982 }] },
                            run_dmc: { name: "Run-DMC", icon: "👟", description: "Walk This Way. Made hip hop rock. Adidas with no laces.", albums: [{ title: "Run-D.M.C.", year: 1984 }, { title: "Raising Hell", year: 1986 }] },
                            beastie_boys: { name: "Beastie Boys", icon: "📢", description: "Three white kids from NYC. Licensed to Ill to Paul's Boutique genius.", albums: [{ title: "Licensed to Ill", year: 1986 }, { title: "Paul's Boutique", year: 1989 }] },
                            public_enemy: { name: "Public Enemy", icon: "🎯", description: "Fight the Power. Chuck D's voice, Flavor Flav's clock, Bomb Squad's noise.", albums: [{ title: "It Takes a Nation of Millions", year: 1988 }, { title: "Fear of a Black Planet", year: 1990 }] }
                        }
                    },
                    golden_age: { name: "GOLDEN AGE", icon: "🏆",
                        status: S([[1987, 1989, 'emerging'], [1990, 1992, 'rising'], [1993, 1996, 'peak'], [1997, 2000, 'fading']]),
                        artists: {
                            nas: { name: "Nas", icon: "📜", description: "Illmatic. Queensbridge poet. One perfect album and a career of great ones.", albums: [{ title: "Illmatic", year: 1994 }, { title: "It Was Written", year: 1996 }] },
                            wu_tang: { name: "Wu-Tang Clan", icon: "⚔️", description: "36 Chambers. Staten Island's finest. Protect Ya Neck.", albums: [{ title: "Enter the Wu-Tang (36 Chambers)", year: 1993 }] },
                            tribe: { name: "A Tribe Called Quest", icon: "🎷", description: "Jazz-rap pioneers. Can I Kick It? Yes you can.", albums: [{ title: "The Low End Theory", year: 1991 }, { title: "Midnight Marauders", year: 1993 }] },
                            biggie: { name: "The Notorious B.I.G.", icon: "👑", description: "Ready to Die. Brooklyn's finest storyteller. Juicy.", albums: [{ title: "Ready to Die", year: 1994 }, { title: "Life After Death", year: 1997 }] },
                            tupac: { name: "Tupac Shakur", icon: "🌹", description: "All Eyez on Me. Poet, activist, icon. California Love.", albums: [{ title: "Me Against the World", year: 1995 }, { title: "All Eyez on Me", year: 1996 }] }
                        }
                    },
                    dirty_south: { name: "DIRTY SOUTH / ATL", icon: "🍑",
                        status: S([[1994, 1999, 'emerging'], [2000, 2003, 'rising'], [2004, 2008, 'peak'], [2009, 2012, 'fading']]),
                        artists: {
                            outkast: { name: "OutKast", icon: "🛸", description: "André 3000 and Big Boi. ATLiens. Stankonia. Hey Ya!", albums: [{ title: "ATLiens", year: 1996 }, { title: "Aquemini", year: 1998 }, { title: "Stankonia", year: 2000 }] },
                            ugk: { name: "UGK", icon: "🤠", description: "Bun B and Pimp C. Texas trill. International Players Anthem.", albums: [{ title: "Ridin' Dirty", year: 1996 }, { title: "Underground Kingz", year: 2007 }] },
                            three_6: { name: "Three 6 Mafia", icon: "😈", description: "Memphis. Dark, hypnotic, influential. Won an Oscar.", albums: [{ title: "Mystic Stylez", year: 1995 }, { title: "Most Known Unknown", year: 2005 }] }
                        }
                    },
                    mainstream_rap: { name: "MAINSTREAM RAP", icon: "💰",
                        status: S([[1998, 2002, 'emerging'], [2003, 2005, 'rising'], [2006, 2012, 'peak'], [2013, 2016, 'fading']]),
                        artists: {
                            jay_z: { name: "Jay-Z", icon: "💎", description: "Hov. Reasonable Doubt to Blueprint to empire. Brooklyn's own.", albums: [{ title: "Reasonable Doubt", year: 1996 }, { title: "The Blueprint", year: 2001 }, { title: "4:44", year: 2017 }] },
                            kanye: { name: "Kanye West", icon: "🐻", description: "College Dropout. MBDTF. Yeezus. Genius producer turned complicated everything.", albums: [{ title: "The College Dropout", year: 2004 }, { title: "My Beautiful Dark Twisted Fantasy", year: 2010 }] },
                            eminem: { name: "Eminem", icon: "💊", description: "Slim Shady. Marshall Mathers. Best-selling rapper ever. Detroit.", albums: [{ title: "The Slim Shady LP", year: 1999 }, { title: "The Marshall Mathers LP", year: 2000 }] }
                        }
                    },
                    trap: { name: "TRAP / MODERN", icon: "🔥",
                        status: S([[2012, 2014, 'emerging'], [2015, 2017, 'rising'], [2018, 2025, 'peak']]),
                        artists: {
                            kendrick: { name: "Kendrick Lamar", icon: "🦅", description: "Good Kid, MAAD City. DAMN. Mr. Morale. Compton's prophet.", albums: [{ title: "good kid, m.A.A.d city", year: 2012 }, { title: "To Pimp a Butterfly", year: 2015 }, { title: "Mr. Morale & The Big Steppers", year: 2022 }] },
                            drake: { name: "Drake", icon: "🦉", description: "Started from the bottom. Singing rapper. Dominated streaming.", albums: [{ title: "Take Care", year: 2011 }, { title: "Nothing Was the Same", year: 2013 }] },
                            travis: { name: "Travis Scott", icon: "🌵", description: "Astroworld. Rage. Houston's psychedelic trap auteur.", albums: [{ title: "Rodeo", year: 2015 }, { title: "Astroworld", year: 2018 }] },
                            tyler: { name: "Tyler, the Creator", icon: "🌺", description: "Odd Future to IGOR. Constant evolution.", albums: [{ title: "Flower Boy", year: 2017 }, { title: "IGOR", year: 2019 }, { title: "Call Me If You Get Lost", year: 2021 }] }
                        }
                    }
                }
            },
            electronic: {
                name: "ELECTRONIC", icon: "🎛️",
                status: S([[1970, 1979, 'emerging'], [1980, 1989, 'rising'], [1990, 2025, 'peak']]),
                subgenres: {
                    krautrock: { name: "KRAUTROCK / SYNTH", icon: "🤖",
                        status: S([[1970, 1973, 'emerging'], [1974, 1978, 'peak'], [1979, 1983, 'fading']]),
                        artists: {
                            kraftwerk: { name: "Kraftwerk", icon: "🚗", description: "Autobahn. Trans-Europe Express. Düsseldorf robots who invented the future.", albums: [{ title: "Autobahn", year: 1974 }, { title: "Trans-Europe Express", year: 1977 }, { title: "Computer World", year: 1981 }] },
                            tangerine: { name: "Tangerine Dream", icon: "🍊", description: "Berlin school. Sequencers and cosmic ambience.", albums: [{ title: "Phaedra", year: 1974 }, { title: "Rubycon", year: 1975 }] }
                        }
                    },
                    house: { name: "HOUSE", icon: "🏠",
                        status: S([[1984, 1987, 'emerging'], [1988, 1990, 'rising'], [1991, 1998, 'peak'], [1999, 2005, 'fading'], [2012, 2025, 'peak']]),
                        artists: {
                            frankie: { name: "Frankie Knuckles", icon: "🎧", description: "The Godfather of House. Chicago warehouse. Your Love.", albums: [{ title: "Beyond the Mix", year: 1991 }] },
                            daft_punk: { name: "Daft Punk", icon: "🤖", description: "Around the World. Discovery. Random Access Memories. French robots.", albums: [{ title: "Homework", year: 1997 }, { title: "Discovery", year: 2001 }, { title: "Random Access Memories", year: 2013 }] },
                            disclosure: { name: "Disclosure", icon: "🔲", description: "UK brothers. Settle. Brought house to the streaming generation.", albums: [{ title: "Settle", year: 2013 }] }
                        }
                    },
                    techno: { name: "TECHNO", icon: "⚙️",
                        status: S([[1985, 1989, 'emerging'], [1990, 1993, 'rising'], [1994, 2000, 'peak'], [2001, 2008, 'fading'], [2015, 2025, 'rising']]),
                        artists: {
                            derrick_may: { name: "Derrick May", icon: "🌃", description: "Detroit techno originator. Strings of Life. Innovator.", albums: [{ title: "Innovator", year: 1997 }] },
                            aphex: { name: "Aphex Twin", icon: "😊", description: "Richard D. James. Selected Ambient Works. Windowlicker. Alien genius.", albums: [{ title: "Selected Ambient Works 85–92", year: 1992 }, { title: "Richard D. James Album", year: 1996 }] }
                        }
                    },
                    rave: { name: "RAVE / BIG BEAT", icon: "💥",
                        status: S([[1990, 1993, 'emerging'], [1994, 1997, 'peak'], [1998, 2002, 'fading']]),
                        artists: {
                            prodigy: { name: "The Prodigy", icon: "🔥", description: "Firestarter. Breathe. Rave music with punk attitude.", albums: [{ title: "Music for the Jilted Generation", year: 1994 }, { title: "The Fat of the Land", year: 1997 }] },
                            chemical: { name: "The Chemical Brothers", icon: "🧪", description: "Block Rockin' Beats. Big beat pioneers from Manchester.", albums: [{ title: "Dig Your Own Hole", year: 1997 }, { title: "Surrender", year: 1999 }] }
                        }
                    },
                    edm: { name: "EDM", icon: "🎆",
                        status: S([[2008, 2010, 'emerging'], [2011, 2013, 'rising'], [2014, 2018, 'peak'], [2019, 2025, 'fading']]),
                        artists: {
                            skrillex: { name: "Skrillex", icon: "👾", description: "Scary Monsters. Brought dubstep to the mainstream.", albums: [{ title: "Scary Monsters and Nice Sprites", year: 2010 }, { title: "Bangarang", year: 2012 }] },
                            flume: { name: "Flume", icon: "🌸", description: "Australian future bass. Self-titled debut at 21.", albums: [{ title: "Flume", year: 2012 }, { title: "Skin", year: 2016 }] }
                        }
                    },
                    ambient: { name: "AMBIENT / IDM", icon: "🌫️",
                        status: S([[1978, 1982, 'emerging'], [1983, 1990, 'rising'], [1991, 2000, 'peak'], [2001, 2025, 'fading']]),
                        artists: {
                            eno: { name: "Brian Eno", icon: "🎨", description: "Invented ambient music. Music for Airports. Producer to the stars.", albums: [{ title: "Music for Airports", year: 1978 }, { title: "Apollo", year: 1983 }] },
                            boards: { name: "Boards of Canada", icon: "🏔️", description: "Nostalgic electronica. Music Has the Right to Children. Haunted.", albums: [{ title: "Music Has the Right to Children", year: 1998 }, { title: "Geogaddi", year: 2002 }] }
                        }
                    }
                }
            },
            country: {
                name: "COUNTRY", icon: "🤠",
                status: S([[1960, 2025, 'peak']]),
                subgenres: {
                    nashville_sound: { name: "NASHVILLE SOUND", icon: "🎻",
                        status: S([[1960, 1965, 'peak'], [1966, 1972, 'fading']]),
                        artists: {
                            patsy_cline: { name: "Patsy Cline", icon: "🌹", description: "Crazy. I Fall to Pieces. Country's greatest voice, gone too soon.", albums: [{ title: "Patsy Cline Showcase", year: 1961 }, { title: "Sentimentally Yours", year: 1962 }] },
                            jim_reeves: { name: "Jim Reeves", icon: "🎙️", description: "Gentleman Jim. Velvet voice, countrypolitan smooth.", albums: [{ title: "He'll Have to Go", year: 1960 }] }
                        }
                    },
                    outlaw_country: { name: "OUTLAW COUNTRY", icon: "🏴‍☠️",
                        status: S([[1966, 1969, 'emerging'], [1970, 1973, 'rising'], [1974, 1979, 'peak'], [1980, 1985, 'fading']]),
                        artists: {
                            johnny_cash: { name: "Johnny Cash", icon: "🖤", description: "The Man in Black. Folsom Prison. American legend.", albums: [{ title: "Ring of Fire", year: 1963 }, { title: "At Folsom Prison", year: 1968 }, { title: "American Recordings", year: 1994 }] },
                            waylon: { name: "Waylon Jennings", icon: "🎸", description: "Refused Nashville's polish. Did it his way.", albums: [{ title: "Folk-Country", year: 1966 }, { title: "Honky Tonk Heroes", year: 1973 }] },
                            willie: { name: "Willie Nelson", icon: "🌿", description: "Red Headed Stranger. On the Road Again. Texas icon.", albums: [{ title: "Shotgun Willie", year: 1973 }, { title: "Red Headed Stranger", year: 1975 }] }
                        }
                    },
                    alt_country: { name: "ALT-COUNTRY", icon: "🌾",
                        status: S([[1990, 1994, 'emerging'], [1995, 2002, 'peak'], [2003, 2010, 'fading']]),
                        artists: {
                            wilco: { name: "Wilco", icon: "📡", description: "Jeff Tweedy. Uncle Tupelo to Yankee Hotel Foxtrot.", albums: [{ title: "Being There", year: 1996 }, { title: "Yankee Hotel Foxtrot", year: 2002 }] },
                            ryan_adams: { name: "Ryan Adams", icon: "💔", description: "Heartbreaker. Whiskeytown to prolific solo career.", albums: [{ title: "Heartbreaker", year: 2000 }, { title: "Gold", year: 2001 }] }
                        }
                    },
                    modern_country: { name: "MODERN COUNTRY", icon: "🛻",
                        status: S([[2010, 2014, 'emerging'], [2015, 2025, 'peak']]),
                        artists: {
                            sturgill: { name: "Sturgill Simpson", icon: "🌀", description: "Metamodern Sounds. Country's psychedelic outlaw for a new era.", albums: [{ title: "Metamodern Sounds in Country Music", year: 2014 }, { title: "A Sailor's Guide to Earth", year: 2016 }] },
                            tyler_childers: { name: "Tyler Childers", icon: "⛰️", description: "Purgatory. Kentucky coal country voice. Appalachian new guard.", albums: [{ title: "Purgatory", year: 2017 }, { title: "Long Violent History", year: 2020 }] }
                        }
                    }
                }
            },
            folk: {
                name: "FOLK", icon: "🍃",
                status: S([[1960, 2025, 'peak']]),
                subgenres: {
                    traditional_folk: { name: "TRADITIONAL FOLK", icon: "🪕",
                        status: S([[1960, 1963, 'peak'], [1964, 1969, 'fading']]),
                        artists: {
                            joan_baez: { name: "Joan Baez", icon: "🕊️", description: "The voice of the movement. Pure, clear, committed.", albums: [{ title: "Joan Baez", year: 1960 }, { title: "Joan Baez in Concert", year: 1962 }] },
                            pete_seeger: { name: "Pete Seeger", icon: "🪘", description: "The link to Woody Guthrie. Keeper of the flame.", albums: [{ title: "We Shall Overcome", year: 1963 }] }
                        }
                    },
                    folk_rock: { name: "FOLK ROCK", icon: "⚡",
                        status: S([[1964, 1964, 'emerging'], [1965, 1967, 'peak'], [1968, 1972, 'fading']]),
                        artists: {
                            dylan: { name: "Bob Dylan", icon: "🌬️", description: "Went electric at Newport. They booed. He didn't care.", albums: [{ title: "The Freewheelin' Bob Dylan", year: 1963 }, { title: "Highway 61 Revisited", year: 1965 }, { title: "Blonde on Blonde", year: 1966 }, { title: "Blood on the Tracks", year: 1975 }] },
                            byrds: { name: "The Byrds", icon: "🦅", description: "Jangle and shimmer. Dylan through a Rickenbacker.", albums: [{ title: "Mr. Tambourine Man", year: 1965 }, { title: "Younger Than Yesterday", year: 1967 }] },
                            simon_garfunkel: { name: "Simon & Garfunkel", icon: "🌉", description: "The Sound of Silence. Poetry and harmony from Queens.", albums: [{ title: "Sounds of Silence", year: 1966 }, { title: "Bookends", year: 1968 }] }
                        }
                    },
                    singer_songwriter: { name: "SINGER-SONGWRITER", icon: "✍️",
                        status: S([[1968, 1970, 'emerging'], [1971, 1976, 'peak'], [1977, 1982, 'fading']]),
                        artists: {
                            joni: { name: "Joni Mitchell", icon: "🎨", description: "Blue. Court and Spark. Painted in sound. Peerless.", albums: [{ title: "Blue", year: 1971 }, { title: "Court and Spark", year: 1974 }] },
                            james_taylor: { name: "James Taylor", icon: "🌅", description: "Fire and Rain. Sweet Baby James. Laurel Canyon warmth.", albums: [{ title: "Sweet Baby James", year: 1970 }] },
                            cat_stevens: { name: "Cat Stevens", icon: "🚂", description: "Peace Train. Wild World. Tea for the Tillerman. Then walked away.", albums: [{ title: "Tea for the Tillerman", year: 1970 }, { title: "Teaser and the Firecat", year: 1971 }] },
                            nick_drake: { name: "Nick Drake", icon: "🌙", description: "Pink Moon. Three albums, no fame, then gone. Discovered too late.", albums: [{ title: "Five Leaves Left", year: 1969 }, { title: "Pink Moon", year: 1972 }] }
                        }
                    },
                    indie_folk: { name: "INDIE FOLK", icon: "🏕️",
                        status: S([[2004, 2007, 'emerging'], [2008, 2013, 'peak'], [2014, 2020, 'fading']]),
                        artists: {
                            bon_iver: { name: "Bon Iver", icon: "❄️", description: "Justin Vernon in a cabin. For Emma. Skinny Love. Then reinvented everything.", albums: [{ title: "For Emma, Forever Ago", year: 2008 }, { title: "22, A Million", year: 2016 }] },
                            fleet_foxes: { name: "Fleet Foxes", icon: "🦊", description: "Robin Pecknold. Baroque folk harmonies from Seattle. Timeless.", albums: [{ title: "Fleet Foxes", year: 2008 }, { title: "Helplessness Blues", year: 2011 }] },
                            iron_wine: { name: "Iron & Wine", icon: "🍷", description: "Sam Beam's whisper. The Creek Drank the Cradle. Hushed beauty.", albums: [{ title: "The Creek Drank the Cradle", year: 2002 }, { title: "Our Endless Numbered Days", year: 2004 }] }
                        }
                    }
                }
            },
            jazz: {
                name: "JAZZ", icon: "🎷",
                status: S([[1960, 2025, 'peak']]),
                subgenres: {
                    hard_bop: { name: "HARD BOP", icon: "🔨",
                        status: S([[1960, 1962, 'peak'], [1963, 1968, 'fading']]),
                        artists: {
                            coltrane: { name: "John Coltrane", icon: "🙏", description: "From hard bop through sheets of sound to spiritual transcendence.", albums: [{ title: "My Favorite Things", year: 1961 }, { title: "A Love Supreme", year: 1965 }] },
                            miles: { name: "Miles Davis", icon: "🎺", description: "Cool incarnate. Reinvented jazz every decade.", albums: [{ title: "Sketches of Spain", year: 1960 }, { title: "Miles Smiles", year: 1967 }, { title: "Bitches Brew", year: 1970 }] },
                            mingus: { name: "Charles Mingus", icon: "🎻", description: "Composer, bandleader, force of nature. The bass as orchestra.", albums: [{ title: "The Black Saint and the Sinner Lady", year: 1963 }] }
                        }
                    },
                    free_jazz: { name: "FREE JAZZ", icon: "🌌",
                        status: S([[1960, 1962, 'rising'], [1963, 1966, 'peak'], [1967, 1972, 'fading']]),
                        artists: {
                            ornette: { name: "Ornette Coleman", icon: "🔮", description: "Threw out the rulebook. Free Jazz wasn't a genre, it was a declaration.", albums: [{ title: "Free Jazz", year: 1961 }, { title: "The Shape of Jazz to Come", year: 1959 }] },
                            sun_ra: { name: "Sun Ra", icon: "🪐", description: "From Saturn. Arkestra. Space is the place.", albums: [{ title: "The Futuristic Sounds of Sun Ra", year: 1961 }, { title: "Space Is the Place", year: 1973 }] }
                        }
                    },
                    bossa_nova: { name: "BOSSA NOVA", icon: "🇧🇷",
                        status: S([[1960, 1961, 'rising'], [1962, 1965, 'peak'], [1966, 1972, 'fading']]),
                        artists: {
                            jobim: { name: "Antonio Carlos Jobim", icon: "🌴", description: "The Girl from Ipanema. Brazilian genius who changed jazz.", albums: [{ title: "Getz/Gilberto", year: 1964 }] },
                            stan_getz: { name: "Stan Getz", icon: "🎷", description: "The Sound. Brought bossa nova to America.", albums: [{ title: "Jazz Samba", year: 1962 }] }
                        }
                    },
                    fusion: { name: "JAZZ FUSION", icon: "⚡",
                        status: S([[1968, 1970, 'emerging'], [1971, 1974, 'rising'], [1975, 1979, 'peak'], [1980, 1985, 'fading']]),
                        artists: {
                            herbie: { name: "Herbie Hancock", icon: "🎹", description: "Head Hunters. Future Shock. Jazz that bumps.", albums: [{ title: "Head Hunters", year: 1973 }, { title: "Future Shock", year: 1983 }] },
                            weather_report: { name: "Weather Report", icon: "🌤️", description: "Zawinul and Shorter. Birdland. Jazz fusion's greatest band.", albums: [{ title: "Heavy Weather", year: 1977 }] },
                            return_forever: { name: "Return to Forever", icon: "🔥", description: "Chick Corea's electric group. Romantic Warrior. Virtuosity.", albums: [{ title: "Romantic Warrior", year: 1976 }] }
                        }
                    },
                    modern_jazz: { name: "MODERN JAZZ", icon: "🎵",
                        status: S([[2005, 2010, 'emerging'], [2011, 2015, 'rising'], [2016, 2025, 'peak']]),
                        artists: {
                            kamasi: { name: "Kamasi Washington", icon: "🎷", description: "The Epic. Brought jazz back to the conversation. Spiritual.", albums: [{ title: "The Epic", year: 2015 }, { title: "Heaven and Earth", year: 2018 }] },
                            robert_glasper: { name: "Robert Glasper", icon: "🎹", description: "Black Radio. Jazz meets hip hop meets R&B. Genre-fluid.", albums: [{ title: "Black Radio", year: 2012 }] },
                            shabaka: { name: "Shabaka Hutchings", icon: "🌍", description: "Sons of Kemet. The Comet Is Coming. London's jazz renaissance.", albums: [{ title: "Your Queen Is a Reptile", year: 2018 }] }
                        }
                    }
                }
            },
            blues: {
                name: "BLUES", icon: "🔵",
                status: S([[1960, 2025, 'peak']]),
                subgenres: {
                    chicago_blues: { name: "CHICAGO BLUES", icon: "🌃",
                        status: S([[1960, 1962, 'peak'], [1963, 1970, 'fading']]),
                        artists: {
                            muddy: { name: "Muddy Waters", icon: "🌊", description: "Electrified the Delta. Every British kid wanted to be him.", albums: [{ title: "Muddy Waters at Newport", year: 1960 }] },
                            howlin: { name: "Howlin' Wolf", icon: "🐺", description: "That voice. Huge, terrifying, elemental.", albums: [{ title: "Howlin' Wolf", year: 1962 }] },
                            bb_king: { name: "B.B. King", icon: "👑", description: "Lucille. The thrill is gone. King of the Blues.", albums: [{ title: "Live at the Regal", year: 1965 }] }
                        }
                    },
                    british_blues: { name: "BRITISH BLUES", icon: "🇬🇧",
                        status: S([[1963, 1965, 'emerging'], [1966, 1970, 'peak'], [1971, 1975, 'fading']]),
                        artists: {
                            mayall: { name: "John Mayall", icon: "🎓", description: "The schoolmaster. Clapton, Peter Green, Mick Taylor all came through.", albums: [{ title: "Blues Breakers with Eric Clapton", year: 1966 }] },
                            fleetwood: { name: "Fleetwood Mac", icon: "🐦", description: "Before Rumours, they were a blues band. Peter Green's otherworldly tone.", albums: [{ title: "Fleetwood Mac", year: 1968 }, { title: "Then Play On", year: 1969 }] },
                            cream: { name: "Cream", icon: "🎸", description: "Clapton, Baker, Bruce. Power trio. Crossroads. Sunshine of Your Love.", albums: [{ title: "Disraeli Gears", year: 1967 }, { title: "Wheels of Fire", year: 1968 }] }
                        }
                    },
                    blues_rock: { name: "BLUES ROCK", icon: "🔥",
                        status: S([[1969, 1971, 'emerging'], [1972, 1975, 'peak'], [1976, 1980, 'fading']]),
                        artists: {
                            allman: { name: "Allman Brothers Band", icon: "🍑", description: "Duane and Gregg. At Fillmore East. Southern blues rock perfection.", albums: [{ title: "At Fillmore East", year: 1971 }, { title: "Eat a Peach", year: 1972 }] },
                            zz_top: { name: "ZZ Top", icon: "🧔", description: "Texas boogie. La Grange. Sharp Dressed Man. Those beards.", albums: [{ title: "Tres Hombres", year: 1973 }, { title: "Eliminator", year: 1983 }] },
                            srv: { name: "Stevie Ray Vaughan", icon: "⚡", description: "Texas Flood. Last great blues guitar hero. Breathtaking.", albums: [{ title: "Texas Flood", year: 1983 }, { title: "Couldn't Stand the Weather", year: 1984 }] }
                        }
                    }
                }
            }
        };

export const GENRE_ORIGINS = {
            pop: { emergeYear: 1960, story: "Pop music has been around since the start of our timeline, evolving from Tin Pan Alley and early rock and roll." },
            rock: { emergeYear: 1960, story: "Rock emerged in the late 1950s from blues, country, and R&B. By 1960, it was already transforming popular music." },
            soul: { emergeYear: 1960, story: "Soul music grew from gospel and R&B in the late 1950s, reaching full form with artists like Ray Charles and Sam Cooke." },
            jazz: { emergeYear: 1960, story: "Jazz had been thriving since the early 1900s. By 1960, bebop was established and new forms like free jazz were emerging." },
            hiphop: { emergeYear: 1973, story: "Hip hop wouldn't exist until 1973, when DJ Kool Herc threw a back-to-school party in the Bronx and isolated the 'break' — the instrumental section where dancers went off. From that moment, hip hop was born." },
            electronic: { emergeYear: 1970, story: "Electronic music as a distinct genre emerged around 1970 with Kraftwerk and other experimenters using synthesizers. Before this, electronic sounds were mostly confined to academic studios and film scores." },
            country: { emergeYear: 1960, story: "Country music has deep roots in American folk traditions, well established by the 1960s through the Grand Ole Opry and artists like Hank Williams." },
            folk: { emergeYear: 1960, story: "Folk music traditions stretch back centuries. The 1960s folk revival was already underway with artists like Pete Seeger paving the way." }
        };

export { MIN_YEAR, MAX_YEAR };
