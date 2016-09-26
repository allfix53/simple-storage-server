import imagemin from 'imagemin';
import jpegtran from 'imagemin-jpegtran';
import lwip from 'lwip';

function optimizing(files) {
    let willOptimized = [];

    files.forEach(function (element, index) {
        if (element.mimetype == 'image/jpeg' || element.mimetype == 'image/jpg')
            willOptimized.push(element.path);

        if (index == files.length - 2) {
            console.log(willOptimized)
            imagemin(willOptimized, 'storage', { use: [jpegtran()] }).then(() => {
                console.log('Images optimized');
            });
        }
    }, this);
};
function createThumbnail(files) {
    files.forEach(function (element, index) {
        // console.log(element)
        let isImage = element.mimetype.split('/');
        if (isImage[0] == 'image') {
            lwip.open(element.path, function (err, image) {
                image.batch()
                    .resize(50)
                    .writeFile('storage/thumb.' + element.filename, function (err) {
                        if (err)
                            console.log(err)
                    });

            });
        }
    }, this);
}

export {optimizing, createThumbnail}