var mysql = require('mysql');

module.exports = Serial;  
 
function Serial() {  
  this.action_buf = new Array();
  this.result_buf = new Array();
  this.interval = 60;
  
	var conn = mysql.createConnection({
	  host     : 'localhost',
	  user     : 'root',
	  password : 'sychip',
	  database : 'midea'
	});
	
	function handleDisconnect(conn1) {
	  conn1.on('error', function(err) {
	    if (!err.fatal) {
	      return;
	    }
	
	    if (err.code !== 'PROTOCOL_CONNECTION_LOST') {
	      throw err;
	    }
	
	    console.log('Re-connecting lost connection: ' + err.stack);
	
	    conn = mysql.createConnection(conn.config);
	    handleDisconnect(conn);
	    conn.connect();
	  });
	}  
	
	handleDisconnect(conn);

	conn.connect(function(err) {
    if(err) {  
        console.error('connect db error: ' + err);  
        process.exit();  
    }  
  });
   
/*  
  conn.query('DROP TABLE tbl_log');
  conn.query('CREATE TABLE tbl_log ' +
    '(id int(8) auto_increment not null primary key, ' +
    'caller varchar(32) not null, ' + 
    'url varchar(256), ' +
    'req varchar(256), ' +
    'resp varchar(256), ' +
    'ts timestamp)'); 
*/  
  var self = this;
  return {    
    postAction: function(request, response){
      var action = request.body; 
      action.id = parseInt(action.id);
      self.action_buf.push(action);

		  conn.query('insert into tbl_log ' +
		    'set caller=?, url=?, req=? ',
		    ['postAction', request.originalUrl, JSON.stringify(action)]);

      response.writeHead(200, {"Content-Type": "application/json"});
      response.end();
    },
     
    getAction : function(request, response){
      var getResp = response;
      getResp.writeHead(200, {"Content-Type": "application/json"});
      var action = self.action_buf.shift();
      if (typeof(action) != "undefined") {
        if (self.action_buf.length > 0) {
          action.interval = 0;
        }
      }
      else {
      	action = new Object;
      	action.interval = self.interval;
      }

		  conn.query('insert into tbl_log ' +
		    'set caller=?, url=?, resp=? ',
		    ['getAction', request.originalUrl, JSON.stringify(action)]);

      getResp.write(JSON.stringify(action));
      getResp.end();
      return;
    },
    
    postResult: function(request, response){
      var result = request.body;
      self.result_buf.push(result);
		  conn.query('insert into tbl_log ' +
		    'set caller=?, url=?, req=? ',
		    ['postResult', request.originalUrl, JSON.stringify(result)]);
      response.writeHead(200, {"Content-Type": "application/json"});
      response.end();
    },
     
    getResult : function(request, response){
      var getResp = response;
      getResp.writeHead(200, {"Content-Type": "text/json"});
      var result = self.result_buf.shift();
      if (typeof(result) != "undefined") {
        if (self.result_buf.length > 0) {
          result.has_more = true;
        }
      }
      else {
      	result = new Object;
      	result.resp = "empty";
      }	
      getResp.write(JSON.stringify(result));
		  conn.query('insert into tbl_log ' +
  	    'set caller=?, url=?, resp=? ',
        ['getResult', request.originalUrl, JSON.stringify(result)]);
      getResp.end();
      return;
    },    
    getLog : function(request, response){
      var getResp = response;
		  conn.query('select * from tbl_log ', function (err, results) {
		    if (err) {
		      throw err;
          getResp.render('log',{status: 500, title:'Test Page'});
		    }
		    else {
//		    	console.log(results);
          getResp.render('log',{status: 200, title:'Log Page', data: results});
        }
		  });
      return;
    },
    clearLog : function(request, response){
      var getResp = response;
		  conn.query('delete from tbl_log ', function (err, results) {
		    if (err) {
		      throw err;
          getResp.writeHead(500, {"Content-Type": "application/json"});
		    }
		    else {
//		    	console.log(results);
          getResp.writeHead(200, {"Content-Type": "application/json"});
        }
        getResp.end();
		  });
      return;
    },
    getInterval : function(request, response){
      var getResp = response;
      getResp.writeHead(200, {"Content-Type": "text"});
      getResp.write(self.interval.toString());
      getResp.end();
      return;
    },    
    postInterval : function(request, response){
      var getResp = response;
      var newValue = parseInt(request.body.interval);
      if (isNaN(newValue)) {
        getResp.writeHead(401, {"Content-Type": "text"});
      }
      else {
      	self.interval = newValue;
        getResp.writeHead(200, {"Content-Type": "text"});
      }
      getResp.end();
      return;
    },
  };  
  
}  

