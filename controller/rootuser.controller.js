const db  = require("../db.js")
const bcrypt = require('bcryptjs');
const {validationResult} = require('express-validator')

class RootUserContoroller {
    async registrationUser(req,res){
        try {
            const errors = validationResult(req)
            if(!errors.isEmpty()) {
                return res.status(400).json(errors.errors.map((e,index)=>(`${index}. Ошибка:${e.msg}`)))
            }
            const  {name,password} = req.body
            const result = await db.query('SELECT * FROM users WHERE username = $1', [name]);
            if (result.rows.length > 0) {
                const isValidPassword = bcrypt.compareSync(password, result.rows[0].password);
                if (isValidPassword) {
                  // Пользователь ввел правильный пароль
                  return res.status(400).json({
                    error: 'Вы уже зарегистрированы. Пожалуйста, авторизуйтесь.',
                  });
                } else {
                  // Пользователь ввел неправильный пароль
                  return res.status(400).json({
                    error: 'Пользователь с таким именем уже существует. Пожалуйста, выберите другое имя.',
                  });
                }
              }
            const hashPassword  = bcrypt.hashSync(password, 7);
            const newUser = await db.query('INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *', [name, hashPassword]);
            res.json(newUser.rows[0]);

        } catch (e) {
            console.log(`Ошибка: ${e.message}`);
            res.status(400).json(`Ошибка: ${e.message}`);
        }
    }
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
            res.json(nameSearch.rows[0])
    } catch (e) {
        console.log(`Ошибка: ${e.message}`);
        res.status(400).json(`Ошибка: ${e.message}`);
    }
    }
    async updateUserName(req,res){
        try {
            const errors = validationResult(req)
                if(!errors.isEmpty()) {
                    return res.status(400).json(errors.errors.map((e,index)=>(`${index}. Ошибка:${e.msg}`)))
                }
            const  {id,name} = req.body
            const getUsers =  await db.query(`SELECT * FROM rootusers WHERE "UserID" = $1`,[id])
            if(getUsers.rows.length < 1){
                return res.status(400).json({error:`Пользователь с id ${id} не найден`})
            }
            const updateUser = await db.query(
                `UPDATE rootusers set username = $1  WHERE "UserID" = $2 RETURNING * `,
                [name,id] 
                )

            res.json(updateUser.rows)
        } catch (e) {
            console.log(`Ошибка: ${e.message}`);
            res.status(400).json(`Ошибка: ${e.message}`);
        }
    }
    async updateUserPassword(req, res) {
        try {
            const errors = validationResult(req)
                if(!errors.isEmpty()) {
                    return res.status(400).json(errors.errors.map((e,index)=>(`${index}. Ошибка:${e.msg}`)))
                }
            const { id,oldpassword, password } = req.body;
            const getUsers =  await db.query(`SELECT * FROM rootusers WHERE "UserID" = $1`,[id])
            if(getUsers.rows.length < 1){
                return res.status(400).json({error:`Пользователь с id ${id} не найден`})
            }
            const validPassword = bcrypt.compareSync(oldpassword,getUsers.rows[0].password )
            if (!validPassword) {
                return res.status(400).json({error:`Введен неверный пароль`})
            }
            const hashPassword  = bcrypt.hashSync(password, 7);
            const updateUser = await db.query(
            'UPDATE rootusers SET password = $1 WHERE "UserID" = $2 RETURNING *',
            [hashPassword, id]
            );
        
            res.json(updateUser.rows);
        } catch (e) {
            console.log(`Ошибка: ${e.message}`);
            res.status(400).json(`Ошибка: ${e.message}`);
        }
      }
      
}
module.exports = new RootUserContoroller()