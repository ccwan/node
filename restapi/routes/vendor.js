
var dbConn = require('./dbConn');
var uuid = require('node-uuid');

exports.create = function(req, res){
  var vendor = req.body;
  if (!vendor.name) {
  	res.send(400, 'no vendor name');
  	return;
  }
  
  vendor.api_key = uuid.v1();
  
	dbConn.conn.query('insert into tbl_vendor SET ?', vendor, function (err, results) {
    if (err) {
      res.send(500);
      throw err;
      return;
    }
  	res.send(200, JSON.stringify(vendor));
  	console.log("created vendor id=" + results.insertId);
  });
};

exports.list = function(req, res){
	dbConn.conn.query('select * from tbl_vendor', function (err, results) {
	  if (err) {
	  	throw err;
	  	res.send(500, "vendor db error");
	  	return;
	  }
    res.send(200, JSON.stringify(results));
	});
};

