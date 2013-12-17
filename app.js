
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
var sent = require('./config/sent')
var phantom = require('phantom');


var app = express();

var server = http.createServer(app)
var io = require('socket.io').listen(server)

server.listen(8080)

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
// var tagWatch = ['$mmm','$axp','$t','$ba','$cat','$cvx','$csco','$dd','$xom','$ge','$gs','$hd','$intc','$ibm','$jnj','$jpm','$mcd','$mrk','$msft','$nke','$pfe','$pg','$ko','$trv','$utx','$unh','$vz','$v','$wmt','$dis']

// all environments
app.set('port', process.env.PORT || 3001);
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

io.sockets.on('connection', function(socket) {
  socket.emit('news', { message: 'welcome to the stock market!'});
  socket.emit('data',{ "time": Date.now(), "data": tObj });
})

dbObj = {
  "MMM": [0, 0, 0],
  "AXP": [0, 0, 0],
  "T": [0, 0, 0],
  "BA": [0, 0, 0],
  "CAT": [0, 0, 0],
  "CVX": [0, 0, 0],
  "CSCO": [0, 0, 0],
  "DD": [0, 0, 0],
  "XOM": [0, 0, 0],
  "GE": [0, 0, 0],
  "GS": [0, 0, 0],
  "HD": [0, 0, 0],
  "INTC": [0, 0, 0],
  "IBM": [0, 0, 0],
  "JNJ": [0, 0, 0],
  "JPM": [0, 0, 0],
  "MCD": [0, 0, 0],
  "MRK": [0, 0, 0],
  "MSFT": [0, 0, 0],
  "NKE": [0, 0, 0],
  "PFE": [0, 0, 0],
  "PG": [0, 0, 0],
  "KO": [0, 0, 0],
  "TRV": [0, 0, 0],
  "UTX": [0, 0, 0],
  "UNH": [0, 0, 0],
  "VZ": [0, 0, 0],
  "V": [0, 0, 0],
  "WMT": [0, 0, 0],
  "DIS": [0, 0, 0],
  "DJI": [0, 0, 0]
  }

tObj = {
  "MMM": {"tv": 0, "sc": 0, "pc": 0},
  "AXP": {"tv": 0, "sc": 0, "pc": 0},
  "T": {"tv": 0, "sc": 0, "pc": 0},
  "BA": {"tv": 0, "sc": 0, "pc": 0},
  "CAT": {"tv": 0, "sc": 0, "pc": 0},
  "CVX": {"tv": 0, "sc": 0, "pc": 0},
  "CSCO": {"tv": 0, "sc": 0, "pc": 0},
  "DD": {"tv": 0, "sc": 0, "pc": 0},
  "XOM": {"tv": 0, "sc": 0, "pc": 0},
  "GE": {"tv": 0, "sc": 0, "pc": 0},
  "GS": {"tv": 0, "sc": 0, "pc": 0},
  "HD": {"tv": 0, "sc": 0, "pc": 0},
  "INTC": {"tv": 0, "sc": 0, "pc": 0},
  "IBM": {"tv": 0, "sc": 0, "pc": 0},
  "JNJ": {"tv": 0, "sc": 0, "pc": 0},
  "JPM": {"tv": 0, "sc": 0, "pc": 0},
  "MCD": {"tv": 0, "sc": 0, "pc": 0},
  "MRK": {"tv": 0, "sc": 0, "pc": 0},
  "MSFT": {"tv": 0, "sc": 0, "pc": 0},
  "NKE": {"tv": 0, "sc": 0, "pc": 0},
  "PFE": {"tv": 0, "sc": 0, "pc": 0},
  "PG": {"tv": 0, "sc": 0, "pc": 0},
  "KO": {"tv": 0, "sc": 0, "pc": 0},
  "TRV": {"tv": 0, "sc": 0, "pc": 0},
  "UTX": {"tv": 0, "sc": 0, "pc": 0},
  "UNH": {"tv": 0, "sc": 0, "pc": 0},
  "VZ": {"tv": 0, "sc": 0, "pc": 0},
  "V": {"tv": 0, "sc": 0, "pc": 0},
  "WMT": {"tv": 0, "sc": 0, "pc": 0},
  "DIS": {"tv": 0, "sc": 0, "pc": 0},
  "DJI": {"tv": 0, "sc": 0, "pc": 0}
  }

