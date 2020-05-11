import React, { useEffect, useState, } from 'react';
import logo from './logo.svg';
import './App.css';
import axios from 'axios';

interface IValue {
  id: number;
  name: string;
}

function App() {
  const [values, setValues] = useState<IValue[]>([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/values')
      .then(response => setValues(response.data))
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <ul>
          {values.map(value => (
            <li>{value.name}</li>
          ))}
        </ul>
      </header>
    </div>
  );
}

export default App;
