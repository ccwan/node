
var dbConn = require('./dbConn');

exports.create = function(req, res){
  var model = req.body;
  if (!model.name) {
  	res.send(400, 'no model name');
  	return;
  }
  
	dbConn.conn.query('insert into tbl_model SET ?', model, function (err, results) {
    if (err) {
      res.send(500);
      throw err;
      return;
    }
  	res.send(200, "{\"id\": " + results.insertId + "}");
  	console.log("created model id=" + results.insertId);
  });
};

exports.list = function(req, res){
	dbConn.conn.query('select * from tbl_model', function (err, results) {
	  if (err) {
	  	throw err;
	  	res.send(500, "model db error");
	  	return;
	  }
    res.send(200, JSON.stringify(results));
	});
};

exports.view = function(req, res){
	dbConn.conn.query('select * from tbl_model where id = ?', 
	             [req.params.id], function (err, results) {
	  if (err) {
	  	throw err;
	  	res.send(500, "model db error");
	  	return;
	  }
    res.send(200, JSON.stringify(results));
	});
};

