const io = require('socket.io')();
const port = 8000;
io.listen(port);
console.log('listening on port ', port);
io.on('connection', (client) => {
  console.log("client connected",client);
//  client.on('subscribeToTimer', (interval) => {
 //   console.log('client is subscribing to timer with interval ', interval);
  //  setInterval(() => {
   //   client.emit('timer', new Date());
    //}, interval);
 // });
});

var amqp = require('amqplib/callback_api');

amqp.connect('amqp://localhost', function(err, conn) {
  conn.createChannel(function(err, ch) {
    var q = 'bigear_beacons';

    ch.assertQueue(q, {durable: false});
    console.log(" [*] Purging queue", q);
    ch.purgeQueue(q);
    console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", q);
    ch.consume(q, function(msg) {
      console.log(" [x] Received %s", msg.content.toString());
      io.sockets.emit("beacons",msg.content.toString());
    }, {noAck: true});
  });
});



