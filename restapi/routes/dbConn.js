var mysql = require('mysql');

var dbConn = new Object();

var conn = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'sychip',
  database : 'restapi'
});

dbConn.conn = conn;

var errFunc = function(err) {
  if(err) {  
      console.error('connect db error: ' + err);  
      process.exit();  
  }  
};

function handleDisconnect(conn1) {
  conn1.on('error', function(err) {
    if (!err.fatal) {
      return;
    }

    if (err.code !== 'PROTOCOL_CONNECTION_LOST') {
      throw err;
    }

    console.log('Re-connecting lost connection: ' + err.stack);

    conn = mysql.createConnection(conn.config);
    handleDisconnect(conn);
    conn.connect(errFunc);
    dbConn.conn = conn;
  });
}  

handleDisconnect(conn);

conn.connect(errFunc);

module.exports = dbConn;
