const Router = require('express')
const router = new Router()
const projectContoroller = require('../controller/project.controller.js')
const {check} = require("express-validator")
const multer = require('multer');
const path = require('path');

const uploadPath = path.join(__dirname, '../files');
// Конфигурация Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const fileName = file.fieldname + '-' + Date.now() + ext;
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

// Создать проект
router.post('/create', upload.single('photo'),[
    check('name',"Имя проекта не может быть пустым").notEmpty()
], projectContoroller.createProject);
// Получить все проекты
router.get('/',projectContoroller.getProject)
// Получить проект по id
router.get('/:id',projectContoroller.getOneProject)

// Сменить имя проекта
router.put('/name',[
    check('id',"Id не может быть пустым").isLength({min:1}),
    check('name',"Имя проекта не может быть пустым").notEmpty()
],projectContoroller.updateProjectName)
// Сменить описание проекта
router.put('/description',[
    check('id',"Id не может быть пустым").isLength({min:1}),
    check('description',"Описание не может быть пустым").notEmpty()
],projectContoroller.updateProjectDescription)
// Сменить ссылку на фигму проекта
router.put('/figma',[
    check('id',"Id не может быть пустым").isLength({min:1}),
    check('figma',"Ссылка не может быть пустой").notEmpty()
],projectContoroller.updateProjectLinkFigma)
// Сменить ссылку на гит проекта
router.put('/git',[
    check('id',"Id не может быть пустым").isLength({min:1}),
    check('git',"Ссылка не может быть пустой").notEmpty()
],projectContoroller.updateProjectLinkGit)
// Сменить фото проекта
router.put('/photo',upload.single('photo'),[
    check('id',"Id не может быть пустым").isLength({min:1})
],projectContoroller.updateProjectPhoto)
// Сменить статус проекта
router.put('/status',[
    check('id',"Id не может быть пустым").isLength({min:1}),
    check('status',"Статус не может быть пустой").notEmpty()
],projectContoroller.updateProjectStatus)
// Сменить публичность проекта
router.put('/visibility',[
    check('id',"Id не может быть пустым").isLength({min:1}),
    check('visibility',"Видимость не может быть пустой").notEmpty()
],projectContoroller.updateProjectVisibility)

// Удалить проект
router.delete('/delete',[
    check('id',"Id не может быть пустым").isLength({min:1})
],projectContoroller.deleteProject)
module.exports = router