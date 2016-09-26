import Router from 'express';
import File from './model/file.js';
import multer from 'multer';
import fs from 'fs';
import {optimizing, createThumbnail} from './lib';

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'storage')
  },
  filename: function (req, file, cb) {
    let extension = file.originalname.split(".");
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

  routes.get('/all', function (req, res) {
    File.find({})
      .then(function (allData) {
        res.send(allData)
      })
      .then(function (error) {
        res.send(err)
      })
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

  routes.delete('/album/:_id', function (req, res, next) {
    File.findOne(req.params)
      .then(function (data) {
        if (data == null) return res.send('invalid id');
        File.remove(req.params)
          .then(function (deleted) {
            return res.send('album deleted')
          })
          .catch(function (error) {
            res.send(error)
          });

        data.files.forEach(function (file) {
          fs.exists('storage/' + file, function (exists) {
            if (exists) {
              fs.unlink('storage/' + file);
            }
          });
          fs.exists('storage/thumb.' + file, function (exists) {
            if (exists) {
              fs.unlink('storage/thumb.' + file);
            }
          });
        })
      })
      .catch()
  });

  return routes;
}