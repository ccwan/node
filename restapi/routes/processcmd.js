var util = require('util');
var events = require('events');  
 
module.exports = Processcmd;  
 
function Processcmd() {  
  events.EventEmitter.call(this);  
  this.action_buf = new Object;
  this.result_buf = new Object;
  this.counter = 1;
  
  var self = this;
  return {    
    postAction: function(request, response){
      var action_id = self.counter;
      self.counter++;
      if (self.counter > 99999) {
        self.counter = 1;      
      }
      
      var action = new Object();
      if (typeof(request.body.sensor_id)!= "undefined") {
        action.sensor_id = request.body.sensor_id; 
      }
      action.payload = request.body.payload; 
      action.action_id = action_id;
      
      if (typeof(self.action_buf[request.params.device_id]) == "undefined")  {
        self.action_buf[request.params.device_id] = new Array();
      }
      self.action_buf[request.params.device_id].push(action);

      response.writeHead(200, {"Content-Type": "application/json"});
      var resp = new Object();
      resp.action_id = action_id;
      response.write(JSON.stringify(resp));
      response.end();
      
      self.emit("actionfordevice" + request.params.device_id);
    },
     
    getAction : function(request, response){
      var getResp = response;
      getResp.writeHead(200, {"Content-Type": "application/json"});
      var buf = self.action_buf[request.params.device_id];
      var action;
      if (typeof(buf) != "undefined")  {
        action = buf.shift();
      }
      if (typeof(action) != "undefined") {
        if (buf.length > 0) {
          action.has_more = true;
        }
        getResp.write(JSON.stringify(action));
        getResp.end();
        return;
      }

      self.once("actionfordevice" + request.params.device_id,
        function() {
          action = self.action_buf[request.params.device_id].shift();
          if (typeof(action) != "undefined") {
            getResp.write(JSON.stringify(action));
          }
          getResp.end();
        }
      );
      
      var timeout = 60000;
      if (typeof(timeout) != "undefined") {
        setTimeout(
          function(){
            self.removeAllListeners("actionfordevice" + request.params.device_id);
            getResp.end();
          },
          timeout
        );
      }
    },
    
    postResult: function(request, response){
      var action = new Object();
      if (typeof(request.body.sensor_id)!= "undefined") {
        action.sensor_id = request.body.sensor_id; 
      }
      action.payload = request.body.payload; 
      action.action_id = request.body.action_id;
      
      if (typeof(self.result_buf[request.params.device_id]) == "undefined")  {
        self.result_buf[request.params.device_id] = new Array();
      }
      self.result_buf[request.params.device_id].push(action);

      response.writeHead(200, {"Content-Type": "application/json"});
      response.end();
      
      self.emit("resultfordevice" + request.params.device_id);
    },
     
    getResult : function(request, response){
      var getResp = response;
      getResp.writeHead(200, {"Content-Type": "application/json"});
      var buf = self.result_buf[request.params.device_id];
      var action;
      if (typeof(buf) != "undefined")  {
        action = buf.shift();
      }
      if (typeof(action) != "undefined") {
        if (buf.length > 0) {
          action.has_more = true;
        }
        getResp.write(JSON.stringify(action));
        getResp.end();
        return;
      }

      self.once("resultfordevice" + request.params.device_id,
        function() {
          action = self.result_buf[request.params.device_id].shift();
          if (typeof(action) != "undefined") {
            getResp.write(JSON.stringify(action));
          }
          getResp.end();
        }
      );

      var timeout = 60000;
      if (typeof(timeout) != "undefined") {
        setTimeout(
          function(){
            self.removeAllListeners("resultfordevice" + request.params.device_id);
            getResp.end();
          },
          timeout
        );
      }
    }    
  };  
  
}  
 
util.inherits(Processcmd, events.EventEmitter); 
 


/*
exports.postResult = function(request, response){
  response.writeHead(200, {"Content-Type": "application/json"});
  response.write("post result" + request.params.device_id);
  response.end();
};

exports.getResult = function(request, response){
  response.writeHead(200, {"Content-Type": "application/json"});
  response.write("get result" + request.params.device_id);
  response.end();
};
*/


