const Router = require('express')
const router = new Router()
const projectContoroller = require('../controller/project.controller.js')

// Создать проект
router.post('/create',projectContoroller.createProject)
// Получить все проекты
router.get('/',projectContoroller.getProject)
// Получить проект по id
router.get('/:id',projectContoroller.getOneProject)

// Сменить имя проекта
router.put('/name',projectContoroller.updateProjectName)
// Сменить описание проекта
router.put('/description',projectContoroller.updateProjectDescription)
// Сменить ссылку на фигму проекта
router.put('/figma',projectContoroller.updateProjectLinkFigma)
// Сменить ссылку на гит проекта
router.put('/git',projectContoroller.updateProjectLinkGit)
// Сменить фото проекта
router.put('/photo',projectContoroller.updateProjectPhoto)
// Сменить статус проекта
router.put('/status',projectContoroller.updateProjectStatus)
// Сменить публичность проекта
router.put('/visibility',projectContoroller.updateProjectVisibility)

// Удалить проект
router.delete('/delete',projectContoroller.deleteProject)
module.exports = router