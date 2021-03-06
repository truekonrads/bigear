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
var gBeacons={};
function reformatbeacons(b) {
    newb = {};
    for (let i in b) {
        let val = b[i];
        let newval = val;
        if (val === '') {
            newval = val;
        } else if ("id pid pbid last".split(" ").includes(i)) {

            x = parseInt(val);
            if (!isNaN(x))
                newval = x;
        } else if (i === "alive") {
            if (val === "true")
                newval = true;
            else
                newval = false;
        }
        newb[i] = newval;
    }
    return newb;
}
amqp.connect('amqp://localhost', function(err, conn) {
    conn.createChannel(function(err, ch) {
            var ex = 'beaconexch';

            ch.assertExchange(ex, 'fanout', {
                durable: false
            });
            ch.assertQueue('', {
                    exclusive: true
                }, function(err, q) {
                    console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", q.queue);
                    ch.bindQueue(q.queue, ex, '');
                    ch.consume(q.queue, function(msg) {
                            //console.debug(" [x] Received %s", msg.content.toString());

                            beacons = JSON.parse(msg.content.toString());

                            for (var k in beacons){
                                for (var i in beacons[k]){
                                    beacons[k][i]['csname']=k;
                                }
//                                beacons[k]['csname']=k;
 //                               console.log(beacons[k]);
                                gBeacons[k]=beacons[k];       
                            }
                            // flatten gBeacons
                            let flatBeacons=[];
                            for (var k in gBeacons){
                                flatBeacons=flatBeacons.concat(gBeacons[k]);
                                
                            }
                            reformatted = JSON.stringify(flatBeacons.map(reformatbeacons));
//                            console.log(reformatted);
                            io.sockets.emit("beacons", reformatted);
                    }, {
                        noAck: true
                    });
            });
    });
});
