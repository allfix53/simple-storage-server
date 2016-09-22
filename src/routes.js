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
  routes.get('/', function(req, res) {
    res.render('index', {
      title: 'Hey',
      message: 'Hello there!'
    });
  })

  routes.post('/upload', upload.single('images'), function(req, res) {
    console.log(req.files);
  });
  return routes;
}
