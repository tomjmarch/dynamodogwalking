'use strict';
const AWS = require("aws-sdk");

const response = {headers:{ 'Access-Control-Allow-Origin' : '*', 'content-type': 'application/json'}};
const towns = ["Cambridgeshire", "Wimblington", "March", "Chatteris", "Doddington", "Benwick", "Ramsey","Whittlesey","Warboys","Ely","Somersham"];

exports.handler = async (event) => {
    const random = Math.floor(Math.random() * towns.length);
    response.statusCode = 200;
    response.body = JSON.stringify({location: towns[random]});
    return response;
};
