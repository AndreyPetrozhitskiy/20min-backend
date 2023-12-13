const Pool = require('pg').Pool
const pool = new Pool(
    {
        user:"postgres",
        password: "159357",
        host:'localhost',
        port: 5432 ,
        database: "back-minute20"
    }
)


module.exports = pool