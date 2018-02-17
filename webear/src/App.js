import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { subscribeToBeacons } from './api';
import DataTables from 'material-ui-datatables';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import humanizeDuration from 'humanize-duration'

class App extends Component {

  constructor(props) {
  super(props);
  subscribeToBeacons((err, beacons) => 
	{
		var jb= JSON.parse(beacons);
		for (var i=0; i< jb.length; i++){
		    jb[i]['last']=humanizeDuration(
			parseInt(jb[i]['last'],10),
			{largest: 1}
		    );
		    }
		this.setState({ beacons: jb });
		console.log(beacons);

	}
  );
}

state = {
  beacons: [
	{ computer: 'empty', alive: "empty", os: "OS", user: "empty"}
	
] // no beacons yet
};


columns = [{
  label: 'computer',
  key: 'computer',
},

/* {
  label: 'Alive?',
  key: 'alive',
}, */

{
	label: 'last',
	key: 'last',
	
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
