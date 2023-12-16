const Router = require('express')
const rootUserContoller = require('../controller/rootuser.controller')
const {check} = require("express-validator")

const router = new Router()

// Авторизация

router.post('/login',[
    check('name',"Имя пользователя не может быть пустым").notEmpty(),
    check('password',"Пароль не должен быть пустым , не меньше 5 символов или больше 100 символов").isLength({min:5,max:100})
],rootUserContoller.loginUser) 
// Изменить ник пользователя
router.put('/updatename',[
    check('name',"Имя пользователя не может быть пустым").notEmpty(),
    check('id',"Id не может быть пустым").isLength({min:1})
],rootUserContoller.updateUserName)
// Изменить пароль
router.put('/updatepassword',[
    check('password',"Новый Пароль не должен быть пустым , не меньше 5 символов или больше 100 символов").isLength({min:5,max:100}),
    check('oldpassword'," Старый Пароль не должен быть пустым , не меньше 5 символов или больше 100 символов").isLength({min:5,max:100}),
    check('id',"Id не может быть пустым").isLength({min:1})
],rootUserContoller.updateUserPassword)

module.exports = router