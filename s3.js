const aws = require("aws-sdk");
const fs = require("fs");

let secrets;
if (process.env.NODE_ENV == "production") {
    secrets = process.env;
} else {
    secrets = require("./secrets");
}

const s3 = new aws.S3({
    accessKeyId: process.env.AWS_KEY || secrets.AWS_KEY,
    secretAccessKey: process.env.AWS_SECRET || secrets.AWS_SECRET,
});

exports.upload = (req, res, next) => {
    if (!req.file) {
        console.log("req.file isn't present");
        return res.sendStatus(500);
    }
    const { filename, mimetype, size, path } = req.file;

    const promise = s3
        .putObject({
            Bucket: "spicedling",
            ACL: "public-read",
            Key: filename,
            Body: fs.createReadStream(path),
            ContentType: mimetype,
            ContentLength: size,
        })
        .promise();

    promise
        .then(() => {
            console.log("Upload complete!");
            fs.unlink(path, () => {});
            next();
        })
        .catch((err) => {
            console.log("Error in upload put object in s3.js: ", err);
            res.sendStatus(500);
        });
};
