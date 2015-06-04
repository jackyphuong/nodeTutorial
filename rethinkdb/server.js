/**
 * Created by Phuong on 03/06/15.
 */
import r from 'rethinkdb';
import db from './db';
import async from 'async';
import debug from 'debug';

var logdebug = debug('demo:debug');
var logerror =debug('demo:error');
var authors = [
    { name: "William Adama", tv_show: "Battlestar Galactica",
        posts: [
            {title: "Decommissioning speech", content: "The Cylon War is long over..."},
            {title: "We are at war", content: "Moments ago, this ship received word..."},
            {title: "The new Earth", content: "The discoveries of the past few days..."}
        ]
    },
    { name: "Laura Roslin", tv_show: "Battlestar Galactica",
        posts: [
            {title: "The oath of office", content: "I, Laura Roslin, ..."},
            {title: "They look like us", content: "The Cylons have the ability..."}
        ]
    },
    { name: "Jean-Luc Picard", tv_show: "Star Trek TNG",
        posts: [
            {title: "Civil rights", content: "There are some words I've known since..."}
        ]
    }
];

async.series([
    function (callback) {
        db.setup(()=>{
            callback(null);
        });
    },
    function(callback){
        db.saveAuthor(authors,(err, saved)=>{
            logdebug("[DEBUG][saveAuthor] %s", saved);
            callback(err);
        });
    },
    /*function(callback){
        db.getAllAuthors((err)=>{
            callback(err);
        });
    },*/
    /*(callback)=>{
        db.getAuthorsByName('William Adama',(err)=>{
            callback(err);
        });
    },*/
    (callback)=>{
        db.monitorAuthorChanges((err)=>{
            callback(err);
        })
    },
]);

//db.monitorAuthorChanges(null);
