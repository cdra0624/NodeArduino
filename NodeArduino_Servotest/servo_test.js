var five = require("johnny-five");

var app = require('http').createServer(handler), 
    io = require('/usr/local/lib/node_modules/socket.io').listen(app), 
    fs = require('fs'),
    firmata = require('/usr/local/lib/node_modules/firmata'),
    //board = new firmata.Board('/dev/ttyACM0', arduinoReady);
    board = new five.Board('/dev/ttyACM0', arduinoReady);
 
var ledPin = 9;
 
function arduinoReady(err) {
    if (err) {
        console.log(err);
        return;
    }
    console.log('Firmware: ' + board.firmware.name 
      + '-' + board.firmware.version.major 
      + '.' + board.firmware.version.minor);
 
    var ledOn = true;
    board.pinMode(ledPin, board.MODES.OUTPUT);
    console.log("line23");

}
 


app.listen(8080);
console.log("Listening on http://raspberrypi:8080...");
 
// directs page requests to html files
 
function handler (req, res) {
  fs.readFile(__dirname + '/servo_test.html',
  function (err, data) {
    if (err) {
      res.writeHead(500);
      return res.end('Error loading html file');
    }
 
    res.writeHead(200);
    res.end(data);
  });
}
 
// this handles socket.io comm from html files
 
five.board().on("ready", function(){ 
    console.log("line50");
    var servo = new five.Servo(9);
    io.sockets.on('connection', function(socket) {
        socket.send('connected...');

        socket.on('emit_from_client', function(data){
            console.log(data);
            //socket.emit('emit_from_server', 'hello from server: ' + data);
            if(data > 0 && data < 10){
                servo.to(data);
                data = dig;
            }
        });

        socket.on('message', function(data) {
            if (data == 'turn on') {
                console.log('+');
                board.digitalWrite(ledPin, 30);
                servo.to(30);

                socket.broadcast.send("let there be light!");
            }
            if (data == 'turn off') {
                console.log('-');
                board.digitalWrite(ledPin, 10);
                servo.to(10);
                socket.broadcast.send("who turned out the light?");
            }
            /*if(data == 'left'){
                dig = dig - 5;
                servo.to(dig);
            }
            if(data == 'right'){
                dig = dig + 5;
                servo.to(dig);
            }*/
            return;
        });
     
        socket.on('disconnect', function() {
            socket.send('disconnected...');
        });
    });
});

