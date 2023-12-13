const db  = require("../db.js")

class UserContoroller {
    async createUser(req,res){
        const  {name,password} = req.body
        const newUser = await db.query(`INSERT INTO users (username,password) values ($1, $2)  RETURNING *  `, [name,password])
        
        res.json(newUser.rows[0])
    }
    async getUser(req,res){
        const getUsers =  await db.query(`SELECT * FROM users `)
        
        res.json(getUsers.rows)
    }
    async getOneUser(req,res){
        console.log('Request body:', req.params);
        const id = req.params.id
        console.log('Received data:', id);
        const getUsers =  await db.query(`SELECT * FROM users WHERE "UserID" = $1`,[id])
       
        res.json(getUsers.rows)
    }
    async updateUserName(req,res){
        const  {id,name} = req.body
        const updateUser = await db.query(
            `UPDATE users set username = $1  WHERE "UserID" = $2 RETURNING * `,
            [name,id] 
            )

        res.json(updateUser.rows)
    }
    async updateUserPassword(req, res) {
        const { id, password } = req.body;
        const updateUser = await db.query(
          'UPDATE users SET password = $1 WHERE "UserID" = $2 RETURNING *',
          [password, id]
        );
      
        res.json(updateUser.rows);
      }
}
module.exports = new UserContoroller()