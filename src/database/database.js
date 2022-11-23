import mysql from "promise-mysql";
const {createPool} = require("mysql");


const connection = mysql.createPool({
    host: 'us-cdbr-east-06.cleardb.net',
    database: 'heroku_834748982488d10',
    user: 'b94b81efa9bac6',
    password: '8a6898cf'
});

const getConnection = () => {
    return connection;
};

module.exports = {
    getConnection
};

