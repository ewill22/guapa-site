"""
Batch 4: Write editorial descriptions for 88 new catalog artists.
Updates artist-editorial.csv (set confirmed=yes, add icon+description+eric_take)
Appends to album-editorial.csv (4-5 key albums per artist)
"""
import csv
import os

# ── Artist descriptions ──────────────────────────────────────────────
# Format: name_lower -> (icon, description, eric_take)
ARTISTS = {
    "21 savage": ("🔪", "British passport, Atlanta trap. Savage Mode II with Metro Boomin is the blueprint. A lot is an understatement.", ""),
    "adele": ("🎤", "Named her albums after her age. 21 broke every record that existed. Rolling in the Deep is fury disguised as pop.", ""),
    "alvvays": ("🌊", "Canadian dream pop perfection. Archie, Marry Me is the hook that never leaves. Two v's, zero filler.", ""),
    "arctic monkeys": ("🎸", "I Bet You Look Good on the Dancefloor. Sheffield lads to lounge lizards. Alex Turner reinvents himself every album.", ""),
    "ateez": ("⚓", "K-pop with pirate energy. Eight members, zero chill. Guerrilla and Wonderland go harder than they need to.", ""),
    "bauhaus": ("🦇", "Bela Lugosi's Dead. Nine minutes of gothic post-punk that invented an entire subculture. Peter Murphy's cheekbones did the rest.", ""),
    "black midi": ("🌀", "London math rock chaos. Schlagenheim sounds like a car crash you can't stop replaying. Geordie Greep screams through jazz.", ""),
    "boston": ("🚀", "More Than a Feeling. Tom Scholz built a spaceship in his basement. The debut sold 17 million copies.", ""),
    "boygenius": ("🌙", "Phoebe, Julien, Lucy. Three singer-songwriters who didn't need a supergroup but gave us one anyway.", ""),
    "buddy holly": ("👓", "Died at 22. Peggy Sue, That'll Be the Day, Everyday. Invented the rock band format. The plane crash that stopped the music.", ""),
    "captain beefheart": ("🎭", "Don Van Vliet. Trout Mask Replica is either the greatest album ever made or unlistenable noise. No middle ground.", ""),
    "caroline polachek": ("✨", "Ex-Chairlift, solo siren. Bunny Is a Rider is hyperpop art school. That voice bends in ways voices shouldn't.", ""),
    "central cee": ("🇬🇧", "West London drill gone global. Doja is the crossover. UK rap's most exportable voice.", ""),
    "chappell roan": ("👑", "Midwest princess. Good Luck, Babe! is the queer pop anthem of the decade. Zero to stadiums in one album cycle.", ""),
    "chicago": ("🎺", "Jazz-rock with horns. 25 or 6 to 4 is the riff. Saturday in the Park is the hit. Then Peter Cetera turned them into a ballad machine.", ""),
    "dead kennedys": ("💀", "Jello Biafra's satire was sharper than most punk's anger. Holiday in Cambodia. California Uber Alles. West Coast hardcore with a brain.", ""),
    "dire straits": ("🎸", "Mark Knopfler's fingers. Sultans of Swing is the audition tape. Money for Nothing is the MTV anthem. Brothers in Arms sold 30 million.", ""),
    "doja cat": ("🐱", "Mooo! was a meme. Say So was a TikTok smash. Planet Her proved she's an actual artist. Scarlet proved she doesn't care what you think.", ""),
    "donovan": ("☮️", "Britain's answer to Dylan. Sunshine Superman, Mellow Yellow, Hurdy Gurdy Man. Psychedelic folk before that was a genre.", ""),
    "ed sheeran": ("🎵", "Loop pedal busker to biggest pop star on Earth. Shape of You. Thinking Out Loud. The math symbols keep coming.", ""),
    "eurythmics": ("😎", "Sweet Dreams Are Made of This. Annie Lennox's voice over Dave Stewart's synths. Who am I to disagree.", ""),
    "feid": ("🔥", "Ferxxo. Medellín's reggaeton prince. FERXXOCALIPSIS is the party. Collaboration machine with Karol G and everyone else.", ""),
    "fontaines d.c.": ("🍀", "Dublin post-punk. Dogrel is poetry shouted over guitars. Boys in the Better Land is the anthem. Ireland's loudest export.", ""),
    "franz ferdinand": ("🕺", "Take Me Out. That guitar riff change is the moment indie disco was born. Scottish art school groove.", ""),
    "fugees": ("🌍", "The Score. Lauryn Hill, Wyclef, Pras. Killing Me Softly reimagined. Ready or Not. One perfect album then implosion.", ""),
    "ghost": ("⛪", "Swedish metal dressed as satanic pop. Square Hammer is an arena anthem. Tobias Forge is the only constant behind the mask.", ""),
    "gojira": ("🐋", "French environmental metal. Flying Whales is the song. From Mars to Sirius is the album. Heavy as tectonic plates.", ""),
    "grace jones": ("💃", "Jamaican-American icon. Nightclubbing is art. Pull Up to the Bumper is funk. Slave to the Rhythm is eternal. Fashion, model, force of nature.", ""),
    "grimes": ("👽", "Claire Boucher built Visions on GarageBand in two weeks. Oblivion is the song. Art Angels is the pop pivot. Cyberpunk before it was cringe.", ""),
    "hozier": ("🌿", "Take Me to Church. Irish folk-soul with a baritone that fills cathedrals. Too Sweet broke streaming records in 2024.", ""),
    "ice spice": ("🍦", "Bronx drill princess. Munch was the moment. Y2K is the debut. Gen Z energy distilled into ad-libs.", ""),
    "jack harlow": ("🎤", "Louisville charm. First Class sampled Fergie and went number one. Industry Baby with Lil Nas X. Frat rap grown up.", ""),
    "janis joplin": ("🌹", "Me and Bobby McGee. Piece of My Heart. The voice that tore itself apart. Pearl came out posthumous. 27 forever.", ""),
    "japanese breakfast": ("🍳", "Michelle Zauner turned grief into Psychopomp. Jubilee is joy after mourning. Also wrote Crying in H Mart. Polymath.", ""),
    "juan gabriel": ("🇲🇽", "El Divo de Juárez. Querida. Amor Eterno. Mexico's greatest songwriter. 42 albums. Performed for millions. Cried with all of them.", ""),
    "karol g": ("💙", "La Bichota. TQG with Shakira was the crossover. Mañana Será Bonito is the album. Colombia to the world.", ""),
    "knocked loose": ("🔨", "Kentucky hardcore. Counting Worms is violence. You Won't Go Before You're Supposed To proved heavy music still moves.", ""),
    "leonard cohen": ("🕯️", "Hallelujah. Suzanne. Bird on the Wire. Canadian poet who sang in a baritone whisper. Wrote until the very end.", ""),
    "lil peep": ("🖤", "Emo rap pioneer. Awful Things. Star Shopping. Gone at 21. Opened a door between punk and SoundCloud rap that never closed.", ""),
    "magdalena bay": ("💿", "Synth-pop duo. Mercurial World is a simulation. Imaginal Disk is the upgrade. Retro-futurism with a wink.", ""),
    "maroon 5": ("🎙️", "Songs About Jane is a great debut. This Love, She Will Be Loved. Then Adam Levine became a TV judge and the band became a hit factory.", ""),
    "mastodon": ("🦣", "Progressive sludge metal. Leviathan is Moby Dick as a concept album. Crack the Skye goes to space. Blood Mountain splits the difference.", ""),
    "megan thee stallion": ("🔥", "Hot Girl Summer. Savage remix with Beyoncé. Houston rap with a degree. Body-ody-ody.", ""),
    "melanie martinez": ("🎪", "Cry Baby is a concept album about childhood trauma dressed in pastels. PORTALS goes alien. Directed her own film. Auteur pop.", ""),
    "mgmt": ("🌈", "Kids. Time to Pretend. Electric Feel. Oracular Spectacular was the blog-era bible. Then they made three deliberately weird albums.", ""),
    "missy elliott": ("🛸", "Get Ur Freak On. Work It. Timbaland beats and Missy's vision. Most innovative woman in hip hop history. The rain, supa dupa fly.", ""),
    "mumford & sons": ("🪕", "The Cave. Little Lion Man. Banjo folk-rock that filled arenas. Sigh No More started a whole genre wave.", ""),
    "nick cave": ("🕯️", "The Bad Seeds. Red Right Hand. Into My Arms. Australian gothic. Murder ballads and love songs from the same dark pen.", ""),
    "no doubt": ("🏁", "Gwen Stefani before solo. Don't Speak. Tragic Kingdom. Ska-punk meets new wave. Just a Girl was the anthem.", ""),
    "olivia rodrigo": ("💔", "Drivers License broke the internet. SOUR is a breakup album that sold 15 million. GUTS proved it wasn't a fluke.", ""),
    "one direction": ("🌟", "What Makes You Beautiful. Five lads from X Factor. Biggest boy band since the Beatles comparisons. Then Harry went solo.", ""),
    "onerepublic": ("🎹", "Apologize with Timbaland. Counting Stars. Ryan Tedder writes hits for everyone else too. Pop-rock for the streaming era.", ""),
    "panic! at the disco": ("🎪", "I Write Sins Not Tragedies. Brendon Urie's voice and theatrical excess. A Fever You Can't Sweat Out is emo-pop perfection.", ""),
    "patti smith": ("📖", "Horses. Gloria reimagined. Punk poet laureate. Because the Night with Springsteen. Merged poetry and rock before anyone else.", ""),
    "peso pluma": ("🏆", "Génesis blew up corridos tumbados worldwide. Ella Baila Sola was inescapable. Mexico's new generation in one voice.", ""),
    "pharrell williams": ("🎹", "Half of The Neptunes. Produced half your playlist. Happy became inescapable but G I R L is the real album.", "this pharrell album is insane"),
    "phil collins": ("🥁", "In the Air Tonight. That drum fill. Genesis drummer gone solo megastar. Against All Odds. Sussudio. Owned the 80s.", ""),
    "pinkpantheress": ("🩷", "2-minute songs. TikTok bedroom pop. Boy's a Liar Pt. 2 with Ice Spice. Jungle and drum'n'bass nostalgia from Gen Z.", ""),
    "pj harvey": ("⚡", "Rid of Me. Polly Jean shreds, whispers, screams. Let England Shake won the Mercury Prize. Reinvents herself every album.", ""),
    "portishead": ("🌫️", "Dummy invented trip-hop. Glory Box. Sour Times. Beth Gibbons' voice over scratchy vinyl beats. Third went industrial and disappeared.", ""),
    "post malone": ("🍺", "Congratulations. White Iverson. Genre? Yes. Beer pong to billion streams pipeline.", ""),
    "procol harum": ("🎹", "A Whiter Shade of Pale. That organ intro is one of the most recognizable in rock. Then 12 more albums nobody talks about.", ""),
    "rauw alejandro": ("🕺", "Puerto Rican R&B meets reggaeton. Todo de Ti is the hit. Cosa Nuestra goes full salsa. Latin pop's smoothest operator.", ""),
    "roxy music": ("🦩", "Bryan Ferry's sophistication meets Brian Eno's chaos. Avalon is the smoothest album ever made. For Your Pleasure is the weird one.", ""),
    "sabrina carpenter": ("💋", "Espresso. Disney kid to pop star pipeline done right. Short n' Sweet is the summer album. Nonsense outros are the secret weapon.", ""),
    "siouxsie and the banshees": ("🕷️", "Juju. Spellbound. Hong Kong Garden. Gothic post-punk royalty. Siouxsie Sioux's voice cuts through everything.", ""),
    "slayyyter": ("💫", "Hyperpop provocateur. Troubled Paradise is Y2K pop maximalism. Daddy AF. Internet pop with zero filter.", ""),
    "squid": ("🦑", "Brighton post-punk. Bright Green Field is chaotic and brainy. Narrator is seven minutes of controlled panic.", ""),
    "supertramp": ("🥐", "Breakfast in America. The Logical Song. Crime of the Century. Art-pop disguised as radio rock. That Wurlitzer sound.", ""),
    "swedish house mafia": ("🔊", "Don't You Worry Child. Three DJs who broke EDM into the mainstream. Save the World. One reunion tour at a time.", ""),
    "tems": ("🌍", "Nigerian Afrobeats meets R&B. Free Mind. Featured on Drake and Future, then Born in the Wild proved she doesn't need features.", ""),
    "the killers": ("🏜️", "Mr. Brightside never left the UK charts. Brandon Flowers brought Las Vegas drama to indie rock.", ""),
    "the mamas & the papas": ("🌸", "California Dreamin'. Monday Monday. Laurel Canyon harmonies. Four voices that defined the 60s folk-pop sound.", ""),
    "the offspring": ("🔥", "Self Esteem. Come Out and Play. Pretty Fly for a White Guy. Smash sold 11 million on Epitaph. 90s punk-pop kings.", ""),
    "the stooges": ("⚡", "Iggy Pop invented punk before punk existed. I Wanna Be Your Dog. Raw Power. Fun House is a noise masterpiece.", ""),
    "the verve": ("🌧️", "Bitter Sweet Symphony. That string sample. Richard Ashcroft walking down the street. Urban Hymns is Britpop's last great album.", ""),
    "thin lizzy": ("🎸", "The Boys Are Back in Town. Phil Lynott. Twin guitar harmonies. Jailbreak is the album. Irish rock's greatest.", ""),
    "tito puente": ("🥁", "El Rey del Timbal. Oye Como Va before Santana covered it. Dance Mania. 100+ albums. The king of Latin jazz.", ""),
    "tlc": ("🦋", "Waterfalls. No Scrubs. CrazySexyCool sold 23 million. T-Boz, Left Eye, Chilli. Best-selling girl group in American history.", ""),
    "turnstile": ("🌀", "Baltimore hardcore meets summer vibes. GLOW ON broke hardcore out of basements. Mystery is the crossover.", ""),
    "twenty one pilots": ("⬛", "Stressed Out. Ride. Heathens. Tyler Joseph and Josh Dun turned anxiety into arena anthems. Blurryface went diamond.", ""),
    "village people": ("🏗️", "Y.M.C.A. Macho Man. Disco camp perfection. Every wedding, every sporting event. They knew exactly what they were doing.", ""),
    "wet leg": ("🦵", "Chaise Longue. Isle of Wight duo with deadpan humor and guitar hooks. The debut won a Brit Award. Moisturizer keeps it going.", ""),
    "yeah yeah yeahs": ("🗺️", "Maps. Karen O's feral energy. Zero is the glam hit. Fever to Tell is art-punk perfection. NYC's wildest.", ""),
    "yeat": ("🔔", "Twizzy. Flëw. Autonomous trap. Lyfestyle with Drake. The sound of rap's algorithmic future. Tonka.", ""),
    "young thug": ("🐍", "Rewrote the rules of rap melody. So Much Fun is the thesis statement. Then they locked him up.", "young thug while my grandma talks / you cant full appreciate young thug without lyrics mannn / hang up the phone with grandma turn on the young thug"),
    "zach bryan": ("🤠", "Something in the Orange. Oklahoma poet. DeAnn was recorded in a barracks. Country's most authentic voice in a decade.", ""),
    "zedd": ("💎", "Clarity with Foxes. Stay with Alessia Cara. Russian-German producer who brought EDM to pop radio.", ""),
}

