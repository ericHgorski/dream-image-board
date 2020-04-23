const express = require("express");
const db = require("./db");
const app = express();
const s3 = require("./s3");
const { s3Url } = require("./config.json");

app.use(express.static("./public"));

// IMAGE UPLOAD BOILERPLATE
const multer = require("multer");
const uidSafe = require("uid-safe");
const path = require("path");

const diskStorage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, __dirname + "/uploads");
    },
    filename: function (req, file, callback) {
        uidSafe(24).then(function (uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    },
});

const uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152,
    },
});

app.get("/images", (req, res) => {
    db.getImages()
        .then((result) => res.json(result))
        .catch((err) => {
            console.log("Error in db.getImage: ", err);
        });
});

app.post("/upload", uploader.single("file"), s3.upload, (req, res) => {
    req.body.url = `${s3Url}${req.file.filename}`;
    const { url, username, title, description } = req.body;
    if (req.file) {
        db.addNewImage(url, username, title, description);
        res.json(req.body);
    } else {
        res.sendStatus(500);
    }
});

app.listen(8080, () => console.log("Image board ready for business..."));
