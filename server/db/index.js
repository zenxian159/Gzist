const mysql2 = require("mysql2");

// 创建链接池
const config = getDBConfig();
const promisePool = mysql2.createPool(config).promise();

// console.log(promisePool);
if (promisePool) {
  console.log("数据库连接成功");
}

module.exports = promisePool;

function getDBConfig() {
  return {
    host: "127.0.0.1",
    user: "root",
    port: "3307",
    password: "123456",
    database: "gzist_service_db",
    connectionLimit: 1, // 连接池中连接的数量
  };
}

