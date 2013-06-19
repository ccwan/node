
var dbConn = require('./dbConn');

exports.authen = function(req, res, next){
	req.apikey = new Object();
	req.apikey = {uid: 0, vid: 0};
	
  req.session.sid = 0;  // this is session id issued by node
  req.session.uid = 0;  // this is user id login from session
  req.session.dbid = 0; // this is the id in tbl_session
  
  var api_key = req.get('api_key');
  var vendor_key = req.get('vendor_key');

  if (api_key) {
  	console.log('found api key:' + api_key);
	  dbConn.conn.query('select * from tbl_user where api_key=?', 
	               [api_key], function (err, results) {
	    if (err) { 
	    	throw err; 
	    	res.send(500);
	    	return;
	    }
    	if (results[0]) {
     		req.apikey.uid = results[0].id;
    		console.log('uid=' + req.apikey.uid);
    	}
 		  next();
  	});
  }
  else if (vendor_key) {
  	console.log('found api key:' + vendor_key);
	  dbConn.conn.query('select * from tbl_vendor where api_key=?', 
	               [vendor_key], function (err, results) {
	    if (err) { 
	    	throw err; 
	    	res.send(500);
	    	return;
	    }
    	if (results[0]) {
    		req.apikey.vid = results[0].id;
    		console.log('vid=' + req.apikey.vid);
    	}    	
 		  next();
  	});  	
  }
  else if (typeof req.signedCookies['connect.sid'] !== 'undefined'){
	  req.session.sid = req.signedCookies['connect.sid'];
	  console.log('found sid' + req.session.sid);
	  dbConn.conn.query('select * from tbl_session where sessionId=?', 
	               [req.session.sid], function (err, results) {
	    if (err) { 
	    	throw err; 
	    	res.send(500);
	    	return;
	    }
    	if (results[0]) {
  			req.session.uid = results[0].user_id;
  			req.session.dbid = results[0].id;
    	  console.log('exists in db uid=' + req.session.uid + ',dbid=' + req.session.dbid);
   		  next();
    	}
    	else {
    		dbConn.conn.query('insert into tbl_session SET user_id = ?, sessionId = ?', 
    		              [0, req.session.sid], function (err, results) {
			    if (err) { 
			    	throw err; 
			    	res.send(500);
			    	return;
			    }
		    	req.session.dbid = results.insertId;
			    req.session.uid = 0;
      	  console.log('insert in db uid=' + req.session.uid + ',dbid=' + req.session.dbid);
	   		  next();
	    	});
	    }
	  });
	}
	else {
	  next();
	}
};


