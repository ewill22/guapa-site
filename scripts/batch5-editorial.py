"""Batch 5: 2Pac, Aaliyah, ABBA, Aerosmith, Al Green"""
import csv
from pathlib import Path

ARTIST_CSV = Path('public/data/artist-editorial.csv')
ALBUM_CSV  = Path('public/data/album-editorial.csv')

ARTISTS = {
    '2Pac':      ('👑', 'All Eyez on Me. Me Against the World. Dear Mama. Shot twice, survived, made better music. Then gone at 25.', ''),
    'Aaliyah':   ('🕊️', 'Age Ain\'t Nothing but a Number at 15. One in a Million redefined R&B. Try Again. Gone at 22. The blueprint nobody fully copied.', ''),
    'ABBA':      ('✨', 'Waterloo. Dancing Queen. Mamma Mia. Four Swedes in sequins who wrote the greatest pop songs ever made. Voyage proved they still could.', ''),
    'Aerosmith': ('🎸', 'Dream On. Walk This Way. Toys in the Attic. Pump. Boston bad boys who survived everything including themselves.', ''),
    'Al Green':  ('🌹', 'Let\'s Stay Together. Tired of Being Alone. Take Me to the River. The most sensual voice in soul music. Then he found God and made gospel.', 'My father never had to compete w Al Green, Marvin Gaye & them dudes like we gotta do w Trey & them — Joe Budden (truth)'),
}

ALBUMS = [
    # 2Pac
    ('2Pac', 'Me Against the World', 1995, 'Dear Mama. So Many Tears. Recorded while awaiting prison. His most vulnerable and his best.'),
    ('2Pac', 'All Eyez on Me', 1996, 'California Love. How Do U Want It. Double album, 27 tracks, released months before his death. Ambition as legacy.'),
    ('2Pac', '2Pacalypse Now', 1991, 'Brenda\'s Got a Baby. Trapped. A 20-year-old from Marin City already writing about poverty and police violence.'),
    ('2Pac', 'Strictly 4 My N.I.G.G.A.Z...', 1993, 'Keep Ya Head Up. I Get Around. The range — tenderness and aggression on the same album.'),

    # Aaliyah
    ('Aaliyah', 'One in a Million', 1996, 'If Your Girl Only Knew. One in a Million. Timbaland and Missy Elliott production. The template for 2000s R&B.'),
    ('Aaliyah', 'Aaliyah', 2001, 'Try Again. More Than a Woman. Rock the Boat. Released two months before the plane crash. Her most complete work.'),
    ('Aaliyah', 'Age Ain\'t Nothing but a Number', 1994, 'Back & Forth. The title track. R. Kelly produced it. She was 15. The voice was already fully formed.'),

    # ABBA
    ('ABBA', 'Arrival', 1976, 'Dancing Queen. Money Money Money. Fernando. Sweden\'s greatest cultural export at its peak. Perfect pop architecture.'),
    ('ABBA', 'Waterloo', 1974, 'The title track won Eurovision and changed everything. Honey Honey. Ring Ring. Four people becoming one machine.'),
    ('ABBA', 'Super Trouper', 1980, 'The Winner Takes It All is a real breakup song written about a real breakup. Agnetha and Björn had just divorced. It shows.'),
    ('ABBA', 'Voyage', 2021, 'I Still Have Faith in You. Don\'t Shut Me Down. 40 years later. Digital avatars, but the songwriting is real.'),

    # Aerosmith
    ('Aerosmith', 'Toys in the Attic', 1975, 'Walk This Way. Sweet Emotion. Toys in the Attic. The album that made them legends before the drugs almost erased it.'),
    ('Aerosmith', 'Pump', 1989, 'Love in an Elevator. Janie\'s Got a Gun. F.I.N.E. The clean comeback hit harder than the original.'),
    ('Aerosmith', 'Rocks', 1976, 'Back in the Saddle. Last Child. Combination. Their darkest and their heaviest. The critics ignored it. Wrong.'),
    ('Aerosmith', 'Permanent Vacation', 1987, 'Dude Looks Like a Lady. Angel. Rag Doll. The MTV era arrival. Slick but they earned it.'),

    # Al Green
    ('Al Green', 'Let\'s Stay Together', 1972, 'The title track is the greatest soul single ever recorded. L-O-V-E. Look What You Done for Me. Willie Mitchell production. Perfection.'),
    ('Al Green', 'I\'m Still in Love With You', 1972, 'I\'m Still in Love With You. Simply Beautiful. Call Me. Two masterpieces in one year. He was 26.'),
    ('Al Green', 'Call Me', 1973, 'Call Me. Here I Am. You Ought to Be with Me. The third classic album in a row. Nobody was doing it like this.'),
    ('Al Green', 'The Belle Album', 1977, 'Belle. Georgia Boy. The gospel turn begins. He produced it himself. Different from everything before it, still essential.'),
]

def main():
    # Update artist CSV
    rows, fields = [], None
    with open(ARTIST_CSV, encoding='utf-8-sig', newline='') as f:
        reader = csv.DictReader(f)
        fields = list(reader.fieldnames)
        rows = list(reader)

    updated = 0
    for row in rows:
        if row['name'] in ARTISTS and row['confirmed'] != 'yes':
            icon, desc, eric_take = ARTISTS[row['name']]
            row['confirmed'] = 'yes'
            row['icon'] = icon
            row['description'] = desc
            row['drafted'] = 'yes'
            if eric_take:
                row['eric_take'] = eric_take
            updated += 1

    with open(ARTIST_CSV, 'w', encoding='utf-8', newline='') as f:
        writer = csv.DictWriter(f, fieldnames=fields)
        writer.writeheader()
        writer.writerows(rows)
    print(f'Updated {updated} artists')

    # Append albums
    with open(ALBUM_CSV, 'a', encoding='utf-8', newline='') as f:
        writer = csv.writer(f)
        for artist, title, year, desc in ALBUMS:
            writer.writerow([artist, title, year, desc])
    print(f'Appended {len(ALBUMS)} album descriptions')

if __name__ == '__main__':
    main()
