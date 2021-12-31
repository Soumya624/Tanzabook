import React from 'react'
import {
    Switch,
    Route,
    BrowserRouter
} from "react-router-dom";
import Annotator from './Components/Annotator/App'
import Login from './Components/Auth/Login';
import Register from './Components/Auth/Register';
import Upload from './Components/Upload';
import Welcome from './Components/Welcome';
import Project from './Components/Welcome/project';


export default function App() {
    return (
        <BrowserRouter>
            <Switch>
                <Route exact path="/">
                    <Login />
                </Route>
                <Route exact path="/register">
                    <Register />
                </Route>
                <Route exact path="/home">
                    <Welcome />
                </Route>
                <Route exact path="/project">
                    <Project />
                </Route>
                <Route path="/upload" exact>
                    <Upload />
                </Route>
                <Route path="/annotator" exact>
                    <Annotator />
                </Route>
            </Switch>
        </BrowserRouter>
    )
}