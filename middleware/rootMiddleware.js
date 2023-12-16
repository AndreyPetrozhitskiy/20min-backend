const {jwtSecret} = require('../config.js');
const jwt = require('jsonwebtoken');
const db  = require("../db.js")

module.exports = async function (req, res, next) {
    if (req.method === "OPTIONS") {
        next()
    }

    try {
        const token = req.headers.authorization.split( ' ')[1]
        if (!token) {
            return  res.status(400).json({message: "Пользователь не авторизован "});
        }
        const decodedData = jwt.verify(token, jwtSecret)
        const id = decodedData.id
        const checkAdmin =  await db.query(`SELECT * FROM rootusers WHERE "RootUserID" = $1`,[id])
            if(checkAdmin.rows.length > 0){
                return res.status(400).json({error: `Администратор с id ${id} не найден`})
            }
        req.user = decodedData
        next()
    } catch (e) {
        console.log(`Ошибка: ${e.message}`);
        res.status(400).json({message: "Пользователь не авторизован или не является администратором"});
    }
}