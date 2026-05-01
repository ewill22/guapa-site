"""One-off: fill icon+description for confirmed artists with empty fields."""
import csv
from pathlib import Path

CSV_PATH = Path(__file__).parent.parent / "public" / "data" / "artist-editorial.csv"

UPDATES = {
    "Bjork": ("\U0001F9A2", "Icelandic shapeshifter. Hyperballad. A voice that bends physics."),
    "Björk": ("\U0001F9A2", "Icelandic shapeshifter. Hyperballad. A voice that bends physics."),
    "Bruce Springsteen": ("\U0001F6E3️", "Born to Run. The Boss. New Jersey's poet of broken-down cars and broken-down dreams."),
    "Grateful Dead": ("\U0001F480", "Jerry Garcia's never-ending tour. Truckin'. The blueprint for jam bands."),
    "KISS": ("\U0001F445", "Greasepaint and pyrotechnics. Detroit Rock City. Rock and roll all nite, every nite."),
    "Lady Gaga": ("\U0001F3AD", "Bad Romance. Theater kid energy weaponized into pop perfection."),
    "Linkin Park": ("\U0001F525", "Hybrid Theory rewired nu-metal for a generation. In the End, it doesn't even matter."),
    "Lou Reed": ("\U0001F576️", "Walk on the Wild Side. Velvet Underground graduate who made New York sound dangerous."),
    "Pet Shop Boys": ("\U0001F4BF", "Neil and Chris. West End Girls. Synth-pop intellectuals who never blinked."),
    "The Smiths": ("\U0001F339", "Morrissey's misery, Marr's chiming guitars. How Soon Is Now? Forever."),
    "Van Halen": ("\U0001F3B8", "Eddie's tapping. Diamond Dave's split. Eruption changed what a guitar could do."),
    "Alice Cooper": ("\U0001F40D", "School's Out. Shock rock pioneer. Boa constrictors and guillotines."),
    "Ariana Grande": ("\U0001F380", "Whistle tones and cat ears. Pop's most agile voice this side of Mariah."),
    "Armin van Buuren": ("\U0001F3A7", "A State of Trance. Dutch trance commander. Five hours of buildup, one perfect drop."),
    "Bananarama": ("\U0001F34C", "Venus. Three girls from London who outlasted every boy band of the 80s."),
    "Bay City Rollers": ("\U0001F3F4\U000E0067\U000E0062\U000E0073\U000E0063\U000E0074\U000E007F", "Tartan trousers and teenage screams. Saturday Night spelled S-A-T-U-R-D-A-Y."),
    "Bon Jovi": ("\U0001F920", "Livin' on a Prayer. New Jersey's other son, hair metal's romantic."),
    "Boney M.": ("\U0001F334", "Rasputin. Frank Farian's disco caravan. Daddy Cool, Brown Girl, By the Rivers of Babylon."),
    "Boyzone": ("☘️", "Ronan and the lads. Irish ballad factory. No Matter What."),
    "Bucks Fizz": ("\U0001F380", "Eurovision 1981. Skirt-rip choreography. Making Your Mind Up."),
    "Charli xcx": ("\U0001F49A", "Brat. Hyperpop's chaos engine. 360."),
    "Céline Dion": ("\U0001F48E", "My Heart Will Go On. Quebec's gift to the world's biggest stages."),
    "David Guetta": ("\U0001F39A️", "French house turned arena EDM. When Love Takes Over rewired pop radio."),
    "Del Shannon": ("\U0001F319", "Runaway. That falsetto. That Musitron solo."),
    "Duran Duran": ("\U0001F30A", "Hungry Like the Wolf. Yacht-rock new wave. Style as substance."),
    "East 17": ("\U0001F9E2", "Stay Another Day. Walthamstow's answer to Take That, with parkas."),
    "Erasure": ("\U0001F49C", "Andy Bell and Vince Clarke. A Little Respect. Synth-pop with a heart."),
    "Ian Hunter": ("\U0001F3A9", "Mott the Hoople frontman. All the Young Dudes. Rock dandy with a working-class chip."),
    "Imagine Dragons": ("\U0001F941", "Radioactive. Stadium rock built for trailers. Las Vegas via earnestness."),
    "JLS": ("✨", "Aston, Marvin, Oritse, JB. X Factor runners-up who outlasted the winners. Beat Again."),
    "KAT-TUN": ("\U0001F1EF\U0001F1F5", "Johnny's six-piece turned five. Real Face. J-pop with a rock edge."),
    "Katy Perry": ("\U0001F36D", "Teenage Dream. Whipped cream cans and California cosplay."),
    "Kylie Minogue": ("✨", "I Should Be So Lucky to Can't Get You Out of My Head. Disco's eternal pop princess."),
    "Mariah Carey": ("\U0001F98B", "Five-octave range. Whistle register icon. Christmas is hers, forever."),
    "Middle of the Road": ("\U0001F414", "Chirpy Chirpy Cheep Cheep. Glasgow bubblegum pop, accidental Italian fame."),
    "Modern Talking": ("\U0001F4BC", "You're My Heart, You're My Soul. German Eurodisco. Dieter Bohlen's empire."),
    "Muse": ("\U0001F3BB", "Matt Bellamy's falsetto, Chris and Dom's thunder. Knights of Cydonia. Operatic prog for the iPod era."),
    "Mylène Farmer": ("\U0001F940", "France's gothic pop queen. Desenchantee. Theatrical, untranslatable, untouchable."),
    "NEWS": ("\U0001F4FA", "Yamapi, Tegoshi, the Johnny's quartet. Weeeek. J-pop boyband royalty."),
    "P!nk": ("\U0001F3AA", "Trapeze rigs and rasp. So What. Pop punk by way of Doylestown PA."),
    "Petula Clark": ("\U0001F68C", "Downtown. The British voice that conquered American radio in '64."),
    "Placebo": ("\U0001F5A4", "Brian Molko's nasal sneer. Pure Morning. Glam goth for the Y2K generation."),
    "Rick Springfield": ("\U0001F494", "Jessie's Girl. Australian soap actor turned power-pop hit machine."),
    "SMAP": ("\U0001F3A4", "Five guys, fifteen million records, a televised farewell that broke a nation. Sekai ni Hitotsu Dake no Hana."),
    "Steps": ("5️⃣", "Tragedy. Five Brits in matching outfits, choreographed to within an inch of their lives."),
    "Sweet": ("\U0001F36D", "Ballroom Blitz. Glam rock's snarl and sparkle."),
    "The Everly Brothers": ("\U0001F46C", "Don and Phil's harmonies. Bye Bye Love. The blueprint for every duo since."),
    "The Jacksons": ("\U0001F31F", "Five brothers from Gary, Indiana. Then six. Michael's launchpad and Jermaine's home."),
    "Tom Jones": ("\U0001F399️", "It's Not Unusual. Welsh roar. Knickers on stage. Sex Bomb at 60."),
    "Tommy Roe": ("\U0001F36C", "Sheila. Dizzy. Bubblegum pop's sugar dealer."),
    "Westlife": ("\U0001F48D", "Five Irish lads on stools. Flying Without Wings. Boyband ballad factory."),
    "Whigfield": ("\U0001F483", "Saturday Night. The dance that owned 1994. Italian Eurodance disguised as Danish."),
    "嵐": ("\U0001F32A️", "Five-piece Johnny's storm. A.RA.SHI. Two decades of J-pop dominance before the indefinite hiatus."),
    "松田聖子": ("\U0001F338", "Showa-era idol queen. Akai Sweet Pea. Defined what kawaii meant on stage."),
}

with CSV_PATH.open("r", encoding="utf-8-sig", newline="") as f:
    rows = list(csv.reader(f))

header = rows[0]
name_idx = header.index("name")
icon_idx = header.index("icon")
desc_idx = header.index("description")
confirmed_idx = header.index("confirmed")

updated = 0
missing = []
for name, (icon, desc) in UPDATES.items():
    found = False
    for row in rows[1:]:
        if row[name_idx] == name:
            if row[confirmed_idx] != "yes":
                print(f"WARN: {name} is not confirmed; skipping")
                found = True
                break
            row[icon_idx] = icon
            row[desc_idx] = desc
            updated += 1
            found = True
            break
    if not found:
        missing.append(name)

with CSV_PATH.open("w", encoding="utf-8", newline="") as f:
    csv.writer(f, lineterminator="\r\n").writerows(rows)

print(f"Updated {updated} rows")
if missing:
    print(f"MISSING: {missing}")
