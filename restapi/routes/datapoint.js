
var dbConn = require('./dbConn');

exports.create = function(req, res){
  var datapoint = req.body;
	
	if (req.apikey.uid == 0) {
		res.send(403);
		return;
	}
		
  if (!(datapoint.uuid && datapoint.data_key && datapoint.data_value)) {
  	res.send(400);
  	return;
  }  		
  
 	dbConn.conn.query('select * from tbl_device where uuid = ? and user_id = ?', 
 	             [datapoint.uuid + "", req.apikey.uid], function (err, results) {
    if (err) {
      res.send(500);
      throw err;
      return;      
    }
    
    if (!results[0]) {
      res.send(403);
      return;      
    }

    datapoint.device_id = results[0].id;
    delete datapoint.uuid;
    
	 	dbConn.conn.query('insert into tbl_datapointStore SET ?', datapoint, function (err, results) {
	    if (err) {
	      throw err;
	    }
	  });
	  
	  // tbd : query rule table to do something.
	  
		dbConn.conn.query('select * from tbl_datapointCache where device_id =? and data_key = ?', 
		             [datapoint.device_id, datapoint.data_key], function (err, results) {
	    if (err) {
	      res.send(500);
	      throw err;
	      return;
	    }

    	if (!results[0]) {
				dbConn.conn.query('insert into tbl_datapointCache SET ?', datapoint, function (err, results) {
			    if (err) {
			      res.send(500);
			      throw err;
			    }
			    else {
			    	res.send(200);
	  				console.log("created datapoint id=" + results.insertId);
	  			}
	  		});
		  }
		  else {
				dbConn.conn.query('update tbl_datapointCache SET data_value = ? '
				             + 'where device_id = ? and data_key = ?', 
				             [datapoint.data_value, datapoint.device_id, datapoint.data_key], function (err, results) {
			    if (err) {
			      res.send(500);
			      throw err;
			    }
			    else {
			    	res.send(200);
	  				console.log("created datapoint id=" + results.insertId);
	  			}
	  		});
		  }
	  });
  });
};
	
exports.list = function(req, res){
	
	if (req.session.uid == 0) {
		res.send(403, "need login");
		return;
	}

	var start = Math.floor(Date.parse(req.query.start)/1000) || 0;
	var end = Math.floor(Date.now()/1000);
	var maxPerPage = req.query.maxPerPage || 50;
	var page = req.query.page || 1;

	var interval = req.query.interval || 'second';
	switch(interval) {
		case 'month':
		  interval = '%Y-%m';
		  break;
		case 'day':
		  interval = '%Y-%m-%d';  
		  break;
		case 'hour':
		  interval = '%Y-%m-%d %H';
		  break;
		case 'min': 
		  interval = '%Y-%m-%d %H:%M';
		  break;
		default:
		  interval = null;		
	}
	
	console.log(start);
	console.log(end);
	console.log(maxPerPage);
	console.log(page);
	
 	dbConn.conn.query('select * from tbl_device where id = ? and user_id = ?', 
 	             [req.params.id , req.session.uid], function (err, results) {
    if (err) {
      res.send(500);
      throw err;
      return;      
    }
    
    if (!results[0]) {
      res.send(403);
      return;      
    }

	
		if (start == 0) {
			query_str = 'select * from tbl_datapointCache where device_id= ' + req.params.id;
		}
		else {
			query_str = 'select * from tbl_datapointStore where device_id= ' + req.params.id
			           + ' and UNIX_TIMESTAMP(timestamp) > ' + start 
			           + ' and UNIX_TIMESTAMP(timestamp) < ' + end ;
		}
		
		if (interval) {
			query_str += ' group by date_format(timestamp, \'' + interval + '\')';
		}
			console.log(query_str);
		dbConn.conn.query(query_str, function (err, results) {
	    if (err) {
	      res.send(500);
	      throw err;
	    }
	    else {
	    	res.send(200, JSON.stringify(results));
	    }
	  });
  });
};

