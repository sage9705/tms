import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Login from './components/auth/login';
import Register from './components/auth/register';
import TaskList from './components/tasks/tasklist';
import PrivateRoute from './components/privateRoute';

const App = () => {
    return (
        <Router>
            <div className="App">
                <Switch>
                    <Route exact path="/login" component={Login} />
                    <Route exact path="/register" component={Register} />
                    <PrivateRoute exact path="/" component={TaskList} />
                </Switch>
            </div>
        </Router>
    );
};

export default App;
