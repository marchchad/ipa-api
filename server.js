var app = require('express')();
var path = require('path');
var server = require('http').createServer(app);
var io = require('socket.io')(server);

app.get('/', function(req, res){
  res.sendFile(path.join(__dirname, './views', 'index.html'));
});

var pourData = [
// duration is in seconds
// volume is in ounces
  {
    volume: 12.2,
    duration: 80
  },
  {
    volume: 16.4,
    duration: 96
  },
  {
    volume: 11.7,
    duration: 54
  }
];

function getPourData(){
  var pour = getRandomInt(0, 2);
  return pourData[pour];
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

io.on('connection', function(socket){

  console.log('a user connected');
  setTimeout(function(){
    socket.emit('pour', 
      {
        keg: 1,
        message: 'Now pouring!'
      }
    );
  }, 5000);

  socket.on('getPourData', function(){
    var pourData = getPourData();
    setTimeout(function(){
      console.log(pourData);
      io.emit('pourData', {data: pourData});
    }, pourData.duration * 100);
  });

  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
});

server.listen(3001, function(){
  console.log('listening on *:3001');
});