const express = require('express');
const bodyParser = require('body-parser');
const db = require('../db');
const discord = require('./discord');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept'
    );
    res.setHeader(
        'Access-Control-Allow-Methods',
         "GET, POST, PATCH, DELETE, OPTIONS"
    );
    next();
})

app.use('/api/discord', discord);

app.post('/api/posts', (req, res, next) => {
    var post = req.body;
    console.log("req body: " + JSON.stringify(req.body));
    db.addPost(req.body, function(results) {
        console.log("results: " + JSON.stringify(results));
        post.id = results.insertId;
        res.status(201).json({
            message: "Success Posted",
            post: post,
            mdb:results
        });
    }, function(err) {
        res.status(500).json({
            message: "Failed",
            err:err
        });
    });
});

app.get('/api/posts', (req, res, next) => {
    db.getAllPosts(function (results) {
        results.forEach(post => {
            post.id = post.post_id.toString();
            delete post.post_id;
        });

        res.status(200).json({
            message: 'Posts fetched successfully',
            posts: results
        });
    });
});

app.delete('/api/posts', (req, res, next) => {
    const idToDelete = req.body.id;
    console.log(req.body);
    db.deletePost(idToDelete, function(results) {
        res.status(200).json({
            message: "Successfully deleted",
            results: results
        });
    }, function(err) {
        console.error(err);
        res.status(500).json({
            message: "Failed",
            err:err
        });
    });
});





/* Final middleware nothing goes after this */
app.use((err, req, res, next) => {
    switch (err.message) {
      case 'NoCodeProvided':
        return res.status(400).send({
          status: 'ERROR',
          error: err.message,
        });
      default:
        return res.status(500).send({
          status: 'ERROR',
          error: err.message,
        });
    }
});

module.exports = app;