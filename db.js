const spicedPg = require("spiced-pg");
var db = spicedPg(process.env.DATABASE_URL || "postgres:postgres:postgres@localhost:5432/imageboard");

// RETRIEVE IMAGES
module.exports.getImages = () => {
    return db.query(`SELECT * FROM images`).then(({ rows }) => rows.reverse());
};

//ADD A NEW IMAGE
module.exports.addNewImage = (url, username, title, description) => {
    return db.query(
        `
    INSERT INTO images (url, username, title, description)
    VALUES ($1, $2, $3, $4) RETURNING created_at;`,
        [url, username, title, description]
    );
};

// GET INFO PERTAINING TO SELECTED IMAGE
module.exports.getImageInfo = (id) => {
    return db.query(`
    SELECT * FROM images WHERE id = ${id}`);
};

// GET ALL COMMENTS FOR IMAGE
module.exports.getImageComments = (id) => {
    return db.query(`
    SELECT * FROM comments WHERE img_id = ${id}`);
};

//ADD NEW COMMENT
module.exports.addNewComment = (comment, username, img_id) => {
    return db.query(
        `
    INSERT INTO comments (comment, username, img_id)
    VALUES ($1, $2, $3)
    RETURNING *`,
        [comment, username, img_id]
    );
};
