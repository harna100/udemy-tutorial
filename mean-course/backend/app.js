const express = require('express');
const bodyParser = require('body-parser');
const db = require('../db');

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

app.post('/api/posts', (req, res, next) => {
    const post = req.body;
    console.log(req.body);
    db.addPost(req.body, function(results) {
        console.log(results);
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
    })
    

});

app.get('/api/posts', (req, res, next) => {
    const posts = [
        {id: 'dfsiugnbsdfn',
         title: 'Server Post',
         content: 'Server content'
        },
        {id: 'dfgsoindfglk',
        title: 'Server Post',
        content: 'Server content'
       },
    ];
    res.status(200).json({
        message: 'Posts fetched successfully',
        posts: posts
    });
});

module.exports = app;