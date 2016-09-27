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
    return res.send('SERVER UP');
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

  routes.put('/update/:_id', function (req, res) {
    File.find(req.params)
      .then(function (allData) {
        if (allData == null) return res.send('invalid id');
        let files = allData.files;
        console.log(allData)
        console.log(files);
        //delete file

        if (typeof req.body.delete == 'object' && res.body.delete.length > 0) {
          req.body.delete.forEach(function (file) {
            fs.exists('storage/' + file, function (exists) {//remove file
              if (exists) {
                fs.unlink('storage/' + file);
              }
            });
            fs.exists('storage/thumb.' + file, function (exists) {//remove thmbnail if exist
              if (exists) {
                fs.unlink('storage/thumb.' + file);
              }
            });

            //remove from array
            let i = array.indexOf(file);
            if (i != -1) {
              files.splice(i, 1);
            }
          })
        }

        //addfile
        req.files.forEach(function (element) {
          files.push(element.filename);
        }, this);
        console.log(files)
        //save
        File.update({ _id: req.params._id, files: files })
          .then(function (success) {
            return res.send(success);
          })
          .catch(function (err) {
            return res.send(err);
          })

        optimizing(req.files);
        createThumbnail(req.files);

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