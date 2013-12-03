
/**
 * Module dependencies.
 */

var express = require('express');
var twitCred = require('./config/tweetKeys')
var handles = require('./config/handles')
var routes = require('./routes');
var user = require('./routes/user');
var graph = require('./routes/graph');
var http = require('http');
var path = require('path');
var twitter = require('ntwitter');
var cronJob = require('cron').CronJob;
var _ = require ('underscore');
var io = require('socket.io');


var app = express();

var server = http.createServer(app)
var handlesArr = []
for (var key in handles) {
  if (handles.hasOwnProperty(key)) {
    var arr = handles[key]
    arr.forEach(function(h){
    handlesArr.push(h)
    });
  }
}
// handles.each(function(company){
//   company.each(function(handle){
//     handlesArr.push(handle)
//   })
// })
var tagWatch = ['$mmm','$axp','$t','$ba','$cat','$cvx','$csco','$dd','$xom','$ge','$gs','$hd','$intc','$ibm','$jnj','$jpm','$mcd','$mrk','$msft','$nke','$pfe','$pg','$ko','$trv','$utx','$unh','$vz','$v','$wmt','$dis']

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

app.use('/components', express.static(path.join(__dirname, 'components')))

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

var t = new twitter({
  consumer_key: twitCred.consumer,         
  consumer_secret: twitCred.consumerSecret,        
  access_token_key: twitCred.accessKey,       
  access_token_secret: twitCred.accessSecret 
});

app.get('/', routes.index);
app.get('/users', user.list);
app.get('/graph', graph.show);

t.stream('statuses/filter', { track: handlesArr, laguage: 'en' } , function(stream) {

  tCount = 0

  stream.on('data', function(tweet) {
    if (tweet.text !== undefined) {
          console.log(tweet.text)
          console.log(tweet.created_at)
          console.log('-> '+tweet.user.name)
          tCount ++
    }
  });
  stream.on('end',function(e){
    console.log('connection ended...............................')
    console.log(e)
    console.log("Error: " + hostNames[i] + "\n" + e.message); 
    console.log( e.stack );
  });
  stream.on('destroy',function(e){
    console.log('connection ended...............................')
    console.log(e)
    console.log("Error: " + hostNames[i] + "\n" + e.message); 
    console.log( e.stack );
  });
  setInterval((function() {
    console.log('************************************* ' + tCount);
  }), 10000);
  
});

// var sockets = io.listen(server)




http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
