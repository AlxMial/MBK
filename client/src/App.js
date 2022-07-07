import React, { useState, useEffect } from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import { ToastProvider } from "react-toast-notifications";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "assets/styles/tailwind.css";
import axios from "services/axios";
// layouts
import Admin from "layouts/Admin.js";
import Auth from "layouts/Auth.js";
import { AuthContext } from "./services/AuthContext";
// views without layouts
import { connect, Provider } from "react-redux";
import { setLocale } from "react-redux-i18n";
import useGaTracker from "./services/useGaTracker";
import Liff from "layouts/Liff";
import configureStore, { history } from "redux/store";
import { ConnectedRouter } from "connected-react-router";
import { GetPermissionByUserName } from "services/Permission";


export const store = configureStore();

const getPermission = async () => {
  const role = await GetPermissionByUserName();
  // const session = sessionStorage.getItem("linkPage");
  // console.log(role)
  const value = window.location.pathname.toString().toLowerCase();
  if (
    role === undefined &&
    !value.includes("line") &&
    !value.includes("auth")
  ) {
    history.push("/auth/login");
    // if (!role.data.error)
    //   if (role.data.data.filter((e) => e.id === 10).length > 0) {
    //     history.push(session ? session : "/admin/users");
    //   } else if (role.data.data.filter((e) => e.id === 1).length > 0) {
    //     history.push(
    //       session
    //         ? session === "/admin/users"
    //           ? "/admin/members"
    //           : session
    //         : "/admin/users"
    //     );
    //   } else {
    //     history.push("/admin/empty");
    //   }
  }
};

function App() {
  const [authState, setAuthState] = useState({
    email: "",
    id: 0,
    status: false,
    role: "",
  });

  useGaTracker();

  useEffect(() => {
    axios.get("/users/auth").then((response) => {
      if (response.data.error) {
        setAuthState({ ...authState, status: false });
      } else {
        setAuthState({
          email: response.data.email,
          id: response.data.id,
          status: true,
        });
      }
    });
    getPermission();
  }, []);

  return (
    <>
      <Provider store={store}>
        <ConnectedRouter history={history}>
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
        </ConnectedRouter>
      </Provider>
    </>
  );
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
