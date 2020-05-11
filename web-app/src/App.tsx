import React, { useEffect, useState, } from 'react';
import { Header, Icon, List } from 'semantic-ui-react'
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
    <div>
      <Header as='h2'>
        <Icon name='plug' />
        <Header.Content>Uptime Guarantee</Header.Content>
      </Header>
      <List>
        {values.map(value => (
          <List.Item key={value.id}>{value.name}</List.Item>
        ))}
      </List>
    </div>
  );
}

export default App;
