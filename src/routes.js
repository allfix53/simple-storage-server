import Router from 'express';
import File from './model/file.js';
import multer from 'multer';
import imagemin from 'imagemin';
import jpegtran from 'imagemin-jpegtran';

const upload = multer({
  dest: './storage'
})

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
      imagemin(willOptimized, 'storage/build', { use: [jpegtran()] }).then(() => {
        console.log('Images optimized');
      });
    }
  }, this);
}