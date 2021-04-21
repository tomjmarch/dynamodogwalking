'use strict';
const AWS = require("aws-sdk");
const axios = require('axios');

const reCapUrl = "https://www.google.com/recaptcha/api/siteverify";
const secretKey = process.env.RECAPTCHA_SECRET_KEY;
const snsTopic = process.env.SNS_TOPIC;
const response = {headers:{ 'Access-Control-Allow-Origin' : '*' }};

module.exports.handler = async (event, context, callback) => {
    const body = JSON.parse(event.body);
    
    // verify the result by POSTing captcha to google
    let verifyCaptcha = await axios({
        method: 'post',
        url: reCapUrl,
        headers: {
            'Content-Type': 'application/json; charset=utf-8'
        },
        params: {
            secret: secretKey,
            response: body.token
        }
    });
    const captchaResult = JSON.stringify(verifyCaptcha.data.success);
    
    if(captchaResult == 'true') {
        let sns = new AWS.SNS();
        let emailbody = "Someone filled in the contact form on www.dynamodogwalking.com!\n\nName\t\t: " + body.name + "\nDog\t\t\t: " + body.dogName + "\nEmail\t\t: " + body.email + "\nNumber\t\t: " + body.contactNum + "\nMessage\t\t: " + body.message + "\n\nThanks!";
        let params = {
            Message: emailbody,
            Subject: "Website contact from " + body.name,
            TopicArn: snsTopic
        };
        try {
            const data = await sns.publish(params).promise();
            console.log('MessageId: '+data.MessageId);
            response.statusCode = 200,
            response.body = JSON.stringify('processed');
        } catch (err) {
            console.log(err.stack);
            response.statusCode = 500,
            response.body = JSON.stringify({message: 'Internal error'});
        }
    } else {
        response.statusCode = 500,
        response.body = JSON.stringify({message: 'Invalid request'});
    }
    return response;
};