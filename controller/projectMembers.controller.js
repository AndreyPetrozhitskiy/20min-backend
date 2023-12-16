const db  = require("../db.js")


class ProjectMembersContoroller {
    async createMembersRoles(req,res){
        const  {project,user,role} = req.body
        const newRole = await db.query(
            `INSERT INTO projectmembers 
            ("ProjectID","UserID","Role" ) 
            values ($1, $2, $3)  
            RETURNING *  `, 
            [project,user,role]
            )
    
        res.json(newRole.rows[0])
    }
    async getMembersRoles(req,res){
        const getProject =  await db.query(`SELECT * FROM projectmembers `)
        
        res.json(getProject.rows)
    }
    async getOneMembersRoles(req,res){
        const id = req.params.id
        const getProject =  await db.query(`SELECT * FROM projectmembers WHERE "MemberID" = $1`,[id])
       
        res.json(getProject.rows)
    }
    async updateAllRole(req,res){
        console.log('Request body:', req.body);
        const  {project,user,role,id} = req.body
        console.log('Received data:', project,user,role,id);
        const updateAll = await db.query(
            `UPDATE projectmembers set "ProjectID" = $1,"UserID" = $2,"Role"=$3  WHERE "MemberID" = $4 RETURNING * `,
            [project,user,role,id] 
            )

        res.json(updateAll.rows)
    }
    async updateRole(req,res){
        console.log('Request body:', req.body);
        const  {role,id} = req.body
        console.log('Received data:', role,id);
        const updateRole = await db.query(
            `UPDATE projectmembers set "Role"=$1  WHERE "MemberID" = $2 RETURNING * `,
            [role,id] 
            )

        res.json(updateRole.rows)
    }
    async deleteRole(req,res){
        const  {id} = req.body
        const deleteRole = await db.query(
            `DELETE FROM projectmembers WHERE "MemberID" = $1 RETURNING * `,
            [id] 
            )

        res.json('Роль удалена!')
    }
    
}
module.exports = new ProjectMembersContoroller()