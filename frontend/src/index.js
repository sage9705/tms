import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { AuthProvider } from './contexts/authContext';
import { TaskProvider } from './contexts/TaskContext';
import './index.css';

ReactDOM.render(
  <React.StrictMode>
    <AuthProvider>
      <TaskProvider>
        <App />
      </TaskProvider>
    </AuthProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
