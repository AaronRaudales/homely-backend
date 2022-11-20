import mysql from "promise-mysql";


const connection = mysql.createConnection({
    host: 'localhost',
    database: 'homely',
    user: 'root',
    password: '1234'
});

const getConnection = () => {
    return connection;
};

module.exports = {
    getConnection
};