# Also handle the special-char artists from the 94 that aren't in my main list
SPECIAL_ARTISTS = {
    "destiny\u2019s child": ("👢", "Beyoncé's origin story. Say My Name. Bills, Bills, Bills. Survivor. Kelly and Michelle held their own. The group that launched a dynasty.", ""),
    # måneskin and røyksopp may have encoding variants — we'll match by substring
}

# ── Album descriptions ──────────────────────────────────────────────
# Format: (artist_name, album_title, year, description)
ALBUMS = [
    # 21 Savage
    ("21 Savage", "Issa Album", 2017, "Bank Account is the hook. No Heart is the attitude. Atlanta trap stripped to the bone."),
    ("21 Savage", "Without Warning", 2017, "Metro Boomin and Offset. Ghostface Killers. Halloween release, horror movie beats. A collab tape that plays like a real album."),
    ("21 Savage", "SAVAGE MODE II", 2020, "Morgan Freeman narrates. Runnin is the single. Metro's production is cinematic. The sequel that justified itself."),
    ("21 Savage", "american dream", 2024, "The ICE arrest album. Redrum is the hit. Personal, political, still hits hard."),

    # Adele
    ("Adele", "19", 2008, "Chasing Pavements and a voice that shouldn't exist in a teenager. The debut that got Grammy voters shaking."),
    ("Adele", "21", 2011, "Rolling in the Deep. Someone Like You. Biggest album of the decade, full stop."),
    ("Adele", "25", 2015, "Hello broke YouTube. When We Were Young is the sleeper. Three years of silence and she came back bigger."),
    ("Adele", "30", 2021, "Divorce album. Easy On Me is the single but Oh My God is the energy. Grown woman heartbreak."),

    # Alvvays
    ("Alvvays", "Alvvays", 2013, "Archie, Marry Me is indie pop perfection. Adult Diversion jangles. A debut that sounds like summer ending."),
    ("Alvvays", "Antisocialites", 2017, "Dreams Tonite is the standout. In Undertow shimmers. Shoegaze meets power pop, tighter than the debut."),
    ("Alvvays", "Blue Rev", 2022, "Pharmacist opens like a wall of noise. Belladonna of Sadness is the prettiest thing they've done. Five years worth the wait."),

    # Arctic Monkeys
    ("Arctic Monkeys", "Whatever People Say I Am, That's What I'm Not", 2006, "I Bet You Look Good on the Dancefloor. Fastest-selling UK debut ever. Alex Turner was 19."),
    ("Arctic Monkeys", "AM", 2013, "Do I Wanna Know? R U Mine? Stoner desert rock with a hip-hop swagger. The riff album."),
    ("Arctic Monkeys", "Favourite Worst Nightmare", 2007, "Fluorescent Adolescent. Brianstorm. Louder, faster, angrier. Sheffield at full volume."),
    ("Arctic Monkeys", "Tranquility Base Hotel + Casino", 2018, "Lounge rock on the moon. Four Out of Five. No guitars, no problem. Turner becomes a crooner."),

    # Bauhaus
    ("Bauhaus", "In the Flat Field", 1980, "Dark Entries. Stigmata Martyr. Post-punk as seance. The first goth album."),
    ("Bauhaus", "Mask", 1981, "Kick in the Eye. The Passion of Lovers. Danceable darkness."),

    # Black Midi
    ("black midi", "Schlagenheim", 2019, "bmbmbm is a panic attack set to music. Near DT, MI is a freight train. London's most unhinged debut."),
    ("black midi", "Cavalcade", 2021, "John L opens with a marching band from hell. Chondromalacia Patella is prog-jazz chaos. Tighter but no less insane."),
    ("black midi", "Hellfire", 2022, "Sugar/Tzu. Welcome to Hell. A rock opera about war, food, and madness. Their best."),

    # Boston
    ("Boston", "Boston", 1976, "More Than a Feeling. Peace of Mind. Foreplay/Long Time. Tom Scholz engineered perfection in a basement. 17 million sold."),
    ("Boston", "Don't Look Back", 1978, "The title track carries it. A Man I'll Never Be shows range. Couldn't top the debut but few could."),

    # Boygenius
    ("boygenius", "the record", 2023, "Not Strong Enough. Emily I'm Sorry. Cool About It. Three artists at their peak making something none could alone."),

    # Buddy Holly
    ("Buddy Holly", "Buddy Holly", 1958, "Peggy Sue. Everyday. I'm Gonna Love You Too. Rock and roll's first auteur. The glasses. The hiccup."),
    ("Buddy Holly", "That'll Be the Day", 1958, "The Crickets. That'll Be the Day and Oh, Boy! Two songs that built the template for guitar pop."),

    # Captain Beefheart
    ("Captain Beefheart", "The Spotlight Kid", 1972, "The accessible one. I'm Gonna Booglarize You Baby. Blues-rock that almost makes sense. His most listenable album."),

    # Caroline Polachek
    ("Caroline Polachek", "Pang", 2019, "Door is the opener. So Hot You're Hurting My Feelings is the sleeper hit. Art pop with actual hooks."),
    ("Caroline Polachek", "Desire, I Want to Turn Into You", 2023, "Bunny Is a Rider. Welcome to My Island. Flamenco guitar meets hyperpop. Unclassifiable and perfect."),

    # Chappell Roan
    ("Chappell Roan", "The Rise and Fall of a Midwest Princess", 2023, "Good Luck, Babe! Red Wine Supernova. Hot to Go! Queer pop anthems from a drag-inspired stage show. Zero to everywhere."),

    # Chicago
    ("Chicago", "Chicago Transit Authority", 1969, "Beginnings. Does Anybody Really Know What Time It Is? Double album debut. Jazz-rock with horns before anyone else."),
    ("Chicago", "Chicago", 1970, "25 or 6 to 4 is the riff. Make Me Smile. Another double album, another classic. Horns blazing."),
    ("Chicago", "Chicago V", 1972, "Saturday in the Park. Dialogue. Their first number one album. The hit machine starts."),
    ("Chicago", "Chicago 17", 1984, "Hard Habit to Break. You're the Inspiration. Peter Cetera era. Ballads that ruled the radio."),

    # Dead Kennedys
    ("Dead Kennedys", "Fresh Fruit for Rotting Vegetables", 1980, "Holiday in Cambodia. California Uber Alles. Kill the Poor. The most quotable punk album ever made."),
    ("Dead Kennedys", "Plastic Surgery Disasters", 1982, "Halloween. Moon Over Marin. Harder, faster, more political. Jello Biafra's satire sharpened."),

    # Dire Straits
    ("Dire Straits", "Dire Straits", 1978, "Sultans of Swing. Knopfler's fingerpicking debut. No pick, no distortion, just tone."),
    ("Dire Straits", "Brothers in Arms", 1985, "Money for Nothing. Walk of Life. First major CD-era album. Sold 30 million. The MTV song that bit the hand."),
    ("Dire Straits", "Making Movies", 1980, "Romeo and Juliet is the love song. Tunnel of Love is the epic. Skateaway grooves. Peak storytelling."),
    ("Dire Straits", "Love Over Gold", 1982, "Telegraph Road is 14 minutes of Knopfler narrative. Private Investigations is film noir as a single."),

    # Doja Cat
    ("Doja Cat", "Hot Pink", 2019, "Say So went TikTok viral. Juicy. Boss Bitch. The album that turned a meme rapper into a pop star."),
    ("Doja Cat", "Planet Her", 2021, "Kiss Me More with SZA. Need to Know. Woman. Space-themed pop-rap perfection."),
    ("Doja Cat", "Scarlet", 2023, "Paint the Town Red flipped a sample and went number one. Demons. Agora Hills. Dark Doja."),

    # Donovan
    ("Donovan", "Sunshine Superman", 1966, "The title track invented psychedelic folk-pop. Season of the Witch is the deep cut everyone knows."),
    ("Donovan", "The Hurdy Gurdy Man", 1968, "That drone riff. Atlantis is spoken word hippie mythology. Jimmy Page plays guitar on the title track."),
    ("Donovan", "Mellow Yellow", 1967, "Quite rightly. The title track was the hit. Jennifer Juniper was written about Jenny Boyd. Laurel Canyon's Scottish visitor."),

    # Ed Sheeran
    ("Ed Sheeran", "+", 2011, "The A Team. Lego House. A busker's debut that sold 10 million. Loop pedal magic."),
    ("Ed Sheeran", "×", 2014, "Thinking Out Loud. Sing with Pharrell. Don't with Rick Rubin. The album that made him inescapable."),
    ("Ed Sheeran", "÷", 2017, "Shape of You. Castle on the Hill. Galway Girl. Biggest tour of all time followed. Math keeps working."),

    # Eurythmics
    ("Eurythmics", "Sweet Dreams (Are Made of This)", 1983, "The title track is the synth riff. Love Is a Stranger. Annie Lennox's androgynous power on full display."),
    ("Eurythmics", "Be Yourself Tonight", 1985, "Would I Lie to You? There Must Be an Angel. Sisters Are Doin' It with Aretha. Pop-soul peak."),

    # Feid
    ("Feid", "FERXXOCALIPSIS", 2023, "Classy 101. Normal. Reggaeton at its most melodic. Medellín's party starter."),
    ("Feid", "INTER SHIBUYA - LA MAFIA (FERXXO EDITION)", 2021, "Fumeteo. Collaboration heavy. The album that connected the Colombian scene."),

    # Fontaines D.C.
    ("Fontaines D.C.", "Dogrel", 2019, "Boys in the Better Land. Big. Dublin poetry over post-punk. A debut that sounds lived-in."),
    ("Fontaines D.C.", "A Hero's Death", 2020, "The title track loops like a mantra. I Don't Belong is the gut punch. Darker, slower, deeper."),
    ("Fontaines D.C.", "Romance", 2024, "Starburster. The genre pivot. Shoegaze, electronic, still unmistakably them. Mercury Prize nominated."),

    # Franz Ferdinand
    ("Franz Ferdinand", "Franz Ferdinand", 2004, "Take Me Out. The Dark of the Matinée. Indie disco born in Glasgow. That riff change in Take Me Out is the moment."),
    ("Franz Ferdinand", "You Could Have It So Much Better", 2005, "Do You Want To. The Fallen. Walk Away. Louder, sharper, faster. The difficult second album that wasn't."),

    # Fugees
    ("Fugees", "The Score", 1996, "Killing Me Softly. Ready or Not. Fu-Gee-La. 22 million sold. Lauryn Hill dominates. One of the greatest rap albums ever."),

    # Ghost
    ("Ghost", "Meliora", 2015, "Cirice. From the Pinnacle to the Pit. Heavy metal as Broadway show. Grammy winner."),
    ("Ghost", "Prequelle", 2018, "Rats. Dance Macabre. Arena rock with Satanic window dressing. The crossover album."),
    ("Ghost", "Impera", 2022, "Twenties. Kaisarion. Stadium metal. Tobias Forge keeps reinventing the gimmick."),

    # Gojira
    ("Gojira", "From Mars to Sirius", 2005, "Flying Whales. The song every metal fan knows. French progressive death metal about environmentalism. Heavy beyond measure."),
    ("Gojira", "The Way of All Flesh", 2008, "Oroborus. Toxic Garbage Island. Tighter, faster, angrier. The evolution continues."),
    ("Gojira", "Magma", 2016, "Stranded. Silvera. Personal grief meets crushing riffs. Their most emotional album."),

    # Grace Jones
    ("Grace Jones", "Nightclubbing", 1981, "Pull Up to the Bumper. Walking in the Rain. Demolition Man. Sly & Robbie production. Reggae-new wave fusion. An icon's defining moment."),
    ("Grace Jones", "Warm Leatherette", 1980, "Private Life. The title track is industrial reggae. Love Is the Drug reimagined. The Island Records reinvention."),
    ("Grace Jones", "Slave to the Rhythm", 1985, "One song, seven versions. Trevor Horn production excess. The title track is her signature."),

    # Grimes
    ("Grimes", "Visions", 2012, "Oblivion. Genesis. Recorded in two weeks on GarageBand in a dark room. Lo-fi art pop that launched a career."),
    ("Grimes", "Art Angels", 2015, "Kill V. Maim. Flesh Without Blood. Pop pivot. Polished but still alien."),
    ("Grimes", "Miss Anthropocene", 2019, "My Name Is Dark. 4ÆM. Climate doom as synth-pop. Her darkest and most focused."),

    # Hozier
    ("Hozier", "Hozier", 2014, "Take Me to Church. Cherry Wine. From Eden. Irish folk-blues that went global on one song's power."),
    ("Hozier", "Unreal Unearth", 2023, "Too Sweet. Francesca. Dante's Inferno as folk-rock. His most ambitious and it worked."),

    # Ice Spice
    ("Ice Spice", "Y2K!", 2024, "Think U The Shit (Fart). Gimmie a Light. Bronx drill minimalism. The debut that the memes demanded."),

    # Jack Harlow
    ("Jack Harlow", "That's What They All Say", 2020, "WHATS POPPIN. Tyler Herro. Louisville's golden boy arrives. Charm over bars."),
    ("Jack Harlow", "Come Home the Kids Miss You", 2022, "First Class. Nail Tech. Fergie sample flipped into a number one. The commercial album."),

    # Janis Joplin
    ("Janis Joplin", "Pearl", 1971, "Me and Bobby McGee. Mercedes Benz. Cry Baby. Released posthumously. The rawness that couldn't be contained."),
    ("Janis Joplin", "I Got Dem Ol' Kozmic Blues Again Mama!", 1969, "Try (Just a Little Bit Harder). Kozmic Blues. Solo Janis with horns. San Francisco's loudest voice."),

    # Japanese Breakfast
    ("Japanese Breakfast", "Psychopomp", 2016, "In Heaven. Rugged Country. Grief turned into shimmering indie pop. Michelle Zauner's debut after loss."),
    ("Japanese Breakfast", "Jubilee", 2021, "Be Sweet. Paprika opens in Technicolor. Joy as a radical act after two albums of mourning."),

    # Juan Gabriel
    ("Juan Gabriel", "Siempre en mi mente", 1977, "The title track is a standard. Romantic balladry from Mexico's greatest. Mariachi meets pop."),
    ("Juan Gabriel", "Recuerdos", 1980, "Querida. The performance is as important as the recording. Live energy captured."),

    # Karol G
    ("Karol G", "MAÑANA SERÁ BONITO", 2023, "TQG with Shakira. Mientras Me Curo del Cora. Tomorrow will be beautiful. Latin pop's biggest album of the year."),
    ("Karol G", "KG0516", 2021, "Bichota. Location. El Makinón. The album that made her La Bichota worldwide."),

    # Knocked Loose
    ("Knocked Loose", "A Different Shade of Blue", 2019, "Mistakes Like Fractures. Trapped in the Grasp of a Memory. Metalcore that doesn't apologize."),
    ("Knocked Loose", "You Won't Go Before You're Supposed To", 2024, "Suffocate. Blinding Faith. The heaviest album of 2024. Hardcore for people who needed it."),

    # Leonard Cohen
    ("Leonard Cohen", "Songs of Leonard Cohen", 1967, "Suzanne. So Long, Marianne. Sisters of Mercy. A poet picks up a guitar and changes everything."),
    ("Leonard Cohen", "Various Positions", 1984, "Hallelujah. The label rejected it. Then everyone covered it. Then it became the most performed song in the world."),
    ("Leonard Cohen", "I'm Your Man", 1988, "Everybody Knows. Tower of Song. First, We Take Manhattan. Synths and a deeper voice. The reinvention."),
    ("Leonard Cohen", "You Want It Darker", 2016, "The title track. Released three weeks before he died. Hineni, hineni — I'm ready, my Lord."),

    # Lil Peep
    ("Lil Peep", "Come Over When You're Sober, Pt. 1", 2017, "Awful Things. Benz Truck. Emo trap before it had a name. Gone three months after release."),
    ("Lil Peep", "Come Over When You're Sober, Pt. 2", 2018, "Runaway. Life Is Beautiful. Posthumous but mostly finished. The sadness hits different knowing."),

    # Magdalena Bay
    ("Magdalena Bay", "Mercurial World", 2021, "Chaeri. You Lose! Synth-pop as virtual reality. A simulation you don't want to leave."),
    ("Magdalena Bay", "Imaginal Disk", 2024, "Killing Time. Image. Bigger, weirder, more ambitious. One of the best albums of 2024."),

    # Maroon 5
    ("Maroon 5", "Songs About Jane", 2002, "This Love. She Will Be Loved. Harder to Breathe. Before the pop pivot. An actual band making actual funk-rock."),
    ("Maroon 5", "Overexposed", 2012, "Payphone. One More Night. Max Martin joins. The transformation into a pop machine is complete."),

    # Mastodon
    ("Mastodon", "Leviathan", 2004, "Blood and Thunder. Iron Tusk. Moby Dick as a sludge-metal concept album. The white whale of heavy music."),
    ("Mastodon", "Crack the Skye", 2009, "Oblivion. The Czar. Astral projection and Rasputin. Progressive metal's masterpiece of the 2000s."),
    ("Mastodon", "Blood Mountain", 2006, "Colony of Birchmen. Crystal Skull. The bridge between sludge and prog. Relentless."),

    # Megan Thee Stallion
    ("Megan Thee Stallion", "Good News", 2020, "Savage remix with Beyoncé. Body. Cry Baby with DaBaby. Hot Girl Meg's victory lap after a nightmare year."),

    # Melanie Martinez
    ("Melanie Martinez", "Cry Baby", 2015, "Dollhouse. Pity Party. Sippy Cup. Childhood horror as pop concept. Every song is a scene."),
    ("Melanie Martinez", "PORTALS", 2023, "DEATH. VOID. The rebirth concept. Stranger, darker. She directed the whole visual album."),

    # MGMT
    ("MGMT", "Oracular Spectacular", 2007, "Time to Pretend. Kids. Electric Feel. Blog-era psychedelic pop. Three perfect singles and a generation's soundtrack."),
    ("MGMT", "Little Dark Age", 2018, "The title track went TikTok viral years later. When You Die. Me and Michael. The comeback nobody saw coming."),
    ("MGMT", "Congratulations", 2010, "Flash Delirium. Siberian Breaks is 12 minutes of prog. No singles. The anti-commercial move. Respect."),

    # Missy Elliott
    ("Missy Elliott", "Supa Dupa Fly", 1997, "The Rain. Sock It 2 Me. Timbaland beats that didn't sound like anything else. Hip hop's future arrived."),
    ("Missy Elliott", "Miss E ...So Addictive", 2001, "Get Ur Freak On. One Minute Man. That tabla beat changed everything. The song that still sounds futuristic."),
    ("Missy Elliott", "Under Construction", 2002, "Work It. Is it worth it? Let me work it. Put my thing down flip it and reverse it. Enough said."),

    # Mumford & Sons
    ("Mumford & Sons", "Sigh No More", 2009, "Little Lion Man. The Cave. Banjo folk-rock that filled arenas overnight. Launched a thousand imitators."),
    ("Mumford & Sons", "Babel", 2012, "I Will Wait. Below My Feet. More banjo. Grammy for Album of the Year. The formula works."),

    # Nick Cave
    ("Nick Cave", "CARNAGE", 2021, "White Elephant. Hand of God. Warren Ellis collaboration. Made in lockdown. Death, loss, beauty. Late-period masterwork."),

    # No Doubt
    ("No Doubt", "Tragic Kingdom", 1995, "Don't Speak. Just a Girl. Spiderweb. Ska-punk goes platinum. Gwen Stefani becomes a star."),
    ("No Doubt", "Rock Steady", 2001, "Hella Good. Hey Baby. Underneath It All. Dancehall and new wave. The genre-bending reinvention."),

    # Olivia Rodrigo
    ("Olivia Rodrigo", "SOUR", 2021, "Drivers License. Good 4 U. Deja Vu. A breakup album from a teenager that sold 15 million. Brutal."),
    ("Olivia Rodrigo", "GUTS", 2023, "Vampire. Bad Idea Right? Get Him Back! Pop-punk sophomore album. Not a fluke."),

    # One Direction
    ("One Direction", "Midnight Memories", 2013, "Story of My Life. Best Song Ever. The rock-leaning one. Five boys growing up on record."),
    ("One Direction", "Four", 2014, "Night Changes. Steal My Girl. Fireproof. Maturity. The album that hinted at five solo careers."),

    # OneRepublic
    ("OneRepublic", "Dreaming Out Loud", 2007, "Apologize with Timbaland. Stop and Stare. Ryan Tedder's songwriting on display. Pop-rock for the late 2000s."),
    ("OneRepublic", "Native", 2013, "Counting Stars. If I Lose Myself. The streaming era smash. That bass line is inescapable."),

    # Panic! at the Disco
    ("Panic! at the Disco", "A Fever You Can't Sweat Out", 2005, "I Write Sins Not Tragedies. Lying Is the Most Fun. Emo baroque pop. The title alone tells you everything."),
    ("Panic! at the Disco", "Death of a Bachelor", 2016, "Victorious. Emperor's New Clothes. Brendon Urie solo vehicle by now. Theatrical maximalism."),

    # Patti Smith
    ("Patti Smith", "Horses", 1975, "Gloria reimagined. Jesus died for somebody's sins but not mine. Punk's poet laureate. Mapplethorpe took the cover."),
    ("Patti Smith", "Dream of Life", 1988, "People Have the Power. The comeback after a decade of silence. Fred Sonic Smith on guitar."),

    # Peso Pluma
    ("Peso Pluma", "Génesis", 2023, "Ella Baila Sola. La People. Corridos tumbados went global. Mexico's new voice for a new generation."),
    ("Peso Pluma", "ÉXODO", 2024, "Lady Gaga. Hollywood. The follow-up that proved Génesis wasn't a fluke. Bigger stages."),

    # Pharrell Williams
    ("Pharrell Williams", "In My Mind", 2006, "Number One with Kanye. Can I Have It Like That with Gwen. Neptune beats for a solo debut."),
    ("Pharrell Williams", "G I R L", 2014, "Happy soundtracked the world for a year. Marilyn Monroe and Come Get It Bae are the deep cuts."),

    # Phil Collins
    ("Phil Collins", "Face Value", 1981, "In the Air Tonight. That drum fill. I Missed Again. Genesis drummer goes solo and outsells the band."),
    ("Phil Collins", "No Jacket Required", 1985, "Sussudio. One More Night. Don't Lose My Number. Five Grammys. The definition of 80s pop-rock dominance."),
    ("Phil Collins", "...But Seriously", 1989, "Another Day in Paradise. Something Happened on the Way to Heaven. The serious one. Still sold millions."),

    # PinkPantheress
    ("PinkPantheress", "Heaven Knows", 2023, "Boy's a Liar Pt. 2 with Ice Spice. Capable of Love. Two-minute songs. Drum'n'bass nostalgia from bedroom pop."),

    # PJ Harvey
    ("PJ Harvey", "Rid of Me", 1993, "The title track. Steve Albini production. Raw, loud, confrontational. Polly Jean arrived screaming."),
    ("PJ Harvey", "To Bring You My Love", 1995, "Down by the Water. C'mon Billy. Blues-gothic reinvention. The one that crossed over."),
    ("PJ Harvey", "Stories From the City, Stories From the Sea", 2000, "Good Fortune. A Place Called Home. This Is Love. Mercury Prize winner. Her most accessible."),
    ("PJ Harvey", "Let England Shake", 2011, "The Words That Maketh Murder. On Battleship Hill. War album. Mercury Prize again. England's conscience."),

    # Portishead
    ("Portishead", "Dummy", 1994, "Glory Box. Sour Times. Wandering Star. Trip-hop invented. Beth Gibbons' voice over vinyl crackle. Perfect."),
    ("Portishead", "Portishead", 1997, "All Mine. Over. Cowboys. Darker, more claustrophobic. Self-titled and self-assured."),
    ("Portishead", "Third", 2008, "Machine Gun. The Rip. Silence for 11 years then this. Industrial, krautrock, unrecognizable. Terrifying."),

    # Post Malone
    ("Post Malone", "Stoney", 2016, "White Iverson and Congratulations. Genre-proof. A frat party with feelings."),
    ("Post Malone", "beerbongs & bentleys", 2018, "Rockstar with 21 Savage. Psycho. Better Now. He owned the summer."),
    ("Post Malone", "Hollywood's Bleeding", 2019, "Circles is the pivot. Sunflower with Swae Lee is Spider-Verse perfection."),

    # Procol Harum
    ("Procol Harum", "Procol Harum", 1967, "A Whiter Shade of Pale. That Bach-inspired organ. Conquistador. Psychedelic baroque rock. The debut that echoed forever."),
    ("Procol Harum", "A Salty Dog", 1969, "The title track is symphonic rock before prog existed. Wreck of the Hesperus. Their most ambitious."),

    # Rauw Alejandro
    ("Rauw Alejandro", "VICE VERSA", 2021, "Todo de Ti is the summer anthem. Aquel Nap ZzZz. Puerto Rican R&B with reggaeton pulse."),
    ("Rauw Alejandro", "Cosa nuestra", 2024, "Full salsa pivot. De Carolina. Respect for the roots. Latin pop's smoothest operator goes traditional."),

    # Roxy Music
    ("Roxy Music", "Roxy Music", 1972, "Virginia Plain. Re-Make/Re-Model. Brian Eno's synths meet Bryan Ferry's croon. Art rock arrives in a tuxedo."),
    ("Roxy Music", "For Your Pleasure", 1973, "In Every Dream Home a Heartache. Editions of You. Eno's last album with them. The weird peak."),
    ("Roxy Music", "Avalon", 1982, "More Than This. The title track. Silk and synths. The smoothest album ever made. Ferry in his final form."),

    # Sabrina Carpenter
    ("Sabrina Carpenter", "emails i can't send", 2022, "Nonsense. Skinny Dipping. The transition from Disney kid to pop artist. The outro ad-libs started here."),
    ("Sabrina Carpenter", "Short n' Sweet", 2024, "Espresso. Please Please Please. Taste. The summer album. Petite frame, massive hooks."),

    # Siouxsie and the Banshees
    ("Siouxsie and the Banshees", "Juju", 1981, "Spellbound. Arabian Knights. Night Shift. Gothic post-punk's defining album."),
    ("Siouxsie and the Banshees", "The Scream", 1978, "Hong Kong Garden. Jigsaw Feeling. The debut. Punk evolving into something stranger."),
    ("Siouxsie and the Banshees", "A Kiss in the Dreamhouse", 1982, "Slowdive. Cascade. Lush, psychedelic, gorgeous. The romantic side of goth."),

    # Slayyyter
    ("Slayyyter", "Troubled Paradise", 2021, "Cowboys. Serial Killer. Y2K pop maximalism with a hyperpop edge. No filter, no shame."),

    # Squid
    ("Squid", "Bright Green Field", 2021, "Narrator. Pamphlets. Seven minutes of controlled post-punk panic. Brighton's most chaotic export."),

    # Supertramp
    ("Supertramp", "Crime of the Century", 1974, "School. Dreamer. Bloody Well Right. Art-prog that sold. The Wurlitzer enters the chat."),
    ("Supertramp", "Breakfast in America", 1979, "The Logical Song. Take the Long Way Home. Goodbye Stranger. 20 million sold. Pop-prog perfection."),
    ("Supertramp", "Even in the Quietest Moments...", 1977, "Give a Little Bit. Fool's Overture. The gentle one between the masterpieces."),

    # Swedish House Mafia
    ("Swedish House Mafia", "Paradise Again", 2022, "Don't You Worry Child. Save the World. Greyhound. The reunion album. EDM's holy trinity returns."),

    # Tems
    ("Tems", "Born in the Wild", 2024, "Free Mind. Love Me JeJe. Nigerian Afrobeats meets R&B soul. The debut that justified every feature verse."),

    # The Killers
    ("The Killers", "Hot Fuss", 2004, "Mr. Brightside. Somebody Told Me. All These Things That I've Done. Perfect debut. Every track a single."),
    ("The Killers", "Sam's Town", 2006, "When You Were Young is the anthem. Read My Mind is the grower. Springsteen in the desert."),
    ("The Killers", "Day & Age", 2008, "Human. Spaceman. Synth-pop pivot. Are we human or are we dancer."),
    ("The Killers", "Imploding the Mirage", 2020, "Caution opens like a movie. Blowback is the buried gem. The comeback nobody expected."),

    # The Mamas & The Papas
    ("The Mamas & the Papas", "If You Can Believe Your Eyes and Ears", 1966, "California Dreamin'. Monday Monday. Four-part harmonies that defined Laurel Canyon. The dream starts here."),

    # The Offspring
    ("The Offspring", "Smash", 1994, "Self Esteem. Come Out and Play. Gotta Get Away. 11 million on Epitaph. Indie label punk gone nuclear."),
    ("The Offspring", "Americana", 1998, "Pretty Fly for a White Guy. The Kids Aren't Alright. Why Don't You Get a Job? Pop-punk for the masses."),

    # The Stooges
    ("The Stooges", "The Stooges", 1969, "I Wanna Be Your Dog. No Fun. 1969. Iggy Pop and three chords. Punk five years early."),
    ("The Stooges", "Fun House", 1970, "Down on the Street. TV Eye. Loose. Raw Power before Raw Power. The heaviest album of 1970."),

    # The Verve
    ("The Verve", "Urban Hymns", 1997, "Bitter Sweet Symphony. The Drugs Don't Work. Lucky Man. Britpop's last great album before it all ended."),
    ("The Verve", "A Northern Soul", 1995, "History. On Your Own. Psychedelic shoegaze before they found the strings. The underrated one."),

    # Thin Lizzy
    ("Thin Lizzy", "Jailbreak", 1976, "The Boys Are Back in Town. Jailbreak. Emerald. Twin guitar harmonies. Phil Lynott's Dublin poetry meets hard rock."),
    ("Thin Lizzy", "Black Rose: A Rock Legend", 1979, "Waiting for an Alibi. Do Anything You Want To. Róisín Dubh. Gary Moore on guitar. The peak."),
    ("Thin Lizzy", "Bad Reputation", 1977, "Dancing in the Moonlight. Opium Trail. Killer on the Loose. Lynott as rock's most charismatic frontman."),

    # Tito Puente
    ("Tito Puente", "Dance Mania", 1958, "Oye Como Va before Santana made it famous. Hong Kong Mambo. El Rey del Timbal on full display. The one."),
    ("Tito Puente", "El Rey Bravo", 1962, "Para los rumberos. Latin jazz perfection. The timbales are everything."),

    # TLC
    ("TLC", "CrazySexyCool", 1994, "Waterfalls. Creep. Red Light Special. 23 million sold. The best-selling album by an American girl group."),
    ("TLC", "FanMail", 1999, "No Scrubs. Unpretty. Dear Lie. Futuristic R&B. Dallas Austin and Babyface production."),

    # Turnstile
    ("Turnstile", "GLOW ON", 2021, "Mystery. Blackout. Holiday. Hardcore meets summer energy. The album that broke hardcore into the mainstream."),
    ("Turnstile", "Time & Space", 2018, "Real Thing. Generator. Bomb. Hardcore punk with hooks. The bridge between underground and daylight."),

    # Twenty One Pilots
    ("Twenty One Pilots", "Blurryface", 2015, "Stressed Out. Ride. Tear in My Heart. Every track charted. Diamond album. Tyler Joseph's anxiety as arena pop."),
    ("Twenty One Pilots", "Vessel", 2012, "Holding on to You. Car Radio. Ode to Sleep. The indie album before the explosion. Already great."),
    ("Twenty One Pilots", "Trench", 2018, "Jumpsuit. Chlorine. My Blood. Concept album. Darker, more ambitious. Dema mythology."),

    # Village People
    ("Village People", "YMCA (Original Album 1978)", 1978, "Y.M.C.A. The song. In the Navy. Every sports event, every wedding. Camp as cultural institution."),

    # Wet Leg
    ("Wet Leg", "Wet Leg", 2022, "Chaise Longue. Wet Dream. Ur Mum. Deadpan Isle of Wight indie with hooks for days. Mercury-nominated debut."),

    # Yeah Yeah Yeahs
    ("Yeah Yeah Yeahs", "Fever to Tell", 2003, "Maps. Date With the Night. Pin. Karen O's feral energy captured on tape. Art-punk perfection."),
    ("Yeah Yeah Yeahs", "It's Blitz!", 2009, "Zero. Heads Will Roll. Synth-dance pivot. The glam reinvention. Still wild."),

    # Yeat
    ("Yeat", "2 Alivë", 2022, "Poppin. Dëja vu. Autonomous trap. The beats swallow everything. Rage music for the algorithm era."),
    ("Yeat", "LYFESTYLE", 2024, "Breathe. Drake feature. Mainstream arrival. Same energy, bigger stages."),

    # Young Thug
    ("Young Thug", "So Much Fun", 2019, "The London. Hot. Surf. Bad Bad Bad. Atlanta trap elevated to pop art."),
    ("Young Thug", "Punk", 2021, "Acoustic guitars and singing. Thugger goes left. Droppin Jewels with Travis Scott."),
    ("Young Thug", "BUSINESS IS BUSINESS", 2023, "Released while incarcerated. Unfinished but defiant."),

    # Zach Bryan
    ("Zach Bryan", "American Heartbreak", 2022, "Something in the Orange. Heading South. Open the Gate. Triple album. Country folk from a Navy vet's heart."),
    ("Zach Bryan", "Zach Bryan", 2023, "Tourniquet. I Remember Everything with Kacey Musgraves. Oklahoma. The self-titled statement."),
    ("Zach Bryan", "The Great American Bar Scene", 2024, "Pink Skies. 28. Bigger stages, same sincerity. Country's most authentic voice going."),

    # Zedd
    ("Zedd", "Clarity", 2012, "Clarity with Foxes. Spectrum. EDM pop crossover. Grammy winner. The song that brought electronic to pop radio."),
    ("Zedd", "True Colors", 2015, "Beautiful Now. I Want You to Know with Selena Gomez. Pop-EDM's polished peak."),
]

