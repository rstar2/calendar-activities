import React from 'react';
import logo from './logo.svg';
import './App.css';


export default class App extends React.Component {

    render() {
        return (
            <div className="App">
              <header className="App-header">
                <img src={logo} className="App-logo" alt="logo" />
                <p onClick={this._onClick}>
                  Edit <code>src/App.tsx</code> and save to reload.
                </p>
                <a
                  className="App-link"
                  href="https://reactjs.org"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Hello
                </a>
              </header>
            </div>
          );
    }

    private _onClick = () => {
        console.log("Click");
    }

}
