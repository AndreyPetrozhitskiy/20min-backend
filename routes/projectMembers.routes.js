const Router = require('express')
const router = new Router()
const membersContoller = require('../controller/projectMembers.controller.js')


// Создать новую связь по ролям
router.post('/create',membersContoller.createMembersRoles)
// Получить все связи
router.get('/all-roles',membersContoller.getMembersRoles)
// Получить связь по id
router.get('/one-role/:id',membersContoller.getOneMembersRoles)


// Обновить всю связь по id
router.put('/updateAll',membersContoller.updateAllRole)
// Обновить только роль у связи
router.put('/updateRole',membersContoller.updateRole)
// Удалить связь
router.delete('/delete',membersContoller.deleteRole)
module.exports = router