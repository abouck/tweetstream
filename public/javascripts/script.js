// var socket = io.connect('http://localhost:8080');
//   socket.on('news', function (data) {
//     console.log(data);
//   });

$(function() {
    var socket = io.connect('http://localhost:8080');
    socket.on('news', function (data) {
      console.log(data);
    });
    socket.on('tweets', function(data) {
        for (var key in data) {
          if((data[key] != ".DJI") && (data[key] != $('.tvol.'+ key).text())){
            $('.tvol.'+ key).text(data[key]).toggleClass("flash")
          }
        }
        $('.flash').fadeOut(100).fadeIn(100)
        $('.flash').toggleClass("flash") 
        $('#last-update').text(new Date().toTimeString());
    });
    socket.on('data', function(data) {
        for (var key in data) {
          if(data[key] != $('.tvol.'+ key).text()){
            $('.price.'+ key).text(data[key])
          }
        }
        $('.flash').fadeOut(100).fadeIn(100)
        $('.flash').toggleClass("flash") 
        $('#last-update').text(new Date().toTimeString());
    });
})