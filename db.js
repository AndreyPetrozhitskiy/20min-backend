const Pool = require('pg').Pool
const pool = new Pool(
    {
        user:"developer",
        password: "testpassword",
        host:'localhost',
        port: 5432 ,
        database: "minute20"
    }
)


module.exports = pool