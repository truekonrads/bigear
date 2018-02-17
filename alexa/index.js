require('dotenv').config()
const Alexa = require('alexa-sdk');
const APP_ID=process.env.API_KEY
const SERVER_PORT = 8888;
const SERVER_IP = '0.0.0.0';
const pl = require('pluralize')
const util = require('util');
const express = require('express');
const bodyParser = require('body-parser');

var global_beacons =[];

function count_beacons(beacons){
	res = {
		'active': 0,
		'inactive': 0,
	};
	beacons.forEach((b) =>{
		let lastCheckin=parseInt(b['last']);
		if(lastCheckin>(60*60*1000)){
			res['inactive']+=1;
		}else{
			res['active']+=1;
		}
	});
	return res;
}
const handlers = {

	'howmanybeacons': function(){
		console.log("Handling ",this.event.request.intent.name);
		var beaconstate='ANY';
		if (this.event.request.intent.slots.hasOwnProperty('beacon_state')){
			console.log(this.event.request.intent.slots.beacon_state);		
		}
		if (this.event.request.intent.slots.hasOwnProperty('campagin')){
			console.log(this.event.request.intent.slots.campagin);		
		}
		let beacon_count = global_beacons.length;
		let bc= count_beacons(global_beacons);
		let active_beacons="none";
                if (bc['active']>0){
			active_beacons='<say-as interpret-as="cardinal">'+bc['active']>+'</say-as>';
		}
		const message='There %s <say-as interpret-as="cardinal">%s</say-as> %s in total, of those %s are active.';
		let fmted_message=util.format(message,pl("is",beacon_count),beacon_count,pl("beacon",beacon_count),active_beacons);
		if (active_beacons == "none"){
			fmted_message+='<say-as interpret-as="interjection">darn</say-as>';
		}
		console.log("I said: ",fmted_message);
		this.emit(':tell',fmted_message);
		
	},
    'Unhandled': function() {
        console.log("UNHANDLED");
        const message = 'What?';
        this.response.speak(message).listen(message);
        this.emit(':responseReady');
    },
    'LaunchRequest': function() {
        console.log("LaunchRequest");
        const message = 'Do you want to know about beacons?';
        this.response.speak(message).listen(message);
        this.emit(':responseReady');
    }

}

var amqp = require('amqplib/callback_api');

amqp.connect('amqp://localhost', function(err, conn) {
    conn.createChannel(function(err, ch) {
        var ex = 'beaconexch';
	
        ch.assertExchange(ex, 'fanout', { durable: false });
        ch.assertQueue('', { exclusive: true }, function(err, q) {
            console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", q.queue);
            ch.bindQueue(q.queue, ex, '');
            ch.consume(q.queue, function(msg) {
        //       console.log(" [x] Received %s", msg.content.toString());
		global_beacons = JSON.parse(msg.content.toString());
            }, {
                noAck: true
            });
        });
    });
});


var app = express();
// Initialize the Alexa SDK
app.use(bodyParser.json());
app.get('/test',function(req,res){
	res.send('Hello World!');
});
app.post('/', function(req, res) {
    // Build the context manually, because Amazon Lambda is missing
    //console.log("got a post");
    var context = {
        succeed: function (result) {
            console.log(result);
            res.json(result);
        },
        fail:function (error) {
            console.log(error);
        }
    };
    // Delegate the request to the Alexa SDK and the declared intent-handlers
    var alexa = Alexa.handler(req.body, context);
    alexa.appId = APP_ID // APP_ID is your skill id which can be found in the Amazon developer console where you create the skill.
    alexa.registerHandlers(handlers);
    alexa.execute();
});
var http = require('http');
var httpServer = http.createServer(app);
httpServer.listen(SERVER_PORT,SERVER_IP,function () {
    console.log('Alexa Skill service ready on ' + SERVER_IP+":"+SERVER_PORT+" via https. Be happy!");
});
