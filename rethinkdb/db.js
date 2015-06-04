/**
 * Created by Phuong on 03/06/15.
 */
import r from 'rethinkdb';
import util from 'util';
import assert from 'assert';
import debug from 'debug';
import async from 'async';

var logdebug = debug('rdb:debug');
var logerror =debug('rdb:error');
var dbConfig = {
    host: process.env.RDB_HOST || 'jackyu1404.cloudapp.net',
    port: parseInt(process.env.RDB_PORT) || 28015,
    db  : process.env.RDB_DB || 'demo',
    tables: ['authors', 'authors1']
};

module.exports.setup= function (callback) {
    r.connect({host: dbConfig.host, port: dbConfig.port }, function (err, connection) {
        assert.ok(err === null, err);
        r.dbCreate(dbConfig.db).run(connection, function(err, result) {
            if(err) {
                logdebug("[DEBUG] RethinkDB database '%s' already exists (%s:%s)\n%s", dbConfig.db, err.name, err.msg, err.message);
            }
            else {
                logdebug("[INFO ] RethinkDB database '%s' created", dbConfig.db);
            }
            async.each(dbConfig.tables, function(tbl, cb) {
                ((tableName)=>{
                    r.db(dbConfig.db).tableCreate(tableName).run(connection, function(err, result) {
                        if (err) {
                            logdebug("[DEBUG] RethinkDB table '%s' already exists (%s:%s)\n%s", tableName, err.name, err.msg, err.message);
                        }
                        else {
                            logdebug("[INFO ] RethinkDB table '%s' created", tableName);
                        }
                        cb();
                    });
                })(tbl);
            },(err)=>{
                callback(err);
            });
        });
    });
}

module.exports.saveAuthor = (authors, callback)=>{
    onConnect((err, conn)=>{
       r.db(dbConfig.db).table('authors').insert(authors).run(conn, (err, result)=>{
            if(err){
              logerror("[ERROR][%s][saveMessage] %s:%s\n%s", conn['_id'], err.name, err.msg, err.message);
              callback(err);
            }
            else{
              if(result.inserted > 0) {
                  callback(null, true);
              }
              else {
                  callback(null, false);
              }
            }
            conn.close();
       });
    });
};

module.exports.getAllAuthors=(callback)=>{
    onConnect((err, conn)=>{
        r.table('authors').run(conn, (err, cursor)=>{
            if(err){
               logerror("[ERROR][%s][getAllAuthors] %s:%s\n%s", conn['_id'], '111', err.msg, err.message);
               callback(err);
            }
            cursor.toArray((err, result)=>{
                if(err){
                    logerror("[ERROR][%s][getAllAuthors] %s:%s\n%s", conn['_id'], '2222', err.msg, err.message);
                }
                logdebug(JSON.stringify(result, null, 2));
            });
            callback(null);
            conn.close();
        });
    });
};

module.exports.getAuthorsByName=(name, callback)=>{
    onConnect((err, conn)=>{
        r.table('authors').filter(r.row('name').eq(name)).run(conn, (err, cursor)=>{
            if(err){
                logerror("[ERROR][%s][getAllAuthors] %s:%s\n%s", conn['_id'], err.name, err.msg, err.message);
                callback(err);
            }
            cursor.toArray((err, result)=>{
                if(err){
                    logerror("[ERROR][%s][getAllAuthors] %s:%s\n%s", conn['_id'], err.name, err.msg, err.message);
                }
                logdebug(JSON.stringify(result, null, 2));
            });
            callback(null);
            conn.close();
        });
    });
};

module.exports.monitorAuthorChanges = (callback)=>{
    onConnect((err, conn)=>{
        r.table('authors').changes()
            .run(conn)
            .then((cursor)=>{
                cursor.each(function (err, row) {
                    if(err) throw err;
                    logdebug(JSON.stringify(row, null, 2));
                });
            });
    });
};

function onConnect(callback){
    r.connect({host: dbConfig.host, port: dbConfig.port, db:dbConfig.db, timeout: 300 }, (err, conn)=>{
        assert.ok(err === null, err);
        conn['_id'] = Math.floor(Math.random()*10001);
        callback(err, conn);
    });
};

