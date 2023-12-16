const Router = require('express')
const router = new Router()
const membersContoller = require('../controller/projectMembers.controller.js')
const {check} = require("express-validator")

// Создать новую связь по ролям
router.post('/create',[
    check('projectID',"Проект пользователя не может быть пустым").notEmpty(),
    check('userID',"User пользователя не может быть пустым").notEmpty(),
    check('role',"Role пользователя не может быть пустым").notEmpty()
],membersContoller.createMembersRoles)
// Получить все связи
router.get('/all-roles',membersContoller.getMembersRoles)
// Получить связь по id
router.get('/one-role/:id',membersContoller.getOneMembersRoles)


// Обновить всю связь по id
router.put('/updateall',[
    check('id',"Id проекта не может быть пустым").notEmpty(),
    check('projectID',"Проект пользователя не может быть пустым").notEmpty(),
    check('userID',"User пользователя не может быть пустым").notEmpty(),
    check('role',"Role пользователя не может быть пустым").notEmpty()
],membersContoller.updateAllRole)
// Обновить только роль у связи
router.put('/updaterole',[
    check('id',"Id проекта не может быть пустым").notEmpty(),
    check('role',"Role пользователя не может быть пустым").notEmpty()
],membersContoller.updateRole)
// Удалить связь
router.delete('/deleterole',[
    check('id',"Id проекта не может быть пустым").notEmpty(),
],membersContoller.deleteRole)

module.exports = router