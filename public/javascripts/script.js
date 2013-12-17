// var socket = io.connect('http://localhost:8080');
//   socket.on('news', function (data) {
//     console.log(data);
//   });

$(function() {
    var socket = io.connect('http://localhost:8080');
    socket.on('news', function (data) {
      console.log(data);
    });
    socket.on('data', function(data) {
        for (var key in data["data"]) {
          if(data["data"][key]["tv"] != $('.tvol.'+ key).text()){
            $('.tvol.'+ key).text(data["data"][key]["tv"]).toggleClass("flash")
          }
          if(data["data"][key]["pc"] != $('.price.'+ key).text()){
            $('.price.'+ key).text(data["data"][key]["pc"]).toggleClass("flash")
          }
          if(data["data"][key]["sc"] != $('.tsent.'+ key).text()){
            $('.tsent.'+ key).text(data["data"][key]["sc"].toFixed(2)).toggleClass("flash")
          }
        }
        $('.flash').fadeOut(100).fadeIn(100)
        $('.flash').toggleClass("flash") 
        $('#last-update').text(Date(data["time"]))
    });
})