def main():
    # ── Update artist-editorial.csv ──────────────────────────────────
    rows = []
    fieldnames = None
    with open('public/data/artist-editorial.csv', encoding='utf-8-sig', newline='') as f:
        reader = csv.DictReader(f)
        fieldnames = reader.fieldnames
        for row in reader:
            rows.append(row)

    updated = 0
    # Build lookup of our new descriptions
    all_artists = {**ARTISTS, **SPECIAL_ARTISTS}

    for row in rows:
        name_lower = row['name'].lower()
        if name_lower in all_artists and row['confirmed'] != 'yes':
            icon, desc, eric_take = all_artists[name_lower]
            row['confirmed'] = 'yes'
            row['icon'] = icon
            row['description'] = desc
            row['drafted'] = 'yes'
            if eric_take:
                row['eric_take'] = eric_take
            updated += 1

    # Write back
    with open('public/data/artist-editorial.csv', 'w', encoding='utf-8', newline='') as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows)

    print(f"Updated {updated} artists in artist-editorial.csv")

    # ── Append to album-editorial.csv ────────────────────────────────
    with open('public/data/album-editorial.csv', 'a', encoding='utf-8', newline='') as f:
        writer = csv.writer(f)
        for artist, title, year, desc in ALBUMS:
            writer.writerow([artist, title, year, desc])

    print(f"Appended {len(ALBUMS)} album descriptions to album-editorial.csv")

if __name__ == '__main__':
    main()
