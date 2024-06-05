import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { AuthProvider } from './contexts/authContext';
import { TaskProvider } from './contexts/TaskContext';
import PrivateRoute from './components/privateRoute';
import Login from './components/auth/login';
import Register from './components/auth/register';
import TaskList from './components/tasks/tasklist';

function App() {
    return (
        <AuthProvider>
            <TaskProvider>
                <Router>
                    <div className="App">
                        <Switch>
                            <Route exact path="/login" component={Login} />
                            <Route exact path="/register" component={Register} />
                            <PrivateRoute exact path="/tasks" component={TaskList} />
                        </Switch>
                    </div>
                </Router>
            </TaskProvider>
        </AuthProvider>
    );
}

export default App;
