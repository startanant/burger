const mysql = require("mysql");

class Database {
    constructor( config ) {
        this.connection = mysql.createConnection( config );
    }
    query( sql, args=[] ) {
        return new Promise( ( resolve, reject ) => {
            this.connection.query( sql, args, ( err, rows ) => {
                if ( err )
                    return reject( err );
                resolve( rows );
            } );
        } );
    }
    close() {
        return new Promise( ( resolve, reject ) => {
            this.connection.end( err => {
                if ( err )
                    return reject( err );
                resolve();
            } );
        } );
    }
}

// at top INIT DB connection
var db;
if(process.env.JAWSDB_URL){
     db = new Database(process.env.JAWSDB_URL);
     console.log('jaws db is connected');
}else{
     db = new Database({
        host: "localhost",
        port: 3306,
        user: "root",
        password: "mysqlmysql", 
        database: "burgers_db"
    });
};

async function saveBurgerName(userBurger){
    const burgerSqlSave = await db.query("INSERT INTO burgers(name) VALUES(?)", [userBurger.name]);
    console.log(burgerSqlSave[0]);
}

async function getBurgerName(){
    const getBurgerNameSql = await db.query("SELECT * FROM burgers wHERE devoured=0");
    console.log(getBurgerNameSql);
    return getBurgerNameSql;
}

async function devouredBurger(burgerId){
    const updateBurgerState = await db.query("UPDATE burgers SET devoured=? WHERE id=?", [true, burgerId]);
    console.log("Burger state updated")
    console.log(updateBurgerState);
}

async function getdevourededBurger(){
    const getBurger = await db.query("SELECT * FROM burgers WHERE devoured=1");
    console.log("Got Burger devoured");
    return getBurger;
}
async function deletedevourededBurger(id){
    const deleteBurger = await db.query("DELETE FROM burgers WHERE id=? AND devoured=1" , [id]);
    console.log("Burger devoured deleted");
    return deleteBurger;
}

module.exports = {
    saveBurgerName,
    getBurgerName,
    devouredBurger,
    getdevourededBurger,
    deletedevourededBurger
}