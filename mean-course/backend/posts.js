const express = require('express');
const db = require('../db');
const jwt = require('jsonwebtoken');


const router = express.Router();


router.get('/', (req, res, next) => {
    db.getAllPosts(function (results) {
        results.forEach(post => {
            post.id = post.post_id.toString();
            delete post.post_id;
            post.userId = post.user_post_id.toString();
            delete post.user_post_id;
        });

        res.status(200).json({
            message: 'Posts fetched successfully',
            posts: results
        });
    }, function (err) {
        res.status(500).json({
            title: "Err"
        })
    });
});


/* Endpoints after this comment require jwt */
router.use('/action/', (req, res, next) => {
    var authHeader = req.header('Authorization');

    if (!authHeader) {
        res.status(403).json({
            title: "No Auth Token",
            message: 'Did not provide an auth header'
        })
    }

    var token = authHeader;

    jwt.verify(token, 'supersecretsecret', function (err, decoded) {
        if (err) {
            return res.status(401).json({
                title: 'Not authenticated',
                error: err,
                message: err.message
            });
        }
        req.decoded = decoded;
        next();
    });
});

router.post('/action/create', (req, res, next) => {
    console.log(req.decoded);
    var post = req.body;
    post.userId = req.decoded.id
    console.log("req body: " + JSON.stringify(post));
    db.addPost(post, function(results) {
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
            err: err
        });
    });
});

router.delete('/action/delete', (req, res, next) => {
    const idToDelete = req.body.id;
    console.log(req.body);
    db.deletePost(idToDelete, req.decoded.id, function(results) {
        if (results.affectedRows == 1) {
            res.status(200).json({
                message: "Successfully deleted",
                results: results
            });
        }
        else if (results.affectedRows == 0) {
            res.status(403).json({
                title: "Fail to delete",
                message: "User id not allowed to delete post"
            })
        }
        else if (results.affectedRows > 1) {
            console.log('Deleted ' + results.affectedRows +' rows: ' + JSON.stringify(req))
            res.status(500).json({
                title: "Deleted more than 1 row",
                message: "Deleted more than one row somehow"
            })
        }
    }, function(err) {
        console.error(err);
        res.status(500).json({
            message: "Failed",
            err:err
        });
    });
});

router.put('/action/edit', (req, res, next) => {
    // don't use the user id in post, could be edited by user.
    // Instead use id in the decoded jwt
    db.editPost(req.body.post, req.decoded.id, function(results) {
        if (results.affectedRows == 1) {
            res.status(200).json({
                message: "Successfully edited",
                results: results
            });
        }
        else if (results.affectedRows == 0) {
            res.status(403).json({
                title: "Fail to edit",
                message: "User id not allowed to edit post"
            })
        }
        else if (results.affectedRows > 1) {
            console.log('Edited ' + results.affectedRows +' rows: ' + JSON.stringify(req))
            res.status(500).json({
                title: "Edited more than 1 row",
                message: "Edited more than one row somehow"
            })
        }
    }, function(err) {
        console.error(err);
        res.status(500).json({
            message: "Failed",
            err:err
        });
    });
});

module.exports = router;