t.stream('statuses/filter', { track: handlesArr, laguage: 'en' } , function(stream) {

  tCount = 0
  
  stream.on('data', function(tweet) {
    if (tweet.text !== undefined) {
      var text = tweet.text.toLowerCase().split(/[\s\!\?\.]+/);
    //  console.log(text)

          for (var key in handles) {
          if (handles.hasOwnProperty(key)) {
            handles[key].forEach(function(x){
              text.forEach(function(y){
                if(x == y){
                  tObj[key]["tv"]++
                  tObj["DJI"]["tv"]++
                  dbObj[key][0]++
                  dbObj["DJI"][0]++
                  text.forEach(function(z){
                    if(sent.hasOwnProperty(z)){
                      tObj[key]["sc"] += sent[z]
                      tObj["DJI"]["sc"] += sent[z]
                      dbObj[key][1] += sent[z]
                      dbObj["DJI"][1] += sent[z]
                    };
                  });
                };
              });
            });
        };
      };
          // console.log(tweet.text)
          // console.log(tweet.created_at)
          // console.log('-> '+tweet.user.name)
          tCount ++
    };
    tweet = null
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
  //  console.log(tObj)
//    io.sockets.emit('tweets', tObj)
  }), 10000);
  
});

phantom.create(function(ph) {
  ph.createPage(function(page) {

    page.open("https://accounts.google.com/Login", function(status) {
      console.log('opening login')
      page.onConsoleMessage = function (msg){
      console.log(msg);
      };
      console.log("opened site?", status);
        page.evaluate(function() {
         console.log('login started')
         console.log(document.getElementById('gaia_loginform'))
          document.getElementById('Email').value = ''
          console.log(document.getElementById('Email').value)
          document.getElementById('Passwd').value = ''
          console.log(document.getElementById('Passwd').value)
          document.getElementById('gaia_loginform').submit()
          console.log('submitting...')
          return document.getElementById('Email').value;
        }, function(result) {
            console.log(result);
            });  
      
    });

    setTimeout(function(){
      console.log("fetching index")
      page.open("https://www.google.com/finance/portfolio?action=view&pid=1&ei=E1WnUpjZM6WYiQKD2QE", function(status) {
        console.log("opened site?", status); 
          setInterval(function() {
            page.evaluate(function() {

              var stocksObj = {};
              var nodeList = document.querySelectorAll(".gf-table tbody tr .pf-table-s"),
              nodeArray = [].slice.call(nodeList);
               nodeArray.forEach(function(x){
                if(x.innerText == ".DJI"){
                  stocksObj["DJI"] = x.nextSibling.innerText
                }
                else{
                 stocksObj[x.innerText] = x.nextSibling.innerText                  
                }
               })

              return stocksObj
            }, function(result) {
            // console.log(result);
              //Send to all the clients

              for(var key in result){
                tObj[key]["pc"] = result[key]
                dbObj[key][2] = result[key]
              }
              // console.log(tObj)
            io.sockets.emit('data',{ "time": Date.now(), "data": tObj });
             //   ph.exit();
             for(key in tObj){
              tObj[key]["tv"] = 0
              tObj[key]["sc"] = 0
              // tObj[key]["pc"] = 0
             }
            });
          }, 10000);
        });
    }, 15000);
  });
});

setInterval(function(){
  var stockString = JSON.stringify({ stockObj: { "time": Date.now(), "data": dbObj }})
  console.log(stockString)

  var headers = {
  'Content-Type': 'application/json',
  'Content-Length': stockString.length
  };
  var options = {
  host: 'localhost',
  port: 3000,
  path: '/data',
  method: 'POST',
  headers: headers
  };
  var http = require('http');

  var req = http.request(options, function(res) {

  });

  req.write(stockString);
  req.end();
  for(key in tObj){
    dbObj[key][0] = 0
    dbObj[key][1] = 0
    dbObj[key][2] = 0
  }
}, 60000);

// var sockets = io.listen(server)




http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
