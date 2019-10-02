import React from 'react'
import {Switch, Route} from 'react-router-dom';
import Register from '../auth/Register';
import PrivateRoute from './PrivateRoute'
import Dashboard from '../dashboard/Dashboard'
import Login from '../auth/Login';
import Alert from '../layouts/Alert';
import CreateProfile from '../Profile-form/CreateProfile';
import EditProfile from '../Profile-form/EditProfile';
import AddExperience from '../Profile-form/AddExperience';
import Profiles from '../profiles/Profiles';
import AddEducation from '../Profile-form/AddEducation';
import Profile from '../profile/Profile';
import Posts from '../posts/Posts';
import Post from '../post/Post';
import NotFound from '../layouts/NotFound'

const Routes = () => {
    return (
        <section className="container">
          <Alert />
          <Switch>
            <Route exact path="/login" component={Login} />
            <Route exact path ="/register" component={Register}/>
            <Route exact path ="/profiles" component={Profiles}/>
            <Route exact path ="/profile/:id" component={Profile}/>
            <PrivateRoute exact path="/dashboard" component={Dashboard}/>
            <PrivateRoute exact path="/create-profile" component={CreateProfile}/>
            <PrivateRoute exact path="/edit-profile" component={EditProfile} />
            <PrivateRoute exact path="/add-experience" component={AddExperience} />
            <PrivateRoute exact path="/add-education" component={AddEducation} />
            <PrivateRoute exact path="/posts" component={Posts} />
            <PrivateRoute exact path="/post/:id" component={Post} />
            <Route component={NotFound} />
          </Switch>
        </section>
    )
}

export default Routes
