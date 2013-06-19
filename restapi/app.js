/**
 * Module dependencies.
 */

var express = require('express')
  , syutils = require('./routes/syutils')
  , routes = require('./routes')
  , user = require('./routes/user')
  , vendor = require('./routes/vendor')
  , deviceType = require('./routes/deviceType')
  , model = require('./routes/model')
  , device = require('./routes/device')
  , datapoint = require('./routes/datapoint')
  , nwkIf = require('./routes/nwkIf')
  , trigger = require('./routes/trigger')
  , act = require('./routes/action')
  , rule = require('./routes/rule')
  , scheduler = require('./routes/scheduler')
  , http = require('http')
  , path = require('path');

var app = express();

var fs = require('fs');
 
// all environments
app.set('port', process.env.PORT || 9090);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());    // x-http-method-override
app.use(express.cookieParser('sychip'));
app.use(express.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

app.set('title', 'My REST API server');
app.set('env', 'development');

if ('development' == app.get('env')) {
  app.use(express.errorHandler());
	console.log("Development Mode");
}

app.all("/*", syutils.authen);
app.get('/', routes.index);

app.post('/user', user.create);
app.get('/user/:id/verification', user.verify);
app.post('/user/login', user.login);
app.post('/user/logout', user.logout);
app.get('/user', user.view);
app.put('/user', user.update);

app.post('/vendor', vendor.create);
app.get('/vendor', vendor.list);

app.get('/deviceType', deviceType.list);

app.post('/model', model.create);
app.get('/model', model.list);
app.get('/model/:id', model.view);

app.post('/device', device.create);
app.get('/device', device.list);
app.get('/device/:id', device.view);
app.put('/device/:id', device.update);
app.delete('/device/:id', device.delete);

app.post('/data', datapoint.create);
app.get('/device/:id/data', datapoint.list); // with session id

app.post('/nwkIf/:uuid', nwkIf.create);
app.get('/nwkIf', nwkIf.list); // with session id
app.get('/nwkIf/:uuid', nwkIf.view); // with api key
app.delete('/nwkIf/:uuid', nwkIf.delete);

app.post('/scheduler', scheduler.create);
app.get('/scheduler', scheduler.list);

app.post('/trigger', trigger.create);
app.get('/trigger', trigger.list);

app.post('/action', act.create);
app.get('/action', act.list);

app.post('/rule', rule.create);
app.get('/rule', rule.list);


app.get('/stylesheets/style.css', function(req, res) {
  // Note: should use a stream here, instead of fs.readFile
  fs.readFile('./public/stylesheets/style.css', function(err, data) {
    if(err) {
      res.send("Oops! Couldn't find that file.");
      res.send(404);
    } else {
      // set the content type based on the file
      res.set('Content-Type', 'text/css');
      res.send(200, data);
    }   
  }); 
});




app.get('/test', function(req, res){
	 res.render('test',{status: 200, title:'Test Page'});
});

app.get('/test/vendor', function(req, res){
	 res.render('vendor',{status: 200, title:'Vendor'});
});

app.get('/test/user', function(req, res){
	 res.render('user',{status: 200, title:'User'});
});

app.get('/test/device', function(req, res){
	 res.render('device',{status: 200, title:'Device'});
});

app.get('/test/rule', function(req, res){
	 res.render('rule',{status: 200, title:'Rule'});
});

/*
app.get('/*', function(req, res){
	 res.render('index',{status: 404, title:'404 - ÎÄ¼þÎ´ÕÒµ½'});
});
*/

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
