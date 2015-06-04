/**
 * Created by Phuong on 04/06/15.
 */
var _ = require('lodash');
var r = require('./db');
var multiparty = require('multiparty');
var fs = require('fs');

var imageCreate =  (req, res)=> {
    let form = new multiparty.Form();
    form.parse(req, (err, fields, files)=>{
        let imageFilePath = files.file[0].path; // Our file in a base64 string
        fs.readFile(imageFilePath, (err, file)=>{
            let image = {
                fileName: fields.fileName[0],
                type: fields.type[0],
                file: file,
            };
            r
                .table('images')
                .insert(image)
                .run(r.conn)
                .then((queryResult)=>{
                    res.json( {
                        id: req.params.id
                    });
                });
        });
    });
};

module.exports = imageCreate;