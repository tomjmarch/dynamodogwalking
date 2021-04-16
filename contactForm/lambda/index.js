'use strict';
const AWS = require("aws-sdk");
const axios = require('axios');

const returnUrl = "https://www.dynamodogwalking.com";

const reCapUrl = "https://www.google.com/recaptcha/api/siteverify";
const secretKey = process.env.RECAPTCHA_SECRET_KEY;

module.exports.handler = async (event, context, callback) => {
    console.log("Started processing...");

    const token = ''
    
    // verify the result by POSTing captcha to google
    let verifyCaptcha = await axios({
        method: 'post',
        url: reCapUrl,
        headers: {
            'Content-Type': 'application/json; charset=utf-8'
        },
        params: {
            secret: secretKey,
            response: token
        }
    })
    // print out the captcha (for testing)
     console.log("captcha result: " + JSON.stringify(verifyCaptcha.data));
    
    return true;
};