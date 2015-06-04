/**
 * Created by Phuong on 04/06/15.
 */
'use strict';
var r = require('./db');

var socketHandler = function (io, socket) {
    r.getNewConnection()
        .then((conn)=>{
            r
                .table('images')
                .changes()
                .run(conn)
                .then((cursor)=>{
                    cursor.each((err, photo)=>{
                        // Push images through the socket connection
                        if (photo.new_val !== null) {
                            io.emit('Image:update', photo.new_val);
                        }
                    });
                });
        });
};

module.exports = socketHandler;
