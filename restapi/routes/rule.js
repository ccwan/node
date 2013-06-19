var dbConn = require('./dbConn');

exports.create = function(req, res){
  var rule = req.body;
	
	if (req.session.uid == 0) {
		res.send(403, "need login");
		return;
	}
		
  if (!(rule.scheduler_id && rule.trigger_id && rule.action_id)) {
  	res.send(400);
  	return;
  }  		

 	dbConn.conn.query('insert into tbl_rule SET ?', rule, function (err, results) {
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

 	dbConn.conn.query('select * from tbl_rule where user_id = ?', req.session.uid, 
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


