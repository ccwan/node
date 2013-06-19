
var dbConn = require('./dbConn');
var uuid = require('node-uuid');
var nodemailer = require('nodemailer');

var transport = nodemailer.createTransport("sendmail", {
    path: "/usr/sbin/sendmail"
});

exports.create = function(req, res){
  var user = req.body;
  if (!(user.firstName && user.lastName && user.phoneNumber 
        && user.email && user.passwd)) {
  	res.send(400, 'registration need more param');
  	return;
  }
  
	dbConn.conn.query('select * from tbl_user where email= ?', 
	             [user.email], function (err, results) {
    if (err) {
      throw err;
      res.send(500);
      return;
    }
    
    if (results[0]) {
    	res.send(400, "user existed");
      return;
    }

    user.api_key = uuid.v1();
		user.veri_code = uuid.v4();
		user.status = 'new';
		
		dbConn.conn.query('insert into tbl_user SET ?', user, function (err, results) {
	    if (err) {
	      res.send(500);
	      throw err;
	      return;
	    }

			var mailOptions = {
			    from: "admin@cloud.sychip.com.cn",
			    to: user.email,
			    subject: "verify you account on sychip cloud!",
			    text: "http://10.3.1.101:9090/user/" 
			          + results.insertId + "/verification?code=" + user.veri_code
			};
			transport.sendMail(mailOptions);
	    
    	res.send(200);
	  	console.log("created id=" + results.insertId);
	  });
  });
};

exports.verify = function(req, res){
	dbConn.conn.query('select id from tbl_user where id = ? and veri_code = ?', 
	             [req.params.id, req.params.code], function (err, results) {
    if (err) {
      res.send(500);
      throw err;
      return;
    }
    
	  dbConn.conn.query('update tbl_user SET status = ? where id = ?', 
	             ['verified', req.params.id], function (err, results) {
	    if (err) {
	      res.send(500);
	      throw err;
	      return;
	    }
      res.send("Thanks for registration! Your user id is " + req.params.id);
    });    
  });
};

exports.login = function(req, res){
	var email = req.body.email;
	var passwd = req.body.passwd;
	
	if (!email || !passwd) {
 		res.send(400, "param error");
 		return;
	}	
	else {
		dbConn.conn.query('select id, passwd, status from tbl_user where email=?', 
		             [email], function (err, results) {
	    if (err) {
        res.send(500);
	      throw err;
	      return;
	    }
	    if (!results[0]) {
    		res.send(403, "user account not exist");
    		return;
    	}
	    	
    	if (results[0].passwd != passwd) {
    		res.send(403, "password error");
    		return;
    	}
    	
    	if (results[0].status == 'new') {
    		res.send(403, "need verify");
    	}
    	
  		dbConn.conn.query('update tbl_session SET user_id = ? where id = ?', 
  		  [results[0].id, req.session.dbid],
			  function (err, results) {
			    if (err) throw err;
          res.send(200);
			  });
			console.log('login session uid=' + results[0].id + ',dbid=' + req.session.dbid);
		});		
	}
};

exports.logout = function(req, res){
	dbConn.conn.query('update tbl_session SET user_id = ? where id = ?', 
	  [0, req.session.dbid],
	  function (err, results) {
	    if (err) throw err;
      res.send(200);
	  });
	console.log('logout session dbid=' + req.session.dbid);
};

exports.view = function(req, res){
	if (req.session.uid == 0) {
		res.send(403, "need login");
		return;
	}
	
	dbConn.conn.query('select * from tbl_user where id=?', [req.session.uid], function (err, results) {
	  if (err) {
	  	throw err;
	  	res.send(500, "user not found");
	  	return;
	  }
	  if (results[0]) {
      delete results[0].id;
	  	delete results[0].veri_code;
	  	delete results[0].passwd;
	  	
      res.send(200, JSON.stringify(results[0]));
	  }
	  else {
	  	res.send(500, "user not found");
	  }
	});
};

exports.update = function(req, res){
	if (req.session.uid == 0) {
		res.send(200, "need login");
		return;
	}
  
  var rb = req.body;
	var queryStr = 'update tbl_user SET ';
	if (rb.firstName) queryStr += 'firstName = ' + rb.firstName + ',';
	if (rb.lastName) queryStr += 'lastName = ' + rb.lastName + ',';
	if (rb.phoneNumber) queryStr += 'phoneNumber = ' + rb.phoneNumber + ',';
	if (rb.passwd) queryStr += 'passwd = ' + rb.passwd + ',';	
	queryStr = substring(queryStr, 0, strlen(queryStr)-1);
	
	dbConn.conn.query(queryStr, [0, req.session.dbid], function (err, results) {
	  if (err) {
	  	throw err;
      res.send(500);
    }
    else {
    	res.send(200);
    }
	});
};
