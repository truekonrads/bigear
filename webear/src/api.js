import openSocket from 'socket.io-client';
const  socket = openSocket(window.location.protocol + '//'+ window.location.hostname+ '/');
//const  socket = openSocket('http://'+ window.location.hostname+ ':8000');
//const  socket = openSocket('http://10.0.8.76:8000');
function subscribeToBeacons(cb) {
  socket.on('beacons', beacons => cb(null, beacons));
  //socket.emit('subscribeToTimer', 1000);
}
export { subscribeToBeacons };
