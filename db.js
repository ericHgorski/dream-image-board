const spicedPg = require("spiced-pg");
var db = spicedPg(process.env.DATABASE_URL || "postgres:postgres:postgres@localhost:5432/imageboard");

// RETRIEVE IMAGES
module.exports.getImages = () => {
    return db.query(`SELECT * FROM images`).then(({ rows }) => rows);
};

module.exports.addNewImage = (url, username, title, description) => {
    return db.query(
        `
    INSERT INTO images (url, username, title, description)
    VALUES ($1, $2, $3, $4) RETURNING created_at;`,
        [url, username, title, description]
    );
};
// // INSERT NEW ACCOUNT REGISTRATION INFO AND RETURN ID.
// module.exports.addNewAccount = (first, last, email, password) => {
//     return db.query(
//         `INSERT INTO users (first, last, email, password)
//         VALUES ($1, $2, $3, $4) RETURNING id;`,
//         [first, last, email, password]
//     );
// };

// // GET THE SIGNATURE WITH A GIVEN USER_ID
// module.exports.getSignature = (id) => {
//     return db.query(`SELECT signature FROM signatures WHERE id=$1`, [id]).then(({ rows }) => rows[0].signature);
// };

// module.exports.checkSignature = (id) => {
//     return db.query(`SELECT id FROM signatures WHERE user_id = $1;`, [id]).then(({ rows }) => {
//         return rows[0].id;
//     });
// };
// // GET NUMBER OF SIGNERS FOR DISPLAY ON THANK-PAGE.
// module.exports.getCount = () => {
//     return db.query(`SELECT COUNT(*) FROM signatures`).then(({ rows }) => {
//         return rows[0].count;
//     });
// };

// // ADD USER PROFILE INFORMATION.
// module.exports.getProfile = (userId) => {
//     return db.query(
//         `SELECT users.first AS first, users.last AS last, users.email AS user_email, users.password AS user_password, user_profiles.age AS user_age, user_profiles.city AS user_city, user_profiles.url AS user_url FROM users LEFT JOIN user_profiles ON users.id = user_profiles.user_id WHERE users.id = $1;`,
//         [userId]
//     );
// };

// // module.exports.editProfileInfo = (user_id) => {
// //     return db.query(
// //         `
// //     SELECT users.id AS user_id, first, last, email, age, city, url
// //     FROM users
// //     LEFT JOIN user_profiles
// //     ON users.id = user_id
// //     WHERE user_id = $1`,
// //         [user_id]
// //     );
// // };

// // GET NAMES OF SIGNERS FOR DISPLAY ON SIGNERS PAGE.
// module.exports.getNames = () => {
//     return db
//         .query(
//             `
//         SELECT users.first AS first, users.last AS last, user_profiles.age AS age, user_profiles.city AS city, user_profiles.url AS url
//         FROM users
//         LEFT JOIN user_profiles
//         ON users.id = user_profiles.user_id
//         JOIN signatures
//         ON user_profiles.user_id = signatures.user_id;
//     `
//         )
//         .then(({ rows }) => {
//             console.log("rows :", rows);
//             return rows;
//         });
// };

// // RETRIEVE THE USER INFO.
// // module.exports.getUserInfo = () => {
// //     return db
// //         .query(
// //             `
// //         SELECT users.first AS first, users.last AS last, user_profiles.age AS age, user_profiles.city AS city, user_profiles.url AS url
// //         FROM users
// //         LEFT JOIN user_profiles
// //         ON users.id = user_profiles.user_id
// //         JOIN signatures
// //         ON user_profiles.user_id = signatures.user_id;
// //     `
// //         )
// //         .then(({ rows }) => {
// //             return rows;
// //         });
// // };

// // VERIFY LOGIN OF ACCOUNT.
// module.exports.verifyLogin = (email) => {
//     return db.query(`SELECT * FROM users WHERE email = $1;`, [email]);
// };

// // INSERT NEW ACCOUNT REGISTRATION INFO AND RETURN ID.
// module.exports.addNewAccount = (first, last, email, password) => {
//     return db.query(
//         `INSERT INTO users (first, last, email, password)
//         VALUES ($1, $2, $3, $4) RETURNING id;`,
//         [first, last, email, password]
//     );
// };

// // EDIT A USER PROFILE IF A NEW PASSWORD IS NOT CHOSEN.
// module.exports.editUserProfile = (age, city, url, user_id) => {
//     return db.query(`INSERT INTO user_profiles (age, city, url, user_id) VALUES($1, $2, $3, $4) ON conflict (user_id) DO UPDATE SET age=$1, city=$2, url=$3`, [
//         age,
//         city,
//         url,
//         user_id,
//     ]);
// };

// //  EDIT USER INFO IF A NEW PASSWORD IS CHOSEN.
// module.exports.editUserInfoPass = (first, last, email, hashedPassword, user_id) => {
//     return db.query(
//         `UPDATE users
//         SET first = $1, last =$2, email=$3, password=$4 WHERE id=$5`,
//         [first, last, email, hashedPassword, user_id]
//     );
// };

// // ADD USER PROFILE INFORMATION (AGE, CITY, AND WEBSITE).
// module.exports.addProfileInfo = (age, city, url, userID) => {
//     return db.query(
//         `INSERT INTO user_profiles
//         (age, city, url, user_id) VALUES ($1, $2, $3, $4);`,
//         [age, city, url, userID]
//     );
// };

// // EDIT THE USER INFORMATION (NAME AND EMAIL).
// module.exports.editUserInfo = (first, last, email, user_id) => {
//     return db.query(
//         `UPDATE users
//         SET first = $1, last =$2, email=$3 WHERE id=$4`,
//         [first, last, email, user_id]
//     );
// };

// // DELETE A SIGNATURE FROM THE DB.
// module.exports.deleteSignature = (user_id) => {
//     return db.query(`DELETE FROM signatures WHERE user_id = $1;`, [user_id]);
// };
