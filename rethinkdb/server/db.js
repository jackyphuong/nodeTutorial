/**
 * Created by Phuong on 04/06/15.
 */
'use strict';

var q = require('q');
var r = require('rethinkdb');

var dbconnection = {
    host: process.env.RDB_HOST || 'jackyu1404.cloudapp.net',
    port: parseInt(process.env.RDB_PORT) || 28015,
    db  : process.env.RDB_DB || 'demo'
};

r.connections = [];

r.getNewConnection = ()=>{
    return r.connect(dbconnection)
        .then((conn)=>{
            conn.use(dbconnection.db);
            r.connections.push(conn);
            return conn;
        });
};

r.connect(dbconnection)
    .then((conn)=>{
        r.conn = conn;
        r.connections.push(conn);
        return r.dbCreate(dbconnection.db).run(r.conn)
            .catch(function(){})
            .then(()=>{
                r.conn.use(dbconnection.db);
                //Create tables
                return r.tableList().run(r.conn)
                    .then((tableList)=>{
                        return q()
                            .then(()=>{
                                if (tableList.indexOf('images') === -1) {
                                    return r.tableCreate('images').run(r.conn);
                                }
                            });
                    });
            });
    });

module.exports = r;
