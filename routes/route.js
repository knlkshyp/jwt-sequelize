const express = require('express');
const router = express.Router();
const db = require('../models');
const jwt = require('jsonwebtoken');
const { encrypt, decrypt} = require('../encdec');

router.get('/all', (request, response) => {
    db.user_detail.findAll({
        order: [
            ['create_date_time', 'ASC']
        ]
    })
    .then(userDetails => {
        for(let index = 0; index < userDetails.length; index++) {
            userDetails[index]['password'] = decrypt(userDetails[index]['password']);
        }
        response.status(200).send(userDetails)
    })
    .catch(error => response.json(error));
});

router.post('/add', (request, response) => {
    let users = request.body;
    db.user_detail.bulkCreate([
        {
            "username": users[0]['username'],
            "contact_number": users[0]['contact_number'],
            "password": encrypt(users[0]['password'])
        },
        {
            "username": users[1]['username'],
            "contact_number": users[1]['contact_number'],
            "password": encrypt(users[1]['password'])
        }
    ], { validate: true })
    .then((users) => response.status(200).send(users))
    .catch(error => response.json(error));
});

router.post('/login', (request, response) => {
    let loginUsername = request.body[0]['username'];
    let loginPassword = request.body[0]['password'];
    db.user_detail.findOne({ 
        where: { username: loginUsername } 
    })
    .then(userDetail => {
        let password = decrypt(userDetail.password);
        if(password === loginPassword) {
            let token = jwt.sign({
                username: userDetail.username,
                contact_number: userDetail.contact_number
            }, 'token', {
                expiresIn: '1hr'
            });
            response.status(200).json({
                bearerToken: token
            });
        }
    })
    .catch(error => response.json(error));
});

router.delete('/delete', (request, response) => {
    let usernamesToDelete = new Array();
    for(let index = 0; index < request.body.length; index++) {
        usernamesToDelete.push(request.body[index]['username']);
    }
    console.log(usernamesToDelete);
    db.user_detail.destroy({
        where: {
            username: usernamesToDelete
        }
    })
    .then(() => response.status(200).send())
    .catch(error => response.json(error));
});

module.exports = router;