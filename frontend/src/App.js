import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import TaskList from './components/Tasks/TaskList';
import PrivateRoute from './components/PrivateRoute';

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
