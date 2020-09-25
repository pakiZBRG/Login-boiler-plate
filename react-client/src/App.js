import React from 'react';
import {BrowserRouter, Switch, Route} from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Activation from './components/Activation';

export default function App() {
    return (
        <BrowserRouter>
            <Switch>
                <Route exact path='/' component={Register}/>
                <Route path='/login' component={Login}/>
                <Route path='/users/activate/:token' component={Activation}/>
            </Switch>
        </BrowserRouter>
    )
}
