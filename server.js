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

app.post('/api/model', (req, res) => {
    console.log("Received", req.files);
    res.status(200).end()
})

app.listen(port, () => console.log(`Listening on port ${port}`));