import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Login from './pages/Login/index';
import Register from './pages/Register/index';
import Dashboard from './pages/Dashboard/index';
import EventsPage from './pages/EventsPage';
import TopNav from './components/TopNav';

export default function Routes() {
    return (
        <BrowserRouter>
            <TopNav />
            <Switch>
                <Route path='/' exact component={Dashboard} />
                <Route path='/login' exact component={Login} />
                <Route path='/register' exact component={Register} />
                <Route path='/events' component={EventsPage} />
            </Switch>
        </BrowserRouter>
    );
}