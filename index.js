const express = require("express");
const db = require("./db");
const app = express();
const s3 = require("./s3");
const { s3Url } = require("./config.json");

app.use(express.static("./public"));
app.use(express.json());

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

// GET ALL IMAGES WHEN PAGE IS LOADED
app.get("/images", (req, res) => {
    db.getImages()
        .then((result) => res.json(result))
        .catch((err) => {
            console.log("Error in db.getImage: ", err);
        });
});

// POST REQUEST FOR NEW IMAGE UPLOAD
app.post("/upload", uploader.single("file"), s3.upload, (req, res) => {
    req.body.url = `${s3Url}${req.file.filename}`;
    const { url, username, title, description } = req.body;
    if (req.file) {
        db.addNewImage(url, username, title, description);
        res.json(req.body);
    } else {
        res.sendStatus(500);
        console.log("no file found in request");
    }
});

//GET IMAGE WITH CORRESPONDING ID
app.get("/image/:imageId", (req, res) => {
    console.log("req.params.imageId :>> ", req.params.imageId);
    db.getImageInfo(req.params.imageId).then(({ rows }) => {
        console.log("getImageInfo db get request: ", rows[0]);
        res.json(rows[0]);
    });
});

app.listen(8080, () => console.log("Image board ready for business on 8080..."));
