const express = require('express');
const db = require('../db');
const http = require('http');
const jwt = require('jsonwebtoken');

const fetch = require('node-fetch');
const btoa = require('btoa');
const { catchAsync } = require('../utils');



const router = express.Router();

const CLIENT_ID = '';
const CLIENT_SECRET = '';
const redirect = encodeURIComponent('http://192.168.4.223/api/discord/callback');
const jwt_secret = 'supersecretsecret';

//login page
router.get('/login', (req, res) => {
    res.query = ''
    res.redirect(`https://discordapp.com/api/oauth2/authorize?client_id=${CLIENT_ID}&redirect_uri=${redirect}&response_type=code&scope=identify%20guilds%20email`);
});

router.get('/callback', catchAsync(async (req, res, next) => {
    if (!req.query.code) throw new Error('NoCodeProvided');
    const code = req.query.code;
    console.log(code);

    const creds = btoa(`${CLIENT_ID}:${CLIENT_SECRET}`);
    const response = await fetch(`https://discordapp.com/api/oauth2/token?grant_type=authorization_code&code=${code}&redirect_uri=${redirect}`,
    {
      method: 'POST',
      headers: {
        Authorization: `Basic ${creds}`,
      },
    });
    const json = await response.json();
    const access_token = json.access_token;
    const refresh_token = json.refresh_token;


    const user = await fetch('http://discordapp.com/api/users/@me',
    {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
    });


    const userData = await user.json();
    const username = userData.username;
    const id = userData.id;

    
    db.checkUser(id, username, access_token, refresh_token, function(results) {
        
        const jwt_expires = 3600;

        const userJwt = jwt.sign({id: results[0].user_id}, jwt_secret, {
            algorithm: 'HS256',
            expiresIn: jwt_expires
        });

        res.redirect(`/jwt/${userJwt}`);
        
        // res.status(200).json({
        //     "title": "success",
        //     "message": json,
        //     "jwt": userJwt,
        // });

    }, function(err) {
        res.status(500).json({
            "err": err
        })
    });


    
}));




//callback after login page
// router.get('/callback', catchAsync(async (req, res) => {
//     if (!req.query.code) throw new Error('NoCodeProvided');
//     const code = req.query.code;
//     const creds = btoa(`${CLIENT_ID}:${CLIENT_SECRET}`);
//     const response = await fetch(`https://discordapp.com/api/oauth2/token?grant_type=authorization_code&code=${code}&redirect_uri=${redirect}`,
//         {
//             method: 'POST',
//             headers: {
//                 Authorization: `Basic ${creds}`,
//             },
//         });
//     const json = await response.json();
//     const TOKEN = json.access_token;
//     userTOKEN = TOKEN;
//     const user = await fetch('http://discordapp.com/api/users/@me',
//         {
//             method: 'GET',
//             headers: {
//                 Authorization: `Bearer ${TOKEN}`,
//             },
//         });


//     const userData = await user.json();
//     const username = userData.username;
//     const id = userData.id;

//     const jwt_key = 'softwareengineeringismymajorandwegraduateinmay';
//     const jwt_expires = 3600;

//     const json_token = jwt.sign({ username: username, id: id, token: TOKEN }, jwt_key, {
//         algorithm: 'HS256',
//         expiresIn: jwt_expires
//     });
//     // console.log(json_token);
//     const createUserData = {
//         username: username,
//         json_token: json_token,
//         expiresIn: 3600
//     }
//     databaseRecords.createUser(id, username, TOKEN, function (results) {
//         console.log("success")
//         res.redirect('/?token=' + JSON.stringify(createUserData)); //jwt=hsdb kvjh,sbdfi
//     }, function (err) {
//         if (err) {
//             return res.status(500).json(err);
//         }
//         else {
//         }
//     });

// }));



module.exports = router;
