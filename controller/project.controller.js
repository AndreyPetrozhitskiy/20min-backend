const db  = require("../db.js")

class ProjectContoroller {
    async createProject(req,res){
        const  {name,description,figma,git,photo,creatorUser} = req.body
        const newProject = await db.query(
            `INSERT INTO projects 
            ("NameProject","DescriptionProject","LinkFigma","LinkGit","PhotoProject","CreatorUserID" ) 
            values ($1, $2, $3, $4, $5, $6)  
            RETURNING *  `, 
            [name,description,figma,git,photo,creatorUser]
            )
        
        res.json(newProject.rows[0])

        // console.log(name,description,figma,git,photo,creatorUser)
        // res.json("Vse gud")
    }
    async getProject(req,res){
        const getProject =  await db.query(`SELECT * FROM projects `)
        
        res.json(getProject.rows)
    }
    async getOneProject(req,res){
        const id = req.params.id
        const getProject =  await db.query(`SELECT * FROM projects WHERE "ProjectID" = $1`,[id])
       
        res.json(getProject.rows)
    }
    async updateProjectName(req,res){
        const  {id,name} = req.body
        const updateName = await db.query(
            `UPDATE projects set "NameProject" = $1  WHERE "ProjectID" = $2 RETURNING * `,
            [name,id] 
            )

        res.json(updateName.rows)
    }
    async updateProjectDescription(req,res){
        const  {id,description} = req.body
        const updateDescription = await db.query(
            `UPDATE projects set "DescriptionProject" = $1  WHERE "ProjectID" = $2 RETURNING * `,
            [description,id] 
            )

        res.json(updateDescription.rows)
    }
    async updateProjectLinkFigma(req,res){
        const  {id,figma} = req.body
        const updateLinkFigma = await db.query(
            `UPDATE projects set "LinkFigma" = $1  WHERE "ProjectID" = $2 RETURNING * `,
            [figma,id] 
            )

        res.json(updateLinkFigma.rows)
    }
    async updateProjectLinkGit(req,res){
        const  {id,git} = req.body
        const updateLinkGit = await db.query(
            `UPDATE projects set "LinkGit" = $1  WHERE "ProjectID" = $2 RETURNING * `,
            [git,id] 
            )

        res.json(updateLinkGit.rows)
    }
    async updateProjectPhoto(req,res){
        const  {id,photo} = req.body
        const updatePhoto = await db.query(
            `UPDATE projects set "PhotoProject" = $1  WHERE "ProjectID" = $2 RETURNING * `,
            [photo,id] 
            )

        res.json(updatePhoto.rows)
    }
    async updateProjectStatus(req,res){
        const  {id,status} = req.body
        const updateStatus = await db.query(
            `UPDATE projects set "Status" = $1  WHERE "ProjectID" = $2 RETURNING * `,
            [status,id] 
            )

        res.json(updateStatus.rows)
    }
    async updateProjectVisibility(req,res){
        const  {id,visibility} = req.body
        const updateVisibility = await db.query(
            `UPDATE projects set "Visibility" = $1  WHERE "ProjectID" = $2 RETURNING * `,
            [visibility,id] 
            )

        res.json(updateVisibility.rows)
    }
    async deleteProject(req,res){
        const  {id} = req.body
        const deleteProject = await db.query(
            `DELETE FROM projects WHERE "ProjectID" = $1 RETURNING * `,
            [id] 
            )

        res.json('Запись удалена!')
    }
}
module.exports = new ProjectContoroller()