const express = require('express');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload')
const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileUpload({
    limits: { fileSize: 10 * 1024 * 1024 },
}));

app.use(express.static('public'));

const sqlite3 = require('sqlite3').verbose()
const db = new sqlite3.Database("db.db")

db.serialize(() => {
    db.run("CREATE TABLE IF NOT EXISTS cards (id INTEGER NOT NULL PRIMARY KEY, name TEXT, model BLOB, marker BLOB);");

    db.each("SELECT rowid AS id, name FROM cards", (err, row) => {
        console.log(row);
    });
})

app.post('/api/models', (req, res) => {
    console.log("Received", req.files);
    res.status(200).end()
});

app.put('/api/cards/:id', (req, res) => {
    if (!req.files) {
        // Only update textual fields
        const name = req.body.name;
        db.run(
            "UPDATE cards SET name = (?) WHERE rowid = (?);",
            name,
            req.params.id,
            function(err) {
                if (err) {
                    res.status(500).end("Failed to update card", err);
                } else {
                    res.status(200).end();
                }
            });
        return;
    }
    const model = req.files.model;
    const marker = req.files.marker;
    const name = req.body.name;

    if (model.mimetype !== 'model/gltf+json') {
        res.status(500).end("Invalid model mime type");
        return;
    }

    db.run(
        "UPDATE cards SET name = (?), model = (?), marker = (?) WHERE rowid = (?);",
        name,
        model.data,
        marker.data,
        req.params.id,
        function(err) {
            if (err) {
                res.status(500).end("Failed to update card", err);
            } else {
                res.status(200).end();
            }
        });
});

app.get('/api/cards', (req, res) => {
    db.all("SELECT (name, model) FROM cards", function(err, cards) {
        if (err) {
            res.status(500).end("Unable to get cards from database", err);
        } else {
            res.json(cards);
        }
    });
});

app.post('/api/cards', (req, res) => {
    db.run("INSERT INTO cards (name) VALUES (?)", null, function(err) {
        if (err) {
            res.status(500).end("Unable to insert card into database", err);
        } else {
            res.json({
                id: this.lastID
            });
        }
    });
})

app.listen(port, () => console.log(`Listening on port ${port}`));