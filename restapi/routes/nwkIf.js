
var dbConn = require('./dbConn');

exports.create = function(req, res){
	var nwkIf = new Object();
	
	if (req.session.uid == 0){
		res.send(403);
		return;
	}
  
  nwkIf.user_id = req.session.uid;
  nwkIf.uuid = req.params.uuid;			
  
  if (!nwkIf.uuid) {
  	res.send(400);
  	return;
  }  		
		
	dbConn.conn.query('select * from tbl_nwkIf where uuid = ?', [nwkIf.uuid], function (err, results) {
    if (err) {
      res.send(500);
      throw err;
      return;
    }
    else {
    	if (results[0]) {
    		res.send(400, "uuid existed");
    	  return;
    	}
	    dbConn.conn.query('insert into tbl_nwkIf SET ?', nwkIf, function (err, results) {
		    if (err) {
		      res.send(500);
		      throw err;
		    }
		    else {
		    	res.send(200);
			  	console.log("created nwkif id=" + results.insertId);
		    }
		  });
    }
  });
};
	
exports.list = function(req, res){
	if (req.session.uid == 0) {
		res.send(403);
		return;
	}
	
	dbConn.conn.query('select * from tbl_nwkIf where user_id = ?', 
	            [req.session.uid], function (err, results) {
    if (err) {
      res.send(500);
      throw err;
    }
    else {  
    	res.send(200, JSON.stringify(results));
    }
  });
};

exports.view = function(req, res){
	if (req.apikey.vid == 0) {
		res.send(403);
		return;
	}
	
	dbConn.conn.query('select api_key from tbl_user where id = '
	             + '(select user_id from tbl_nwkIf where uuid = ?)', 
	            [req.params.uuid], function (err, results) {
    if (err) {
      res.send(500);
      throw err;
    }
    else {    	
    	res.send(200, JSON.stringify(results));
    }
  });
};

exports.delete = function(req, res){
  res.send("5");
};
