/**
 * Created by Phuong on 04/06/15.
 */

// You must have an element with the ID `dropzone`
var socket = io.connect('http://jackyu1404.cloudapp.net:8000');

socket.on('Image:update', function (image) {
    var reader = new FileReader();
    reader.onload = function(e) {
        $('#images')
            .html('<img src="' + e.target.result + '" />');
    }.bind(this);
    reader.readAsDataURL(new Blob([image.file]));
});
