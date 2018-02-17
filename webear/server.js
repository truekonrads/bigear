const io = require('socket.io')();
const port = 8000;
io.listen(port);
console.log('listening on port ', port);
io.on('connection', (client) => {
    console.log("client connected", client);
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
        var ex = 'beaconexch';

        ch.assertExchange(ex, 'fanout', { durable: false });
        ch.assertQueue('', { exclusive: true }, function(err, q) {
            console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", q.queue);
            ch.bindQueue(q.queue, ex, '');
            ch.consume(q.queue, function(msg) {
                console.log(" [x] Received %s", msg.content.toString());
                io.sockets.emit("beacons", msg.content.toString());
            }, {
                noAck: true
            });
        });
    });
});
