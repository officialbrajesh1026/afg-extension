import sqlite3

# Verbindung zur Datenbank herstellen
conn = sqlite3.connect('links.db')  # Erstellt 'links.db' im aktuellen Ordner
cursor = conn.cursor()

# Tabelle erstellen
cursor.execute('''
CREATE TABLE IF NOT EXISTS redirect_links (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    domain TEXT NOT NULL,
    redirectUrl TEXT NOT NULL
)
''')

# Daten einfügen
links = [
    ("https://www.amazon.com/", "https://dnb-websites.de/"),
    ("https://www.check24.net/", "https://dnb-websites.de/"),
    ("https://de.fiverr.com/", "https://dnb-websites.de/")
]
cursor.executemany('INSERT INTO redirect_links (domain, redirectUrl) VALUES (?, ?)', links)

# Änderungen speichern und Verbindung schließen
conn.commit()
conn.close()

print("Datenbank erfolgreich erstellt.")



