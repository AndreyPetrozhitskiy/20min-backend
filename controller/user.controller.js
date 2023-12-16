const {jwtSecret} = require('../config.js');
const jwt = require('jsonwebtoken');
const db  = require("../db.js")
const bcrypt = require('bcryptjs');
const {validationResult} = require('express-validator')
const path = require('path');


const generateAccessToken = (id, name) => {
    const payload = {
        id,
        name
    }
    return jwt.sign(payload,jwtSecret,{ expiresIn: "72h"})
}
class UserContoroller {
  // Регистрация
    async registrationUser(req, res) {
        try {
          const errors = validationResult(req);
          if (!errors.isEmpty()) {
            return res.status(400).json(errors.errors.map((e, index) => `${index}. Ошибка:${e.msg}`));
          }
          const { name, password } = req.body;
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
          const hashPassword = bcrypt.hashSync(password, 7);
          const newUser = await db.query('INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *', [name, hashPassword]);
            
          // Генерация JWT-токена после успешной регистрации
          const token = generateAccessToken(newUser.rows[0].UserID,newUser.rows[0].username)
    
          return res.json({  ID:newUser.rows[0].UserID, Name:newUser.rows[0].username, TokenUser: token });
        } catch (e) {
          console.log(`Ошибка: ${e.message}`);
          return res.status(400).json(`Ошибка: ${e.message}`);
        }
      }
    // Авторизация
      async loginUser(req, res) {
        try {
          const errors = validationResult(req);
          if (!errors.isEmpty()) {
            return res.status(400).json(errors.errors.map((e, index) => `${index}. Ошибка:${e.msg}`));
          }
          const { name, password } = req.body;
          const nameSearch = await db.query('SELECT * FROM users WHERE username = $1', [name]);
          if (nameSearch.rows.length === 0) {
            return res.status(400).json({ error: `Пользователь ${name} не найден` });
          }
          const validPassword = bcrypt.compareSync(password, nameSearch.rows[0].password);
          if (!validPassword) {
            return res.status(400).json({ error: `Введен неверный пароль` });
          }
          // Генерация JWT-токена после успешного входа
          const token = generateAccessToken(nameSearch.rows[0].UserID,nameSearch.rows[0].username)
          return res.json({   ID:nameSearch.rows[0].UserID, Name:nameSearch .rows[0].username, TokenUser: token});
        } catch (e) {
          console.log(`Ошибка: ${e.message}`);
          return res.status(400).json(`Ошибка: ${e.message}`);
        }
      }
    async getUser(req,res){
        try {
        const getUsers =  await db.query(`SELECT * FROM users `)
        if(getUsers.rows.length < 1){
            return res.status(400).json({error: `Пользователи отсутствуют`})
        }
        return  res.json({Id:getUsers.rows.UserID,Name:getUsers.rows.username,Photo:getUsers.rows.avatar}) 
        } catch (e) {
            console.log(`Ошибка: ${e.message}`);
            return res.status(400).json(`Ошибка: ${e.message}`);
        }
    }
    async getOneUser(req,res){
        try {
            const id = req.params.id
            const getUsers =  await db.query(`SELECT * FROM users WHERE "UserID" = $1`,[id])
            if(getUsers.rows.length < 1){
                return res.status(400).json({error: `Пользователь с id ${id} не найден`})
            }
            res.json({Id:getUsers.rows.UserID,Name:getUsers.rows.username,Photo:getUsers.rows.avatar})
        } catch (e) {
            console.log(`Ошибка: ${e.message}`);
            return res.status(400).json(`Ошибка: ${e.message}`);
        }
    }
    async updateAvatar(req,res){
        try {
            const errors = validationResult(req)
                if(!errors.isEmpty()) {
                    return res.status(400).json(errors.errors.map((e,index)=>(`${index}. Ошибка:${e.msg}`)))
                }
            const  {id} = req.body
            const getUsers =  await db.query(`SELECT * FROM users WHERE "UserID" = $1`,[id])
            if(getUsers.rows.length < 1){
                return res.status(400).json({error: `Пользователь с id ${id} не найден`})
            }
            if (!req.file) {
                return res.status(400).json({ error: 'Файл не загружен' });
              }
              const protocol = req.protocol; // http or https
              const host = req.get('host'); // localhost:5000 or your domain
              const photoPath = path.join('/files', req.file.filename);
              const fullPath = `${protocol}://${host}${photoPath.replace(/\\/g, '/')}`;   
              const newAvatar = await db.query(
                  `UPDATE users set "avatar" = $1  WHERE "UserID" = $2 RETURNING * `,
                [fullPath,id] 
                );
                return  res.json({Id:newAvatar.rows[0].UserID, Photo:newAvatar.rows[0].avatar});
        } catch (e) {
            console.log(`Ошибка: ${e.message}`);
            return res.status(400).json(`Ошибка: ${e.message}`);
        }
    }
    async updateUserName(req,res){
        try {
            const errors = validationResult(req)
                if(!errors.isEmpty()) {
                    return res.status(400).json(errors.errors.map((e,index)=>(`${index}. Ошибка:${e.msg}`)))
                }
            const  {id,name} = req.body
            const getUsers =  await db.query(`SELECT * FROM users WHERE "UserID" = $1`,[id])
            if(getUsers.rows.length < 1){
                return res.status(400).json({error:`Пользователь с id ${id} не найден`})
            }
            const updateUser = await db.query(
                `UPDATE users set username = $1  WHERE "UserID" = $2 RETURNING * `,
                [name,id] 
                )

                return res.json(updateUser.rows)
        } catch (e) {
            console.log(`Ошибка: ${e.message}`);
            return  res.status(400).json(`Ошибка: ${e.message}`);
        }
    }
    async updateUserPassword(req, res) {
        try {
            const errors = validationResult(req)
                if(!errors.isEmpty()) {
                    return res.status(400).json(errors.errors.map((e,index)=>(`${index}. Ошибка:${e.msg}`)))
                }
            const { id,oldpassword, password } = req.body;
            const getUsers =  await db.query(`SELECT * FROM users WHERE "UserID" = $1`,[id])
            if(getUsers.rows.length < 1){
                return res.status(400).json({error:`Пользователь с id ${id} не найден`})
            }
            const validPassword = bcrypt.compareSync(oldpassword,getUsers.rows[0].password )
            if (!validPassword) {
                return res.status(400).json({error:`Введен неверный пароль`})
            }
            const hashPassword  = bcrypt.hashSync(password, 7);
            const updateUser = await db.query(
            'UPDATE users SET password = $1 WHERE "UserID" = $2 RETURNING *',
            [hashPassword, id]
            );
        
            return res.json(updateUser.rows);
        } catch (e) {
            console.log(`Ошибка: ${e.message}`);
            return  res.status(400).json(`Ошибка: ${e.message}`);
        }
      }
      async deleteUser(req,res){
        try {
            const errors = validationResult(req)
            if(!errors.isEmpty()) {
                return res.status(400).json(errors.errors.map((e,index)=>(`${index}. Ошибка:${e.msg}`)))
            }

            const  {id} = req.body
            const getProject =  await db.query(`SELECT * FROM users WHERE "UserID" = $1`,[id])
            if(getProject.rows.length < 1){
                return res.status(400).json({error:`Пользователь с id ${id} не найден`})
            }
            const deleteProject = await db.query(
                `DELETE FROM users WHERE "UserID" = $1 RETURNING * `,
                [id] 
                )

            res.json('Пользователь удален!')
        } catch (e) {
            console.log(`Ошибка: ${e.message}`);
            res.status(400).json(`Ошибка: ${e.message}`);
        }
      }
}
module.exports = new UserContoroller()