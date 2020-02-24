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
}

exports.addPost = function (postToInsert, successCb, errCb) {
    var sql = "INSERT INTO posts(title, content) values(:title,:content);";

    this.get()
        .query(
            {namedPlaceholders: true, sql:sql},
            postToInsert
        )
        .then(successCb)
        .catch(errCb);

}