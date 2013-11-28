
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var twitter = require('ntwitter');
var cronJob = require('cron');
var _ = require ('underscore');
var io = require('socket.io');


var app = express();

var server = http.createServer(app)

var tagWatch = ['$aapl', '$fb', '$twtr', '$t', '$goog' ]

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
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

app.get('/', routes.index);
app.get('/users', user.list);

// var sockets = io.listen(server)

var t = new twitter({
    consumer_key: '',         
    consumer_secret: '',        
    access_token_key: '',       
    access_token_secret: '' 
});

t.stream('statuses/filter', { track: tagWatch, language: 'en' }, function(stream) {


  stream.on('data', function(tweet) {

          console.log(tweet.text)
          console.log(tweet.created_at)
          console.log('-> '+tweet.user.name)

  });
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
