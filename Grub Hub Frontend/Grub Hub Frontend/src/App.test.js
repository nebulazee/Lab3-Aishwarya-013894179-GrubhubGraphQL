import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

it('renders without crashing', () => {
  const div = document.createElement('div');
  if(typeof window !== "undefined")
  ReactDOM.render(<App />, div);
});
