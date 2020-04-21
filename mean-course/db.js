var mariadb = require('mariadb');


exports.MODE_TEST = 'mode_test';
exports.MODE_PRODUCTION = 'mode_production';

var state = {
    pool: null,
    mode: null
};

exports.connect = function (mode, done) {
    state.pool = mariadb.createPool({
        socketPath: '/var/run/mysqld/mysqld.sock',
        user: 'root',
        password: '1234',
        database: 'meancourse'
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
        .then(successCb)
        .catch(errCb)
};

exports.loginUser = function(userId, discordId, discordUsername, discordRefresh, discordAccess, successCb, errCb) {
    var sql = "UPDATE users set discord_id=?, username=?, discord_refresh=?, discord_access=? WHERE user_id=?;";

    this.get()
    .query(sql, [discordId, discordUsername, discordRefresh, discordAccess, userId])
    .then(function(results) {
        console.log("Updated: " + JSON.stringify(results));
        module.exports.getUser(userId, successCb, errCb);
    })
    .catch(errCb)
};

exports.checkUser = function(discordId, discordUsername, discordRefresh, discordAccess, successCb, errCb) {
    var sql = "SELECT * FROM users WHERE discord_id=?;";

    this.get()
        .query(sql, [discordId])
        .then(function(results) {
            // console.log(results[0]);
            if (results[0] === undefined) {
                module.exports.createUser(discordId, discordUsername, discordRefresh, discordAccess, successCb, errCb);
            }
            else {
                console.log(results[0])
                module.exports.loginUser(results[0].user_id, discordId, discordUsername, discordRefresh, discordAccess, successCb, errCb);
            }
        })
        .catch(errCb)
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
