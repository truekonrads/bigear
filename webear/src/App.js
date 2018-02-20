import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { subscribeToBeacons } from './api';
import DataTables from 'material-ui-datatables';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import humanizeDuration from 'humanize-duration'
import Push from 'push.js'
import util from 'util'
class App extends Component {

  constructor(props) {
  super(props);
  subscribeToBeacons((err, beacons) => 
	{
		var jb= JSON.parse(beacons);
		for (var i=0; i< jb.length; i++){
            // 
		    jb[i]['last_formatted']=humanizeDuration((jb[i]['last']), {largest: 1});

            // check if the beacon is new
            if(this.state.beacons.length>0){
                const existing_bids = this.state.beacons.map( (b) => { return b['id']});
                if (! existing_bids.includes(jb[i]['id'])){
                    Push.create(util.format("New beacon! %s/%s",jb[i]['user'],jb[i]['computer'])); 
                } else {
                    // check if perhaps the beacon was asleep and now is awake
                    let old_b = this.state.beacons.find( function (b) {return b['id']===this },jb[i]['id']);
                    const TWENTY_MINUTES=1000*60*20;
                    if (jb[i]['last']>TWENTY_MINUTES && (jb[i]['last'] - old_b['last'])<0){
                        Push.create(util.format("Beacon  %s/%s has come back from sleep!",jb[i]['user'],jb[i]['computer'])); 
                    }
                }
            }
	   }

		this.setState({ beacons: jb });
//		console.log(beacons);

	}
  );
}

state = {
  beacons: [
//	{ computer: 'empty', alive: "empty", os: "OS", user: "empty"}
	
] // no beacons yet
};

columns = [
{
  label: 'layer',
  key: 'csname',
},
{
  label: 'computer',
  key: 'computer',
},

/* {
  label: 'Alive?',
  key: 'alive',
}, */

{
	label: 'last',
	key: 'last_formatted',
	
},
{
  label: 'Int IP',
  key: 'internal',
}, 

{
  label: 'OS',
  key: 'os',
}, 
{
  label: 'Victim',
  key: 'user',
}

];

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Beacons!</h1>
        </header>
	<MuiThemeProvider>
	<DataTables data={this.state.beacons} columns={this.columns} />
	</MuiThemeProvider>
      </div>
    );
  }
}

export default App;
