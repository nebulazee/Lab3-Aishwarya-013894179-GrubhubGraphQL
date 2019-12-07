var mysql = require('mysql');

var pool = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'grubhub_owner',
    port: '3306',
    password: 'hanumanji7',
    database: 'GRUBHUB_DB'
})

module.exports.pool=pool;