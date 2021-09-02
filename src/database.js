const mysql = require('mysql');

const { promisify }= require('util');

const database = {
  connectionLimit: 5,
  host: 'blohtopopjwq2buo0ymr-mysql.services.clever-cloud.com',
  user: 'u7xc3gs6bzbzchkc',
  password: 'pW7k16FqwwWJjWKF0RbB',
  database: 'blohtopopjwq2buo0ymr'
}

// const database = {
//   connectionLimit: 10,
//   host: 'localhost',
//   user: 'root',
//   password: '',
//   database: 'operatoriaweb'
// }

const pool = mysql.createPool(database);

pool.getConnection((err, connection) => {
  if (err) {
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
      console.error('Database connection was closed.');
    }
    if (err.code === 'ER_CON_COUNT_ERROR') {
      console.error('Database has to many connections');
    }
    if (err.code === 'ECONNREFUSED') {
      console.error('Database connection was refused');
    }
  }

  if (connection) connection.release();
  console.log('DB is Connected');

  return;
});

// Promisify Pool Querys
pool.query = promisify(pool.query);

module.exports = pool;