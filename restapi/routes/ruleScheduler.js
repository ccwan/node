var dbConn = require('./dbConn');

exports.create = function(req, res){
  var scheduler = req.body;
	
	if (req.session.uid == 0) {
		res.send(403, "need login");
		return;
	}
		
  if (!(scheduler.start && scheduler.duration && scheduler.interval)) {
  	res.send(400);
  	return;
  }  		
  
  scheduler.user_id = req.session.uid;
   
  scheduler.startYear             = scheduler.start.year;               
  scheduler.startMonth            = scheduler.start.month;              
  scheduler.startDay              = scheduler.start.day;                
  scheduler.startHour             = scheduler.start.hour;               
  scheduler.startMinute           = scheduler.start.minute;             
  scheduler.durationYear          = scheduler.duration.year;            
  scheduler.durationMonth         = scheduler.duration.month;           
  scheduler.durationDay           = scheduler.duration.day;             
  scheduler.durationWeek          = scheduler.duration.week;            
  scheduler.durationHour          = scheduler.duration.hour;            
  scheduler.durationMinute        = scheduler.duration.minute;          
  scheduler.durationSecond        = scheduler.duration.second;          
  scheduler.intervalUnit          = scheduler.interval.unit;            
  scheduler.intervalNumber        = scheduler.interval.number;          
  scheduler.intervalWeekday       = scheduler.interval.weekday;         
  scheduler.intervalWeekdayNumber = scheduler.interval.weekdayNumber;   
    
  delete scheduler.start;
  delete scheduler.duration;
  delete scheduler.interval;

 	dbConn.conn.query('insert into tbl_scheduler SET ?', scheduler, function (err, results) {
    if (err) {
      res.send(500);
      throw err;
    }
    else {
    	res.send(200);
    }
  });
  
  // tbd: insert into tbl timer
  // maybe write to a temp table and handle tbl_timer totally in another process
  
  
  
};
	
exports.list = function(req, res){
	
	if (req.session.uid == 0) {
		res.send(403, "need login");
		return;
	}

 	dbConn.conn.query('select * from tbl_scheduler where user_id = ?', req.session.uid, 
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





