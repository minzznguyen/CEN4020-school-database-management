import logo from './logo.svg';
import './App.css';
import React, { useEffect, useState } from 'react';
import axios from 'axios';


function App() {
  const [message, setMessage] = useState('');

  // Use useEffect to fetch data from the backend when the component mounts
  useEffect(() => {
    // Making the GET request to the backend
    axios.get('http://localhost:3001')
      .then((response) => {
        // Set the response data (which should be "Hello World") in state
        setMessage(response.data);
      })
      .catch((error) => {
        console.error('Error fetching data from the backend:', error);
      });
  }, []); // Empty dependency array means this will run once when the component mounts

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          {message}
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
