const db  = require("../db.js")

class ProjectMembersContoroller {
    async createMembersRoles(req,res){
        const  {projectID,userID,role} = req.body
        const result = await db.query('SELECT * FROM projects WHERE "ProjectID" = $1', [projectID]);
          if (result.rows.length < 1) {
            return  res.status(400).json({error:'Проекта с таким именем не существует. Пожалуйста, выберите другое имя.'});
          }
          const checkUser = await db.query('SELECT * FROM users WHERE "UserID" = $1', [userID]);
          if (checkUser.rows.length < 1) {
            return  res.status(400).json({error:'Пользователя с таким именем не существует. Пожалуйста, выберите другое пользователя.'});
          }
        const newRole = await db.query(
            `INSERT INTO projectmembers 
            ("ProjectID","UserID","Role" ) 
            values ($1, $2, $3)  
            RETURNING *  `, 
            [projectID,userID,role]
            )
    
        res.json(newRole.rows[0])
    }
    async getMembersRoles(req,res){
        const getProject =  await db.query(` SELECT 
        pm."MemberID",
        p."NameProject" AS "ProjectName",
        u."username" AS "UserName",
        pm."Role"
      FROM 
        projectmembers pm
      JOIN 
        projects p ON pm."ProjectID" = p."ProjectID"
      JOIN 
        users u ON pm."UserID" = u."UserID"
    `);
          if (getProject.length < 1) {
            return  res.status(400).json({error:'Роли не найдены'});
          }
        res.json(getProject.rows)
    }
    async getOneMembersRoles(req,res){
        const id = req.params.id
        const getProject =  await db.query(`SELECT * FROM projectmembers WHERE "MemberID" = $1`,[id])
        if (getProject.length < 1) {
            return  res.status(400).json({error:'Роль не найдена'});
          }
        res.json(getProject.rows)
    }
    async updateAllRole(req,res){
        const  {projectID,userID,role,id} = req.body
        const checkIdRole = await db.query('SELECT * FROM projectmembers  WHERE "MemberID" = $1', [id]);
        if (checkIdRole.rows.length < 1) {
          return  res.status(400).json({error:'Проекта с таким  id не существует. Пожалуйста, выберите другой id.'});
        }
        const checkprojectID = await db.query('SELECT * FROM projects WHERE "ProjectID" = $1', [projectID]);
        if (checkprojectID.rows.length < 1) {
          return  res.status(400).json({error:'Проекта с таким именем не существует. Пожалуйста, выберите другое имя.'});
        }
        const checkUser = await db.query('SELECT * FROM users WHERE "UserID" = $1', [userID]);
        if (checkUser.rows.length < 1) {
          return  res.status(400).json({error:'Пользователя с таким именем не существует. Пожалуйста, выберите другое пользователя.'});
        }

        const updateAll = await db.query(
            `UPDATE projectmembers set "ProjectID" = $1,"UserID" = $2,"Role"=$3  WHERE "MemberID" = $4 RETURNING * `,
            [projectID,userID,role,id] 
            )

        res.json(updateAll.rows)
    }
    async updateRole(req,res){
        const  {role,id} = req.body
        const checkIdRole = await db.query('SELECT * FROM projectmembers  WHERE "MemberID" = $1', [id]);
        if (checkIdRole.rows.length < 1) {
          return  res.status(400).json({error:'Проекта с таким  id не существует. Пожалуйста, выберите другой id.'});
        }

        const updateRole = await db.query(
            `UPDATE projectmembers set "Role"=$1  WHERE "MemberID" = $2 RETURNING * `,
            [role,id] 
            )

        res.json(updateRole.rows)
    }
    async deleteRole(req,res){
        const  {id} = req.body
        const checkIdRole = await db.query('SELECT * FROM projectmembers  WHERE "MemberID" = $1', [id]);
        if (checkIdRole.rows.length < 1) {
          return  res.status(400).json({error:'Проекта с таким  id не существует. Пожалуйста, выберите другой id.'});
        }
        const deleteRole = await db.query(
            `DELETE FROM projectmembers WHERE "MemberID" = $1 RETURNING * `,
            [id] 
            )

        res.json('Роль удалена!')
    }
    
}
module.exports = new ProjectMembersContoroller()