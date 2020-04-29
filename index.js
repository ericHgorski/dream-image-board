const express = require("express");
const db = require("./db");
const app = express();
const s3 = require("./s3");
const { s3Url } = require("./config.json");

app.use(express.static("./public")); // serve static files in public folder.
app.use(express.json()); // parsing body of requests.

//------------------ IMAGE UPLOAD BOILERPLATE-------------------//
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
        fileSize: 5097152,
    },
});

//--------------------- IMAGE RENDERING AND UPLOADING --------------//

// Get all images upon page load.
app.get("/images", (req, res) => {
    db.getImages()
        .then((result) => {
            res.json(result);
            console.log("result :>> ", result);
        })
        .catch((err) => {
            console.log("Error in db.getImage: ", err);
        });
});

// Get more images starting using id of last image as a reference point
app.get("/get-more-images/:lastImageId", (req, res) => {
    // If not the first image to be uploaded then get more images through infinite scroll
    db.getMoreImages(req.params.lastImageId)
        .then((result) => res.json(result))
        .catch((err) => {
            console.log("Error in db.getMoreImages: ", err);
        });
});

// POST REQUEST FOR NEW IMAGE UPLOAD.
app.post("/upload", uploader.single("file"), s3.upload, (req, res) => {
    req.body.url = `${s3Url}${req.file.filename}`;
    const { url, username, title, description } = req.body;
    if (req.file) {
        db.addNewImage(url, username, title, description);
        res.json(req.body);
    } else {
        // If no file is found upon request.
        res.sendStatus(500);
    }
});

//--------------------- MODAL RENDERING AND COMMENT FUNCTIONALITY --------------//

//GET IMAGE WITH CORRESPONDING ID.
app.get("/image/:imageId", (req, res) => {
    db.getImageInfo(req.params.imageId).then(({ rows }) => {
        console.log("getImageInfo db get request: ", rows[0]);
        res.json(rows[0]);
    });
});

//GET COMMENTS ASSOCIATED WITH GIVEN IMAGE ID.
app.get("/get-comments/:imageId", (req, res) => {
    db.getImageComments(req.params.imageId).then((result) => {
        console.log("result :>> ", result);
        res.json(result.rows);
    });
});

//POST NEW COMMENT ON GIVEN IMAGE.
app.post("/post-new-comment/:id", (req, res) => {
    let { comment, commenter } = req.body;
    db.addNewComment(comment, commenter, req.params.id)
        .then(({ rows }) => {
            res.json(rows);
        })
        .catch((err) => {
            console.log("error in postComment", err);
        });
});

app.listen(process.env.PORT || 8080, () => console.log("Image board ready for business on 8080..."));
