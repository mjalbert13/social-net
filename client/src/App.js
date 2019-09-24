import React, {Fragment, useEffect} from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import Navbar from './components/layouts/Navbar';
import Landing from './components/layouts/Landing';
import Register from './components/auth/Register';
import PrivateRoute from './components/router/PrivateRoute'
import Dashboard from './components/dashboard/Dashboard'
import Login from './components/auth/Login';
import Alert from './components/layouts/Alert';
import CreateProfile from './components/Profile-form/CreateProfile';
import EditProfile from './components/Profile-form/EditProfile';
import AddExperience from './components/Profile-form/AddExperience';
import Profiles from './components/profiles/Profiles';
import AddEducation from './components/Profile-form/AddEducation';
import {loadUser} from './actions/auth';
import setAuthToken from './utils/setAuthToken';
import './App.css';
// Import Redux
import {Provider} from 'react-redux'
import store from './store'


if(localStorage.token){
  setAuthToken(localStorage.token)
}

const App = () =>{ 
  useEffect(()=>{
    store.dispatch(loadUser())
  }, [])
  
  return(
   <Provider store={store}>
    <Router>
      <Fragment>
        <Navbar />
        <Route exact path="/" component={Landing} />
        <section className="container">
          <Alert />
          <Switch>
            <Route exact path="/login" component={Login} />
            <Route exact path ="/register" component={Register}/>
            <Route exact path ="/profiles" component={Profiles}/>
            <PrivateRoute exact path="/dashboard" component={Dashboard}/>
            <PrivateRoute exact path="/create-profile" component={CreateProfile}/>
            <PrivateRoute exact path="/edit-profile" component={EditProfile} />
            <PrivateRoute exact path="/add-experience" component={AddExperience} />
            <PrivateRoute exact path="/add-education" component={AddEducation} />
          </Switch>
        </section>
      </Fragment>
    </Router>
  </Provider> 
)}
export default App;
