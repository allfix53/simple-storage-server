import Router from 'express';
import File from './model/file.js';
import multer from 'multer';

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

    File.create({ files: files })
    .then(function(successUpload){
      res.send(successUpload);
    })
    .catch(function(failedUpload){
      res.send(failedUpload);
    })
  });
  return routes;
}