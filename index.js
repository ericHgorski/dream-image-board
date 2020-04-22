const express = require("express");
const db = require("./db");
const app = express();

app.use(express.static("./public"));

app.get("/images", (req, res) => {
    db.getImages()
        .then((result) => res.json(result))
        .catch((err) => {
            console.log("Error in db.getBasicImageInfo: ", err);
        });
});

app.listen(8080, () => console.log("IB server is listening..."));
