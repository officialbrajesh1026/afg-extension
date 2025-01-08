require('dotenv').config();

const express = require('express');
const cors = require('cors'); // Cors-Modul
const sqlite3 = require('sqlite3').verbose();

const app = express();
const port = process.env.port || 3000;

app.use(cors()); // CORS aktivieren

// Verbindung zur SQLite-Datenbank
const db = new sqlite3.Database('links.db');

// API-Endpoint: Überprüfen, ob ein Link existiert
app.get('/check-link', (req, res) => {
  console.log("Request received:", req.query);
  const url = req.query.domain;

  // Extract the base domain from the URL
  const baseDomain = new URL(url).origin; // Get the base URL (e.g., https://www.amazon.com)

  db.get('SELECT redirectUrl FROM redirect_links WHERE domain LIKE ?', [`${baseDomain}%`], (err, row) => {
    if (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    } else if (row) {
      console.log("Link found:", row.redirectUrl);
      res.json({ linkFound: true, redirectLink: row.redirectUrl });
    } else {
      console.log("No link found");
      res.json({ linkFound: false });
    }
  });
});

// Server starten
app.listen(port, () => {
  console.log(`Server läuft auf http://localhost:${port}`);
});
