"""Batch-fill icon + description for unconfirmed artists. Sets confirmed=yes, drafted=yes."""
import csv
from pathlib import Path

CSV_PATH = Path(__file__).parent.parent / "public" / "data" / "artist-editorial.csv"

UPDATES = {
    "2 Unlimited": ("\U0001F3B6", "No Limit. Get Ready for This. Belgian-Dutch Eurodance ubiquitous in every 90s sports arena."),
    "Above & Beyond": ("☁️", "Sun & Moon. Group Therapy. British trance trio that turned cathartic vocals into a brand."),
    "Ace of Base": ("\U0001F1F8\U0001F1EA", "The Sign. All That She Wants. Swedish reggae-pop that ruled 1993."),
    "Aesop Rock": ("\U0001F4DA", "Densest vocabulary in rap. None Shall Pass. Abstract, layered, undeniable."),
    "Ahmad Jamal": ("☕", "Poinciana. Spaced piano, generous silences. Miles Davis called him a giant."),
    "Akira Yamaoka": ("\U0001F3AE", "Silent Hill. Industrial dread sculpted into a soundtrack canon."),
    "Albert Collins": ("❄️", "Master of the Telecaster. Ice Pickin'. Texas blues with a sub-zero tone."),
    "Alexis Korner": ("\U0001F1EC\U0001F1E7", "Father of British blues. The teacher behind Jagger, Page, Plant."),
    "Alice Coltrane": ("\U0001FAB7", "Journey in Satchidananda. Harp, Wurlitzer, devotion. John's spiritual heir."),
    "Alicia Keys": ("\U0001F511", "Fallin'. Songs in A Minor. Piano prodigy with Hell's Kitchen grit."),
    "Aloe Blacc": ("\U0001F3B7", "I Need a Dollar. Smooth gospel-soul with a hustler's ache."),
    "Amon Amarth": ("⚔️", "Swedish death metal Vikings. Twilight of the Thunder God. Odin, every album."),
    "Amon Tobin": ("\U0001F300", "Bricolage. Cinematic electronica built from sampled jazz fragments."),
    "Amorphis": ("\U0001F332", "Finnish prog-metal of myth and forest. Tales from the Thousand Lakes."),
    "Anathema": ("\U0001F30C", "Liverpool doom turned post-rock cathedral. We're Here Because We're Here."),
    "Andrew Bird": ("\U0001F426", "Whistled violin loops. Armchair Apocrypha. A one-man chamber group."),
    "Angie Stone": ("\U0001F49C", "Wish I Didn't Miss You. D'Angelo's collaborator with a voice carved from church wood."),
    "Animal Collective": ("\U0001F43A", "Merriweather Post Pavilion. My Girls. Psych-pop weirdos who briefly ruled indie."),
    "Annihilator": ("\U0001FA93", "Jeff Waters. Alice in Hell. Canadian thrash with technical wizardry."),
    "Anthony Braxton": ("\U0001F3BC", "Avant-garde saxophonist and composer. Diagrammed free jazz as a discipline."),
    "Anthrax": ("☣️", "Bring the Noise with Public Enemy. NYC thrash with the most personality of the Big Four."),
    "Antônio Carlos Jobim": ("\U0001F334", "The Girl from Ipanema. Bossa nova's architect. The accent matters."),
    "Arch Enemy": ("⚔️", "Swedish melodic death metal. Angela Gossow's growl, then Alissa White-Gluz's roar."),
    "Arrested Development": ("✊", "Tennessee. People Everyday. Southern conscious rap with red-clay roots."),
    "Art Pepper": ("\U0001F3B7", "West Coast alto. Prison, heroin, then Straight Life. Ferocious lyricism."),
    "Arthur “Big Boy” Crudup": ("\U0001F3B8", "That's All Right. Elvis covered him. Mississippi Delta blues' uncredited progenitor."),
    "Artie Shaw": ("\U0001F3B7", "Begin the Beguine. Big band leader who walked away at the top, again and again."),
    "Arturo Sandoval": ("\U0001F3BA", "Cuban virtuoso. Dizzy's protégé. Seven octaves on a trumpet."),
    "Ash": ("\U0001F3B8", "1977. Northern Irish power-pop. Kung Fu, Star Wars obsession, perfect singles."),
    "Astrud Gilberto": ("\U0001F338", "That voice on Girl from Ipanema. Untrained, unforgettable, accidental."),
    "ATB": ("\U0001F6E4️", "9 PM (Till I Come). German trance with the most identifiable guitar bend in dance music."),
    "Augustus Pablo": ("\U0001F3B6", "King Tubbys Meets Rockers Uptown. Melodica master. Dub's quietest innovator."),
    "Avicii": ("\U0001F305", "Wake Me Up. Levels. Tim Bergling. Festival EDM's brightest, briefest star."),
    "Ayreon": ("\U0001F680", "Arjen Lucassen's prog-metal space opera. Different vocalist every track."),
    "a‐ha": ("❄️", "Take On Me. That falsetto, that pencil-sketch video. Norway's eternal export."),
    "Baden Powell": ("\U0001F3B8", "Brazilian guitar virtuoso. Afro-Sambas. Bossa filtered through Bach."),
    "Barbra Streisand": ("\U0001F3AC", "People. The Way We Were. Voice and presence too big for any single medium."),
    "Barry White": ("\U0001F3A4", "Can't Get Enough of Your Love. Bass voice, satin sheets. Nothing subtle, ever."),
    "Basement Jaxx": ("\U0001F3E0", "Where's Your Head At. Brixton house duo who made dance maximalist."),
    "Beck": ("\U0001F300", "Loser. Odelay. Sea Change. Reinvents every album, lands every time."),
    "Behemoth": ("\U0001F410", "Polish blackened death metal. Nergal's theater of blasphemy."),
    "Benny Goodman": ("\U0001F3B7", "King of Swing. Carnegie Hall 1938. Integrated his band before it was safe."),
    "Biffy Clyro": ("\U0001F3F4\U000E0067\U000E0062\U000E0073\U000E0063\U000E0074\U000E007F", "Mountains. Scottish rock trio. Stadium choruses with prog underbelly."),
    "Big Bill Broonzy": ("\U0001F3B8", "Chicago blues bridge. Key to the Highway. Folk revival's link to the Delta."),
    "Big Daddy Kane": ("\U0001F451", "Smooth Operator. Brooklyn lyricist whose flow rewrote what was possible."),
    "Bill Evans": ("\U0001F3B9", "Sunday at the Village Vanguard. Voicings that changed jazz piano forever."),
    "Bill Frisell": ("\U0001F3B8", "Americana through a fog of effects. Nashville. Country jazz that floats."),
    "Bill Haley and His Comets": ("\U0001F550", "Rock Around the Clock. The opening salvo of rock and roll itself."),
    "Bill Withers": ("\U0001F305", "Lean on Me. Ain't No Sunshine. Working-man soul. Then he just stopped."),
    "Billie Holiday": ("\U0001F339", "Strange Fruit. Lady Day. Phrasing that made every word into mourning."),
}

with CSV_PATH.open("r", encoding="utf-8-sig", newline="") as f:
    rows = list(csv.reader(f))

header = rows[0]
name_idx = header.index("name")
icon_idx = header.index("icon")
desc_idx = header.index("description")
confirmed_idx = header.index("confirmed")
drafted_idx = header.index("drafted")

updated = 0
missing = []
for name, (icon, desc) in UPDATES.items():
    found = False
    for row in rows[1:]:
        if row[name_idx] == name:
            row[icon_idx] = icon
            row[desc_idx] = desc
            row[confirmed_idx] = "yes"
            row[drafted_idx] = "yes"
            updated += 1
            found = True
            break
    if not found:
        missing.append(name)

content = "\xef\xbb\xbf"
import io
buf = io.StringIO()
csv.writer(buf, lineterminator="\r\n").writerows(rows)
CSV_PATH.write_bytes(b"\xef\xbb\xbf" + buf.getvalue().encode("utf-8"))

print(f"Updated {updated} rows")
if missing:
    print(f"MISSING: {missing}")
