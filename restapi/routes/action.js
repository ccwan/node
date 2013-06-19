var dbConn = require('./dbConn');

exports.create = function(req, res){
  var act = req.body;
	
	if (req.session.uid == 0) {
		res.send(403, "need login");
		return;
	}
		
  if (!(act.device_id && act.handler && act.params)) {
  	res.send(400);
  	return;
  }  		

 	dbConn.conn.query('insert into tbl_action SET ?', act, function (err, results) {
    if (err) {
      res.send(500);
      throw err;
    }
    else {
    	res.send(200);
    }
  });
};
	
exports.list = function(req, res){
	
	if (req.session.uid == 0) {
		res.send(403, "need login");
		return;
	}

 	dbConn.conn.query('select * from tbl_action where user_id = ?', req.session.uid, 
 	             function (err, results) {
    if (err) {
      res.send(500);
      throw err;
    }
    else {
    	res.send(200);
    }
  });
    
};

