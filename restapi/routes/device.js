
var dbConn = require('./dbConn');

exports.create = function(req, res){
  console.log(req.apikey);

  var device = req.body;

  if (req.apikey.uid > 0) {
		device.user_id = req.apikey.uid;
	}
	
	if (!device.user_id) {
		res.send(403);
		return;
	}
		
  if (!(device.uuid && device.title && device.nwkIf_uuid && device.model_id)) {
  	res.send(400, "missing parameters");
  	return;
  }  		
		
	dbConn.conn.query('select id from tbl_nwkIf where uuid = ? and user_id = ?', 
	             [device.nwkIf_uuid, device.user_id], function (err, results) {
    if (err) {
      res.send(500);
      throw err;
      return;
    }
  	if (!results[0]) {
  		res.send(403, "nwkIf and user mismatch");
  	  return;
    }
    device.nwkIf_id = results[0].id;
    delete device.nwkIf_uuid;
		dbConn.conn.query('select * from tbl_device where uuid= ? and user_id = ?', 
		             [device.uuid, device.user_id], function (err, results) {
	    if (err) {
	      res.send(500);
	      throw err;
	      return;
	    }
	    if (results[0]) {
	    	res.send(400, "device existed");
	      return;
	    }
			dbConn.conn.query('insert into tbl_device SET ?', device, function (err, results) {
		    if (err) {
		      res.send(500);
		      throw err;
		    }
		    else {
		    	res.send(200);
			  	console.log("created device id=" + results.insertId);
		    }
		  });    	
    });
  });
};
	
exports.list = function(req, res){
	if (req.session.uid == 0) {
		res.send(403, "need login");
		return;
	}
	
	dbConn.conn.query('select * from tbl_device where user_id= ?', [req.session.uid], function (err, results) {
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
	if (req.session.uid == 0) {
		res.send(403, "need login");
		return;
	}
	
	dbConn.conn.query('select * from tbl_device where user_id= ? and id = ?', 
	            [req.session.uid, req.params.id], function (err, results) {
    if (err) {
      res.send(500);
      throw err;
    }
    else {
    	res.send(200, JSON.stringify(results));
    }
  });
};

exports.update = function(req, res){
	if (req.session.uid == 0) {
		res.send(403, "need login");
		return;
	}
	
	if (req.body.title) {	
		dbConn.conn.query('update tbl_device set title = ? where user_id = ? and id = ?', 
	            [req.body.title, req.session.uid, req.params.id], function (err, results) {
    	if (err) {
      	res.send(500);
      	throw err;
    	}
    	else {
    		res.send(200);
	    }
	  });
	}
};

exports.delete = function(req, res){
  res.send("5");
};
