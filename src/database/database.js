import mysql from "promise-mysql";


const connection = mysql.createConnection({
    host: 'us-cdbr-east-06.cleardb.net',
    database: 'heroku_82126c3793c614f',
    user: 'b9a2eda7bbbdcb',
    password: '8922264a'
});

const getConnection = () => {
    return connection;
};

module.exports = {
    getConnection
};

