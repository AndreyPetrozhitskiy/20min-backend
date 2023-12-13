const Router = require('express')
const router = new Router()
const userContoller = require('../controller/user.controller.js')

// Новый пользователь
router.post('/createuser',userContoller.createUser) 
// Получить всех пользователей
router.get('/alluser',userContoller.getUser)
// Получить конкретного пользователя по ID
router.get('/one-user/:id',userContoller.getOneUser)
// Изменить ник пользователя
router.put('/updatename',userContoller.updateUserName)
// Изменить пароль
router.put('/updatepassword',userContoller.updateUserPassword)

module.exports = router