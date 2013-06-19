
var dbConn = require('./dbConn');

exports.list = function(req, res){
	dbConn.conn.query('select * from tbl_deviceType', function (err, results) {
	  if (err) {
	  	throw err;
	  	res.send(500, "model db error");
	  	return;
	  }
    res.send(200, JSON.stringify(results));
	});
};

