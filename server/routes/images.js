const express = require('express');

const fs = require('fs');
const path = require('path');

const { authenticTokenImg } = require('../middlewares/authentication');

const app = express();

app.get('/image/:type/:img', authenticTokenImg, (req, res) => {

    let type = req.params.type;
    let img = req.params.img;

    let pathImage = path.resolve(__dirname, `../../uploads/${type}/${img}`);

    if (fs.existsSync(pathImage)) {
        res.sendFile(pathImage);
    } else {
        noImagePath = path.resolve(__dirname, '../assets/NotFound.png');

        res.sendFile(noImagePath);
    }
});

module.exports = app;