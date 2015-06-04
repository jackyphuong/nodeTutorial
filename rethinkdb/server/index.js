/**
 * Created by Phuong on 04/06/15.
 */
'use strict';

var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

var bodyParser = require('body-parser');
var socketHandler = require('./socket-handler');
var imageCreate = require('./image-create');

server.listen(8000);

app
    .use(bodyParser.urlencoded({extended:true}))
    .use(bodyParser.json());

app
    .post('/image/', imageCreate)
    .use(express.static(__dirname + '/../client'))
    .use('*', function (req, res) {
        res.status(404).send('404 Not Found').end();
    });

io.on('connection', socketHandler.bind(null, io));

console.log("Listenning on port 8000");