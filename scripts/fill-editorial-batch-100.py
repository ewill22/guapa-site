"""Batch-fill 100 unconfirmed artists (Bl-Ed alphabetical range)."""
import csv, io, sys
from pathlib import Path

if sys.stdout.encoding and sys.stdout.encoding.lower() != "utf-8":
    sys.stdout.reconfigure(encoding="utf-8")

CSV_PATH = Path(__file__).parent.parent / "public" / "data" / "artist-editorial.csv"

UPDATES = {
    "Black Eyed Peas": ("\U0001F3A4", "I Gotta Feeling. Where Is the Love. Will.i.am's pop-crossover machine."),
    "Black Uhuru": ("\U0001F1EF\U0001F1F2", "Reggae's first Grammy. Sinsemilla. Sly and Robbie's house band."),
    "Blind Guardian": ("⚔️", "German power-metal bards. Nightfall in Middle-Earth. Hansi Kursch's many-tracked harmonies."),
    "Blind Lemon Jefferson": ("\U0001F441️", "Texas country-blues founder. See That My Grave Is Kept Clean."),
    "Blind Willie Johnson": ("\U0001F3B8", "Slide-guitar gospel. Dark Was the Night, Cold Was the Ground. On Voyager 1, heading out of the solar system."),
    "blink‐182": ("\U0001FA74", "All the Small Things. So-Cal pop-punk's snot-rocket trio."),
    "Bloc Party": ("\U0001F3B8", "Silent Alarm. London post-punk revival sharper than most."),
    "Blondie": ("\U0001F306", "Heart of Glass. Debbie Harry's downtown punk-disco bridge."),
    "Blue Öyster Cult": ("\U0001F40F", "Don't Fear the Reaper. More cowbell. Long Island metal that was always weirder than it looked."),
    "Bob Marley": ("☮️", "One Love. Redemption Song. The voice that made reggae global."),
    "Bob Sinclar": ("\U0001F30D", "Love Generation. French house's smiling face."),
    "Bobby Womack": ("\U0001F3A4", "Across 110th Street. Soul man who survived everything: Sam Cooke's death, drugs, four decades."),
    "Bone Thugs‐n‐Harmony": ("☘️", "Cleveland harmony-rap. Tha Crossroads. Eazy-E's last Ruthless signing."),
    "Bonnie Tyler": ("⚡", "Total Eclipse of the Heart. Welsh rasp. Jim Steinman's biggest hit factory."),
    "Booker T. & the MG’s": ("\U0001F3B9", "Green Onions. Stax house band. Steve Cropper's chicken-scratch guitar."),
    "Boots Randolph": ("\U0001F3B7", "Yakety Sax. The Benny Hill closing-credits saxophone."),
    "Boris": ("\U0001F39A️", "Tokyo experimental drone-metal trio. Pink. Genre too broad to pin."),
    "Brook Benton": ("\U0001F3A4", "Rainy Night in Georgia. Smooth bass-baritone bridge between R&B and country."),
    "Bryan Adams": ("\U0001F1E8\U0001F1E6", "Summer of '69. Cuts Like a Knife. Canadian heartland rock built for arena rafters."),
    "BT": ("\U0001F4BB", "Brian Transeau. Trance pioneer who made stutter-edit a thing. Ima."),
    "Buck Owens": ("\U0001F920", "Bakersfield Sound. Tiger by the Tail. Country with a Telecaster snarl."),
    "Buckethead": ("\U0001FAA3", "KFC bucket on the head. White mask. 600+ records of guitar hyperspeed isolation."),
    "Bud Powell": ("\U0001F3B9", "Bebop's piano architect. Un Poco Loco. Burned bright and short."),
    "Buddy Guy": ("\U0001F3B8", "Damn Right, I've Got the Blues. Chicago blues elder, still electric, still leading."),
    "Burna Boy": ("\U0001F30D", "African Giant. Twice as Tall. Afrobeats' arena export."),
    "Bush": ("\U0001F33E", "Sixteen Stone. Glycerine. British grunge, mocked at the time, vindicated now."),
    "B’z": ("\U0001F1EF\U0001F1F5", "Japan's biggest rock duo. Tak Matsumoto and Koshi Inaba. 100 million records, almost none outside Japan."),
    "Calexico": ("\U0001F335", "Tucson border-noir. Tex-Mex through Joey Burns and John Convertino's slow-burn arrangements."),
    "Calvin Harris": ("\U0001FAA9", "Summer. We Found Love. Scottish DJ-producer who turned EDM into pop's default base."),
    "Can": ("\U0001F39B️", "Tago Mago. Ege Bamyasi. Krautrock's most rhythmic, most experimental cell."),
    "Candlemass": ("⚱️", "Epicus Doomicus Metallicus. Swedish doom's name-the-genre album."),
    "Canned Heat": ("\U0001F682", "On the Road Again. Going Up the Country. Boogie blues that defined Woodstock's sweat."),
    "Cannibal Corpse": ("\U0001FAA6", "Florida death metal's lyrical extremists. Tomb of the Mutilated. Banned country after country."),
    "Cannonball Adderley": ("\U0001F3B7", "Mercy, Mercy, Mercy. Alto saxophonist who could swing hard. On Miles' Kind of Blue."),
    "Caparezza": ("\U0001F3A4", "Italian rapper with a punk-prog brain. Vengo dalla Luna. Concept albums in dense Bari Italian."),
    "Carole King": ("\U0001F3B9", "Tapestry. Brill Building hitmaker turned solo confessional. It's Too Late."),
    "Cathedral": ("⛪", "UK doom revivalists. Forest of Equilibrium. Lee Dorrian from Napalm Death to Sabbath worship."),
    "Charlie Parker": ("\U0001F426", "Bird. Bebop's primary architect. Ornithology. Pure improvisation and tragedy."),
    "Chet Atkins": ("\U0001F3B8", "Mr. Guitar. Country's fingerpicking architect. Producer of Nashville's most polished records."),
    "Chick Corea": ("\U0001F3B9", "Spain. Return to Forever. Jazz-fusion's most rhythmic mind, equally at home with classical."),
    "Children of Bodom": ("\U0001F43A", "Finnish melodic death-power. Hatebreeder. Alexi Laiho's neoclassical shred and snarl."),
    "Chris Rea": ("\U0001F699", "Driving Home for Christmas. Road to Hell. British slide-guitar bluesman with a smoked-cigarette voice."),
    "Christine McVie": ("\U0001F319", "Don't Stop. Songbird. Fleetwood Mac's quiet melodic engine."),
    "Clifford Brown": ("\U0001F3BA", "Brownie. Joy Spring. Bebop trumpeter killed at 25 — a brief, perfect arc."),
    "Clutch": ("\U0001FAA8", "Maryland riff factory. Earth Rocker. Twenty-five years of stoner-rock without compromise."),
    "Cocteau Twins": ("☁️", "Heaven or Las Vegas. Elizabeth Fraser's invented language. Dream-pop's blueprint."),
    "Coldplay": ("\U0001F30C", "Yellow. Fix You. Stadium-sized melancholy that critics love to hate and fans love anyway."),
    "Coleman Hawkins": ("\U0001F3B7", "Body and Soul. Tenor saxophone's first true voice — every player after owes the instrument."),
    "Conway Twitty": ("\U0001F920", "Hello Darlin'. From rockabilly to Nashville's gentleman crossover."),
    "Cosmic Gate": ("\U0001F320", "Be Your Sound. German trance duo. Twenty years of festival big-room."),
    "Count Basie": ("\U0001F3BC", "One More Once. Kansas City swing's master. Riff-driven big bands and the most economic piano in jazz."),
    "Cradle of Filth": ("\U0001F987", "Gothic-symphonic black metal. Dusk and Her Embrace. Dani Filth's shriek as house style."),
    "Crazy Horse": ("\U0001F40E", "Neil Young's ragged gang. Cortez the Killer. Three chords and the truth, looped for ten minutes."),
    "Creedence Clearwater Revival": ("\U0001F30A", "Fortunate Son. Proud Mary. Bayou rock from Berkeley — John Fogerty's swamp-growl."),
    "Cypress Hill": ("\U0001F33F", "Insane in the Brain. B-Real and Sen Dog. South Gate weed-rap pioneers."),
    "Dalida": ("\U0001F339", "Italian-Egyptian-French chanson queen. Gigi l'Amoroso. Thirty languages, one fate."),
    "Dark Funeral": ("\U0001F311", "Swedish black metal's coldest blueprint. The Secrets of the Black Arts."),
    "Dark Tranquillity": ("⚔️", "Gothenburg melodic death-metal architects. The Gallery. The genre's blueprint."),
    "Daryl Hall & John Oates": ("\U0001F3A4", "Maneater. Rich Girl. Philly blue-eyed soul's most successful duo."),
    "Dave Brubeck": ("\U0001F3B9", "Take Five. Time Out. Odd-meter jazz that crossed into the suburban living room."),
    "Dave Matthews Band": ("\U0001F3BB", "Crash. South African-born, Charlottesville-bred. Frat-rock with sax, violin, and improvisational stamina."),
    "David Banner": ("\U0001F3A4", "Mississippi. Like a Pimp. Southern rapper turned activist with a Master's from Maryland."),
    "David “Honeyboy” Edwards": ("\U0001F3B8", "Last of the Delta bluesmen. With Robert Johnson the night he died. Played until 96."),
    "Daz Dillinger": ("\U0001F43A", "Long Beach G-funk. Tha Dogg Pound. Snoop's cousin, Death Row architect."),
    "De La Soul": ("\U0001F490", "3 Feet High and Rising. Native Tongues founders. Hip-hop's psychedelic detour."),
    "Dead Can Dance": ("\U0001F56F️", "Lisa Gerrard's invented vocalese. Toward the Within. World music that didn't borrow — it built."),
    "deadmau5": ("\U0001F42D", "Joel Zimmerman. Strobe. Ghosts 'n' Stuff. Toronto progressive house with a giant cartoon helmet."),
    "Dean Martin": ("\U0001F3A4", "That's Amore. Volare. The Rat Pack's coolest, most relaxed."),
    "Death": ("\U0001F480", "Florida death metal's prime mover. Chuck Schuldiner's Symbolic, Human. Named the genre."),
    "Death Cab for Cutie": ("✉️", "Transatlanticism. I Will Follow You into the Dark. Bellingham indie's most literate."),
    "Deep Forest": ("\U0001F333", "Sweet Lullaby. World-music sampling pioneers. New Age's most cinematic moment."),
    "Deep Purple": ("⚡", "Smoke on the Water. That riff. Hard rock's heaviest fingerprint."),
    "Deftones": ("\U0001F300", "White Pony. Around the Fur. Sacramento metal-shoegaze that the genre is still catching up to."),
    "Destruction": ("☠️", "German thrash's holy trinity, third with Kreator and Sodom. Eternal Devastation."),
    "Devendra Banhart": ("\U0001F33F", "Cripple Crow. Venezuela-born freak-folk troubadour. Tropical surrealism."),
    "Diana Ross": ("\U0001F48E", "Supremes lead, then bigger solo. Ain't No Mountain High Enough. Glamour as posture."),
    "Die Toten Hosen": ("\U0001F1E9\U0001F1EA", "Dusseldorf punk turned national institution. An Tagen wie diesen. German youth's longest soundtrack."),
    "Die Ärzte": ("\U0001F48A", "Berlin punk-pop comedians. Schrei nach Liebe. Banned, beloved, perpetual."),
    "Dimmu Borgir": ("\U0001F311", "Norwegian symphonic black metal. Death Cult Armageddon. Operatic doom for stadium crowds."),
    "Dinosaur Jr.": ("\U0001F995", "J Mascis's amp-stack guitar wash. Where You Been. Indie loud-quiet-loud blueprint."),
    "Dionne Warwick": ("\U0001F339", "Walk On By. Burt Bacharach's voice. Forty hits across thirty years."),
    "Dizzy Gillespie": ("\U0001F3BA", "Bebop co-founder. Bent trumpet, puffed cheeks, A Night in Tunisia."),
    "DJ BoBo": ("\U0001F3B6", "Swiss Eurodance. Somebody Dance with Me. Rene Baumann's 90s ubiquity."),
    "DJ Fresh": ("⚡", "Gold Dust. Hot Right Now. Pendulum founder turned solo drum-and-bass crossover."),
    "DJ Shadow": ("\U0001F312", "Endtroducing. The first all-sample full-length. Hip-hop's avant-garde turn."),
    "Django Reinhardt": ("\U0001F525", "Two-fingered guitar virtuoso. Manouche jazz architect. Quintette du Hot Club de France."),
    "Doc Watson": ("\U0001F3B8", "Deep Gap, NC. Flatpicking master who could outplay anyone — sighted or not."),
    "Dolly Parton": ("\U0001F98B", "Jolene. 9 to 5. Country's most generous icon. Songwriter, philanthropist, force."),
    "Don Cherry": ("\U0001F3BA", "Pocket trumpet. Ornette Coleman's foil. Free-jazz globalist before world music had a name."),
    "Don Williams": ("\U0001F920", "The Gentle Giant. Tulsa Time. Country's slow-burn baritone."),
    "Donald Byrd": ("\U0001F3BA", "Black Byrd. Hard-bop trumpeter who turned funk-jazz crossover into a Blue Note revolution."),
    "Dorival Caymmi": ("\U0001F334", "Bahian songwriter. Marina. The Brazilian voice that came before bossa nova."),
    "Dua Lipa": ("\U0001F483", "Don't Start Now. Levitating. The 2020s pop sound: disco bass and clean vocal hooks."),
    "Duane Eddy": ("\U0001F3B8", "Rebel Rouser. Twangy, low-string instrumental rock. Every surf riff descends."),
    "Duke Ellington": ("\U0001F3BC", "Take the A Train. Mood Indigo. Sophisticated Lady. Jazz's most prolific composer-bandleader."),
    "Eagles": ("\U0001F985", "Hotel California. Take It Easy. California country-rock at its most layered, most contested."),
    "Eddie Floyd": ("\U0001F3A4", "Knock on Wood. Stax soul man, songwriter for everyone in the room."),
    "Eddy Arnold": ("\U0001F33D", "Make the World Go Away. Tennessee Plowboy turned countrypolitan smooth."),
    "Eddy Mitchell": ("\U0001F1EB\U0001F1F7", "French rockabilly. Les Chaussettes Noires to crooner. Sixty years of Gallic Americana."),
    "Edward Maya": ("\U0001F1F7\U0001F1F4", "Stereo Love. Romanian house pioneer. That accordion hook owned 2010."),
}

with CSV_PATH.open("r", encoding="utf-8-sig", newline="") as f:
    rows = list(csv.reader(f))

header = rows[0]
ni = header.index("name")
ii = header.index("icon")
di = header.index("description")
ci = header.index("confirmed")

updated = 0
missing = []
for name, (icon, desc) in UPDATES.items():
    found = False
    for row in rows[1:]:
        if row[ni] == name:
            row[ii] = icon
            row[di] = desc
            row[ci] = "yes"
            updated += 1
            found = True
            break
    if not found:
        missing.append(name)

buf = io.StringIO()
csv.writer(buf, lineterminator="\r\n").writerows(rows)
CSV_PATH.write_bytes(b"\xef\xbb\xbf" + buf.getvalue().encode("utf-8"))

print(f"Updated {updated} rows")
if missing:
    print(f"MISSING: {missing}")
