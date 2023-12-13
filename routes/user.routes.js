const Router = require('express')
const router = new Router()
const userContoller = require('../controller/user.controller.js')
const {check} = require("express-validator")



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

module.exports = router