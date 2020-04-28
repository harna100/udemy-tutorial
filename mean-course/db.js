var mariadb = require('mariadb');


exports.MODE_TEST = 'mode_test';
exports.MODE_PRODUCTION = 'mode_production';

var state = {
    pool: null,
    mode: null
};

exports.connect = function (mode, done) {
    // state.pool = mariadb.createPool({
    //     socketPath: '/var/run/mysqld/mysqld.sock',
    //     user: 'root',
    //     password: '1234',
    //     database: 'meancourse'
    // });

    state.pool = mariadb.createPool({
        user: 'capstone',
        password: '1234',
        database: 'udemy_mean'
    });

    state.mode = mode;
    done();
};

exports.get = function () {
    return state.pool;
};

exports.getUsers = function (successCb, errCb) {
    var sql = "SELECT * FROM users;";
    this.get().query(sql).then(successCb).catch(errCb);
};

exports.getUser = function (user_id, successCb, errCb) {
    console.log("User id: " + user_id)
    var sql = "SELECT * FROM users where user_id=?;";
    this.get()
        .query(sql, [user_id])
        .then(successCb)
        .catch(errCb);
}

exports.addPost = function (postToInsert, successCb, errCb) {
    var sql = "INSERT INTO posts(title, content, user_post_id) values(:title,:content,:userId);";

    this.get()
        .query(
            {namedPlaceholders: true, sql:sql},
            postToInsert
        )
        .then(successCb)
        .catch(errCb);
};

exports.createUser = function(discordId, discordUsername, discordRefresh, discordAccess, successCb, errCb) {
    var sql = "INSERT INTO users(discord_id, username, discord_refresh, discord_access) VALUES(?,?,?,?);";

    this.get()
        .query(sql, [discordId, discordUsername, discordRefresh, discordAccess])
        .then(function (results) {
            console.log("create user");
            console.log(results);
            results.user_id = results.insertId;
            console.log(results);
            successCb(results)
        })
        .catch(function(err) {
            err.createuser = true;
            errCb(err);
        })
};

exports.loginUser = function(userId, discordId, discordUsername, discordRefresh, discordAccess, successCb, errCb) {
    var sql = "UPDATE users set discord_id=?, username=?, discord_refresh=?, discord_access=? WHERE user_id=?;";

    this.get()
    .query(sql, [discordId, discordUsername, discordRefresh, discordAccess, userId])
    .then(function(results) {
        console.log("Updated: " + JSON.stringify(results));
        module.exports.getUser(userId, function(results) {
            console.log("login user");
            console.log(results);
            results = results[0];
            console.log(results);
            successCb(results);
        }, errCb);
    })
    .catch(function(err) {
        err.loginuser = true;
        errCb(err);
    })
};

exports.checkUser = function(discordId, discordUsername, discordRefresh, discordAccess, successCb, errCb) {
    var sql = "SELECT * FROM users WHERE discord_id=?;";

    this.get()
        .query(sql, [discordId])
        .then(function(results) {
            console.log("Checked users: " + results.length)
            if (results[0] === undefined) {
                console.log("No user");
                module.exports.createUser(discordId, discordUsername, discordRefresh, discordAccess, successCb, errCb);
            }
            else {
                console.log("Found user");
                console.log(results[0])
                module.exports.loginUser(results[0].user_id, discordId, discordUsername, discordRefresh, discordAccess, successCb, errCb);
            }
        })
        .catch(function(err) {
            err.checkUser = true;
            errCb(err);
        })
};

exports.getAllPosts = function (successCb, errCb) {
    var sql = "SELECT * FROM posts;";

    this.get()
        .query(
            {sql: sql}
        )
        .then(successCb)
        .catch(errCb);
}

exports.deletePost = function (idToDelete, userId, successCb, errCb) {
    var sql = "DELETE FROM posts WHERE post_id = ? AND user_post_id = ?;";
    this.get()
        .query(
            sql,
            [idToDelete, userId]
        )
        .then(successCb)
        .catch(errCb);
}
