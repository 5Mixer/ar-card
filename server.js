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
    db.run(`CREATE TABLE IF NOT EXISTS cards
            (
                id INTEGER NOT NULL PRIMARY KEY,
                name TEXT, model BLOB,
                marker BLOB,
                pattern TEXT
            );`);

})

app.get('/api/model/:id', (req, res) => {
    db.get("SELECT model FROM cards WHERE rowid = (?)", req.params.id, function(err, result) {
        if (err) {
            res.sendStatus(500).end("Unable to get model from database", err);
        } else {
            res.send(result.model);
        }
    });
});

app.get('/api/marker/:id', (req, res) => {
    db.get("SELECT marker FROM cards WHERE rowid = (?)", req.params.id, function(err, result) {
        if (err) {
            res.sendStatus(500).end("Unable to get marker from database", err);
        } else {
	    if (result.marker) {
            res.setHeader('content-type', 'image/png');
            res.send(result.marker);
	    }else{
		    res.status(404).end();
	    }
        }
    });
});

app.get('/api/pattern/:id', (req, res) => {
    db.get("SELECT rowid AS id, pattern FROM cards WHERE rowid = (?)", req.params.id, function(err, result) {
        if (err) {
            res.status(500).end("Unable to get patterns from database", err);
        } else {
            res.send(result.pattern);
        }
    });
});

app.put('/api/cards/:id', (req, res) => {
    const model = req.files ? req.files.model : null;
    const marker = req.files ? req.files.marker : null;
    const name = req.body ? req.body.name : null;
    const pattern = req.body ? req.body.pattern : null

    if (model && model.mimetype !== 'model/gltf+json') {
        //res.status(500).end("Invalid model mime type");
        //return;
    }

    db.run(
        `UPDATE cards
        SET
            name = coalesce(?, name),
            model = coalesce(?, model),
            marker = coalesce(?, marker),
            pattern = coalesce(?, pattern)
        WHERE rowid = (?);`,
        name,
        model ? model.data : null,
        marker ? marker.data : null,
        pattern ? pattern : null,
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
    db.all("SELECT rowid AS id, name FROM cards", function(err, cards) {
        if (err) {
            res.status(500).end("Unable to get cards from database", err);
        } else {
            res.json(cards);
        }
    });
});

app.get('/api/valid-cards', (req, res) => {
    db.all("SELECT rowid AS id, name FROM cards WHERE model IS NOT NULL AND pattern IS NOT NULL", function(err, cards) {
        if (err) {
            res.status(500).end("Unable to get cards from database", err);
        } else {
            res.json(cards);
        }
    });
});

app.delete('/api/cards/:id', (req, res) => {
    db.run("DELETE FROM cards WHERE rowid=?", req.params.id, function(err) {
        if (err) {
            res.status(500).end("Unable to insert card into database", err);
        } else {
            res.json({
                id: this.lastID
            });
        }
    });
});

app.get('/api/cards/delete/:id', (req, res) => {
    db.run("DELETE FROM cards WHERE rowid=?", req.params.id, function(err) {
        if (err) {
            res.status(500).end("Unable to insert card into database", err);
        } else {
            res.json({
                id: this.lastID
            });
        }
    });
});

app.post('/api/cards', (req, res) => {
    db.run("INSERT INTO cards (name) VALUES (?)", null, function(err) {
        if (err) {
            res.status(500).end("Unable to insert card into database", err);
        } else {
	    res.status(200).end();
        }
    });
})

app.listen(port, () => console.log(`Listening on port ${port}`));
