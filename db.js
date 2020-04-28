const spicedPg = require("spiced-pg");
var db = spicedPg(process.env.DATABASE_URL || "postgres:postgres:postgres@localhost:5432/imageboard");

// RETRIEVE IMAGES ON PAGE LOAD
module.exports.getImages = () => {
    return db
        .query(
            `
    SELECT * FROM images 
    ORDER BY id DESC
    LIMIT 1`
        )
        .then(({ rows }) => rows);
};

// RETRIEVE NEXT BATCH OF IMAGE WHEN SCROLL IS AT BOTTOM OF PAGE

module.exports.getMoreImages = (lastId) => {
    return db
        .query(
            `
        SELECT * FROM images
        WHERE id < $1
        ORDER BY id DESC
        LIMIT 1`,
            [lastId]
        )
        .then(({ rows }) => rows[0]);
};

//ADD A NEW IMAGE
module.exports.addNewImage = (url, username, title, description) => {
    return db.query(
        `
    INSERT INTO images (url, username, title, description)
    VALUES ($1, $2, $3, $4) 
    RETURNING created_at;`,
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
    return db.query(
        `
    SELECT * FROM comments WHERE img_id = $1
    ORDER BY id DESC`,
        [id]
    );
};

//ADD NEW COMMENT
module.exports.addNewComment = (comment, commenter, img_id) => {
    return db.query(
        `
    INSERT INTO comments (comment, commenter, img_id)
    VALUES ($1, $2, $3)
    RETURNING *`,
        [comment, commenter, img_id]
    );
};
