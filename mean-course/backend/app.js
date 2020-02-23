const express = require('express');

const app = express();

app.use('/api/posts', (req, res, next) => {
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