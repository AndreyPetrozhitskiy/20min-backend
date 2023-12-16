const {jwtSecret} = require('../config.js');
const jwt = require('jsonwebtoken');
const db  = require("../db.js")
const bcrypt = require('bcryptjs');
const {validationResult} = require('express-validator')

const generateAccessToken = (id, name) => {
    const payload = {
        id,
        name
    }
    return jwt.sign(payload,jwtSecret,{ expiresIn: "72h"})
}
class RootUserContoroller {
    // Авторизация админа
    async loginUser(req,res){
        try {
            const errors = validationResult(req)
            if(!errors.isEmpty()) {
                return res.status(400).json(errors.errors.map((e,index)=>(`${index}. Ошибка:${e.msg}`)))
            }
            const  {name,password} = req.body
            const nameSearch = await db.query('SELECT * FROM rootusers WHERE username = $1', [name]);
            if(nameSearch.rows.length === 0){
                return res.status(400).json({error: `Пользователь ${name} не найден`})
            }
            const validPassword = bcrypt.compareSync(password,nameSearch.rows[0].password )
            if (!validPassword) {
                return res.status(400).json({error: `Введен неверный пароль`})
            }
            const token = generateAccessToken(nameSearch.rows[0].UserID,nameSearch.rows[0].username)
            return res.json({  token });
    } catch (e) {
        console.log(`Ошибка: ${e.message}`);
        res.status(400).json(`Ошибка: ${e.message}`);
    }
    }
   
}
module.exports = new RootUserContoroller()