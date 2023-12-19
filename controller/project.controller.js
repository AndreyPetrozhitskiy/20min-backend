const db  = require("../db.js")
const path = require('path');
const {validationResult} = require('express-validator')

class ProjectContoroller {

    async createProject(req, res) {
        try {
            const errors = validationResult(req)
            if(!errors.isEmpty()) {
                return res.status(400).json(errors.errors.map((e,index)=>(`${index}. Ошибка:${e.msg}`)))
            }
          const { name, description, figma, git, creatorUser } = req.body;
          const result = await db.query('SELECT * FROM projects WHERE "NameProject" = $1', [name]);
          if (result.rows.length > 0) {
            return  res.status(400).json({error:'Проект с таким именем уже существует. Пожалуйста, выберите другое имя.'});
          }
          if (!req.file) {
            return res.status(400).json({ error: 'Файл не загружен' });
          }
    
          const protocol = req.protocol; // http or https
          const host = req.get('host'); // localhost:5000 or your domain
          const photoPath = path.join('/files', req.file.filename);
          const fullPath = `${protocol}://${host}${photoPath.replace(/\\/g, '/')}`;
       
          const newProject = await db.query(
            `INSERT INTO projects 
            ("NameProject", "DescriptionProject", "LinkFigma", "LinkGit", "PhotoProject", "CreatorUserID") 
            VALUES ($1, $2, $3, $4, $5, $6)  
            RETURNING *`,
            [name, description, figma, git, fullPath, creatorUser]
          );
          const role = "Создатель"
          const newRole = await db.query(
            `INSERT INTO projectmembers 
            ("ProjectID","UserID","Role" ) 
            values ($1, $2, $3)  
            RETURNING *  `, 
            [newProject.rows[0].ProjectID,creatorUser,role]
            )
          res.json(newProject.rows[0]);
        } catch (e) {
            console.log(`Ошибка: ${e.message}`);
            res.status(400).json(`Ошибка: ${e.message}`);
        }
      }
    async getProject(req,res){
        try{
            const getProject =  await db.query(`SELECT * FROM projects `)
            if(getProject.rows.length < 1){
                return res.status(400).json({error:`Проекты отсутствуют`})
            }
            res.json(getProject.rows)
        } catch (e) {
            console.log(`Ошибка: ${e.message}`);
            res.status(400).json(`Ошибка: ${e.message}`);
        }
    }
    async getOneProject(req,res){
        try {
           
            const id = req.params.id
            const getProject =  await db.query(`SELECT * FROM projects WHERE "ProjectID" = $1`,[id])
            if(getProject.rows.length < 1){
                return res.status(400).json({error:`Проект с id ${id} не найден`})
            }
            res.json(getProject.rows)
        } catch (e) {
            console.log(`Ошибка: ${e.message}`);
            res.status(400).json(`Ошибка: ${e.message}`);
        }
    }
    async updateProjectName(req,res){
        try {
            const errors = validationResult(req)
            if(!errors.isEmpty()) {
                return res.status(400).json(errors.errors.map((e,index)=>(`${index}. Ошибка:${e.msg}`)))
            }
            const  {id,name} = req.body
            const getProject =  await db.query(`SELECT * FROM projects WHERE "ProjectID" = $1`,[id])
            if(getProject.rows.length < 1){
                return res.status(400).json({error:`Проект с id ${id} не найден`})
            }
            const updateName = await db.query(
                `UPDATE projects set "NameProject" = $1  WHERE "ProjectID" = $2 RETURNING * `,
                [name,id] 
                )

            res.json(updateName.rows)
        } catch (e) {
            console.log(`Ошибка: ${e.message}`);
            res.status(400).json(`Ошибка: ${e.message}`);
        }
    }
    async updateProjectDescription(req,res){
        try {
            const errors = validationResult(req)
            if(!errors.isEmpty()) {
                return res.status(400).json(errors.errors.map((e,index)=>(`${index}. Ошибка:${e.msg}`)))
            }
            const  {id,description} = req.body
            const getProject =  await db.query(`SELECT * FROM projects WHERE "ProjectID" = $1`,[id])
            if(getProject.rows.length < 1){
                return res.status(400).json({error:`Проект с id ${id} не найден`})
            }
            const updateDescription = await db.query(
                `UPDATE projects set "DescriptionProject" = $1  WHERE "ProjectID" = $2 RETURNING * `,
                [description,id] 
                )

            res.json(updateDescription.rows)
        } catch (e) {
            console.log(`Ошибка: ${e.message}`);
            res.status(400).json(`Ошибка: ${e.message}`);
        }
    }
    async updateProjectLinkFigma(req,res){
        try {
            const errors = validationResult(req)
            if(!errors.isEmpty()) {
                return res.status(400).json(errors.errors.map((e,index)=>(`${index}. Ошибка:${e.msg}`)))
            }
            const  {id,figma} = req.body
            const getProject =  await db.query(`SELECT * FROM projects WHERE "ProjectID" = $1`,[id])
            if(getProject.rows.length < 1){
                return res.status(400).json({error:`Проект с id ${id} не найден`})
            }
            const updateLinkFigma = await db.query(
                `UPDATE projects set "LinkFigma" = $1  WHERE "ProjectID" = $2 RETURNING * `,
                [figma,id] 
                )

            res.json(updateLinkFigma.rows)
        } catch (e) {
            console.log(`Ошибка: ${e.message}`);
            res.status(400).json(`Ошибка: ${e.message}`);
        }
    }
    async updateProjectLinkGit(req,res){
        try {
            const errors = validationResult(req)
            if(!errors.isEmpty()) {
                return res.status(400).json(errors.errors.map((e,index)=>(`${index}. Ошибка:${e.msg}`)))
            }
            const  {id,git} = req.body
            const getProject =  await db.query(`SELECT * FROM projects WHERE "ProjectID" = $1`,[id])
            if(getProject.rows.length < 1){
                return res.status(400).json({error:`Проект с id ${id} не найден`})
            }
            const updateLinkGit = await db.query(
                `UPDATE projects set "LinkGit" = $1  WHERE "ProjectID" = $2 RETURNING * `,
                [git,id] 
                )

            res.json(updateLinkGit.rows)
        } catch (e) {
            console.log(`Ошибка: ${e.message}`);
            res.status(400).json(`Ошибка: ${e.message}`);
        }
    }
    async updateProjectPhoto(req,res){
        try {
            const errors = validationResult(req)
            if(!errors.isEmpty()) {
                return res.status(400).json(errors.errors.map((e,index)=>(`${index}. Ошибка:${e.msg}`)))
            }
            const { id } = req.body;
            const getProject =  await db.query(`SELECT * FROM projects WHERE "ProjectID" = $1`,[id])
            if(getProject.rows.length < 1){
                return res.status(400).json({error:`Проект с id ${id} не найден`})
            }
            if (!req.file) {
              return res.status(400).json({ error: 'Файл не загружен' });
            }
      
            const protocol = req.protocol; // http or https
            const host = req.get('host'); // localhost:5000 or your domain
            const photoPath = path.join('/files', req.file.filename);
            const fullPath = `${protocol}://${host}${photoPath.replace(/\\/g, '/')}`;
      
            const newProject = await db.query(
              `UPDATE projects set "PhotoProject" = $1  WHERE "ProjectID" = $2 RETURNING * `,
            [fullPath,id] 
            );
      
            res.json(newProject.rows[0]);
          } catch (e) {
            console.log(`Ошибка: ${e.message}`);
            res.status(400).json(`Ошибка: ${e.message}`);
        }
    }
    async updateProjectStatus(req,res){
        try {
            const errors = validationResult(req)
            if(!errors.isEmpty()) {
                return res.status(400).json(errors.errors.map((e,index)=>(`${index}. Ошибка:${e.msg}`)))
            }

            const  {id,status} = req.body
            const getProject =  await db.query(`SELECT * FROM projects WHERE "ProjectID" = $1`,[id])
            if(getProject.rows.length < 1){
                return res.status(400).json({error:`Проект с id ${id} не найден`})
            }
            const updateStatus = await db.query(
                `UPDATE projects set "Status" = $1  WHERE "ProjectID" = $2 RETURNING * `,
                [status,id] 
                )

            res.json(updateStatus.rows)
        } catch (e) {
            console.log(`Ошибка: ${e.message}`);
            res.status(400).json(`Ошибка: ${e.message}`);
        }
    }
    async updateProjectVisibility(req,res){
        try {
            const errors = validationResult(req)
            if(!errors.isEmpty()) {
                return res.status(400).json(errors.errors.map((e,index)=>(`${index}. Ошибка:${e.msg}`)))
            }

            const  {id,visibility} = req.body
            const getProject =  await db.query(`SELECT * FROM projects WHERE "ProjectID" = $1`,[id])
            if(getProject.rows.length < 1){
                return res.status(400).json({error:`Проект с id ${id} не найден`})
            }
            const updateVisibility = await db.query(
                `UPDATE projects set "Visibility" = $1  WHERE "ProjectID" = $2 RETURNING * `,
                [visibility,id] 
                )

            res.json(updateVisibility.rows)
        } catch (e) {
            console.log(`Ошибка: ${e.message}`);
            res.status(400).json(`Ошибка: ${e.message}`);
        }
    }
    async deleteProject(req,res){
        try {
            const errors = validationResult(req)
            if(!errors.isEmpty()) {
                return res.status(400).json(errors.errors.map((e,index)=>(`${index}. Ошибка:${e.msg}`)))
            }

            const  {id} = req.body
            const getProject =  await db.query(`SELECT * FROM projects WHERE "ProjectID" = $1`,[id])
            if(getProject.rows.length < 1){
                return res.status(400).json({error:`Проект с id ${id} не найден`})
            }
            const deleteProject = await db.query(
                `DELETE FROM projects WHERE "ProjectID" = $1 RETURNING * `,
                [id] 
                )

            res.json('Проект удален!')
        } catch (e) {
            console.log(`Ошибка: ${e.message}`);
            res.status(400).json(`Ошибка: ${e.message}`);
        }
    }
}
module.exports = new ProjectContoroller()