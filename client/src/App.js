import React,{useState,useEffect} from "react";
import {  Route, Switch, Redirect } from "react-router-dom";
import { ToastProvider } from 'react-toast-notifications';
import "@fortawesome/fontawesome-free/css/all.min.css";
import "assets/styles/tailwind.css";
import axios from "services/axios";
// layouts
import Admin from "layouts/Admin.js";
import Auth from "layouts/Auth.js";
import { AuthContext } from "./services/AuthContext";
// views without layouts
import { connect } from "react-redux";
import { setLocale } from "react-redux-i18n";
import useGaTracker from './services/useGaTracker'
import Liff from "layouts/Liff";

function App() {
    const [authState, setAuthState] = useState({
      email: "",
      id: 0,
      status: false,
      role:"",
    });

    useGaTracker();

    useEffect(() => {
          axios
            .get("/users/auth")
            .then((response) => {
              console.log(response.data)
              if (response.data.error) {
                setAuthState({ ...authState, status: false });
              } else {
                localStorage.setItem('userName',response.data.firstName +" " + response.data.lastName);
                setAuthState({
                  email: response.data.email,
                  id: response.data.id,
                  status: true,
                  role:response.data.role,
                });
              }
            });
      
    }, []);

    return (
      <div className="App">
        <AuthContext.Provider value={{ authState, setAuthState }}>
                <ToastProvider>
                  <Switch>
                      <Route path="/admin" component={Admin} />
                      <Route path="/auth" component={Auth} />
                      <Route path="/line" component={Liff} />
                      <Redirect from="*/" to="/auth/login" />
                  </Switch>
                </ToastProvider>
        </AuthContext.Provider>
      </div>
    )
}

const mapStateToProps = (state) => ({
  l: state.i18n.locale,
});

const mapDispatchToProps = (dispatch) => ({
  setLang: (l) => {
    dispatch(setLocale(l));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(App);