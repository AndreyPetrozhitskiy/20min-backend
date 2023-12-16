const Pool = require('pg').Pool
const pool = new Pool(
    {   
        // DEV

        user:"postgres",
        password: "159357",
        host:'localhost',
        port: 5432 ,
        database: "back-minute20"



        // PRODUCTION

        // user:"developer",
        // password: "testpassword",
        // host:'localhost',
        // port: 5432 ,
        // database: "minute20"
    }
)


module.exports = pool