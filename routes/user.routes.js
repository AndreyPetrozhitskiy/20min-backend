const Router = require('express')
const userContoller = require('../controller/user.controller.js')
const {check} = require("express-validator")
const multer = require('multer');
const path = require('path');

const router = new Router()
const uploadPath = path.join(__dirname, '../files');
const rootMiddleware = require('../middleware/rootMiddleware.js')
// Конфигурация Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname);
      const fileName = file.filename + '-' + Date.now() + ext;
      cb(null, fileName);
    },
  });
  
  // Фильтр файлов
  const fileFilter = (req, file, cb) => {
    // Проверка типа файла
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only images are allowed.'), false);
    }
  };
  
  const upload = multer({ storage, fileFilter });

// Регистрация
router.post('/registration',[
    check('name',"Имя пользователя не может быть пустым").notEmpty(),
    check('password',"Пароль не должен быть пустым , не меньше 5 символов или больше 100 символов").isLength({min:5,max:100})
],userContoller.registrationUser) 
// Авторизация
router.post('/login',[
    check('name',"Имя пользователя не может быть пустым").notEmpty(),
    check('password',"Пароль не должен быть пустым , не меньше 5 символов или больше 100 символов").isLength({min:5,max:100})
],userContoller.loginUser) 
// Получить всех пользователей
router.get('/alluser',userContoller.getUser)
// Получить конкретного пользователя по ID
router.get('/one-user/:id',userContoller.getOneUser)
// Обновление аватарки
router.put('/updateavatar',[
    check('id',"Id не может быть пустым").isLength({min:1})
],upload.single('photo'),userContoller.updateAvatar)
// Изменить ник пользователя
router.put('/updatename',[
    check('name',"Имя пользователя не может быть пустым").notEmpty(),
    check('id',"Id не может быть пустым").isLength({min:1})
],userContoller.updateUserName)
// Изменить пароль
router.put('/updatepassword',[
    check('password',"Новый Пароль не должен быть пустым , не меньше 5 символов или больше 100 символов").isLength({min:5,max:100}),
    check('oldpassword'," Старый Пароль не должен быть пустым , не меньше 5 символов или больше 100 символов").isLength({min:5,max:100}),
    check('id',"Id не может быть пустым").isLength({min:1})
],userContoller.updateUserPassword)
router.delete('/delete',[
  check('id',"Id не может быть пустым").isLength({min:1})
],rootMiddleware,userContoller.deleteUser)
module.exports = router