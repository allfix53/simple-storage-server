import Router from 'express';
import File from './model/file.js';
import multer from 'multer';
import imagemin from 'imagemin';
import jpegtran from 'imagemin-jpegtran';
import lwip from 'lwip';

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'storage')
  },
  filename: function (req, file, cb) {
    let extension =  file.originalname.split(".");
    cb(null, Date.now() + '.' + extension[extension.length - 1])
  }
})

var upload = multer({ storage: storage })

//upload: upload album
//update: {file & deleteItem}
//delete: delete album

export default ({
  config,
  db
}) => {
  let routes = Router();

  // add middleware here
  routes.get('/', function (req, res) {
    res.render('index', {
      title: 'Hey',
      message: 'Hello there!'
    });
  })

  routes.post('/upload', upload.array('files', 12), function (req, res, next) {
    let files = [];
    req.files.forEach(function (element) {
      files.push(element.filename);
    }, this);
    //save to db
    File.create({ files: files })
      .then(function (successUpload) {
        res.send(successUpload);
      })
      .catch(function (failedUpload) {
        res.send(failedUpload);
      })

    //jpegtran
    optimizing(req.files);
    createThumbnail(req.files);
  });
  return routes;
}

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
}

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