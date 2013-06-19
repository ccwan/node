var dbConn = require('./dbConn');

exports.create = function(req, res){
  var trigger = req.body;
	
	if (req.session.uid == 0) {
		res.send(403, "need login");
		return;
	}
		
  if (!(trigger.device_id && trigger.cmdName)) {
  	res.send(400);
  	return;
  }  		

 	dbConn.conn.query('insert into tbl_triggerion SET ?', trigger, function (err, results) {
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

 	dbConn.conn.query('select * from tbl_triggerion where user_id = ?', req.session.uid, 
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

