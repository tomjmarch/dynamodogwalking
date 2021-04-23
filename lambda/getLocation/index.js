'use strict';
const AWS = require("aws-sdk");

const response = {headers:{ 'Access-Control-Allow-Origin' : '*', 'content-type': 'application/json'}};
const towns = ["St Ives", "Wimblington", "March", "Chatteris", "Doddington", "Benwick", "Ramsey","Whittlesey","Warboys","Somersham"];

exports.handler = async (event) => {
    response.statusCode = 200;
    response.body = JSON.stringify(towns);
    return response;
};
