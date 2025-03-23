const express = require('express')
const cors = require('cors')
const sqlite3 = require('sqlite3').verbose();
const app = express()
app.use(express.json());
app.use(cors())
const port = 3000
const generateUniqueId = require('generate-unique-id');

const db = new sqlite3.Database('./urls.db', (error) => {
    if (error) {
        console.log('Unable to create or read database');
    } else {
        db.run(
            `CREATE TABLE IF NOT EXISTS urls (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    shortId TEXT UNIQUE,
                    longUrl TEXT
                );`
        )
    }
});
// Implement a method to obtain long url and shorten it
app.post('/shorten', (req, res) => {
    // fetch the long url from the request object
    const body = req.body;
    // generate a short url and store long and short urls in the database
    const longUrl = req.body.longUrl;
    // Generate short url only if long url exists
    if (longUrl) {
        const shortId = generateUniqueId({
            length: 7
        });
        // Save shortId and longUrl in the table
        db.run(
            "INSERT INTO urls (shortId, longUrl) VALUES (?, ?)",
            [shortId, longUrl],
            function (error) {
                if (error) {
                    res.status(500).json({
                        error: "Database error"
                    })
                }
                res.json({shortUrl: 'http://localhost:3000/' + shortId})
            }
        )
    } else {
        res.send('Invalid input')
    }

})

app.get('/:shortId', (req, res) => {
    const params = req.params;
    const shortId = params.shortId;
    console.log(shortId)
    // Get the longUrl from the database and redirect to the longUrl
    db.get("SELECT longUrl FROM urls where shortId = ?", [shortId], (err, result) => {
        if (err) {
            console.log('Unable to fetch data')
        } else {
            if (result) {
                res.redirect(result.longUrl)
            }
        }
    })
})

app.get('/fetch/all', (req, res) => {
    console.log('Fetching all records');
    // Get all records from the database
    db.all("SELECT * FROM urls order by id desc", [], (err, results) => {
        if (err) {
            console.log('Unable to fetch data');
            res.status(500).json({ error: 'Unable to fetch data' });
        } else {
            if (results && results.length > 0) {
                res.json(results); // Sending all records as a JSON response
            } else {
                res.status(404).json({ message: 'No records found' });
            }
        }
    });
});


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})