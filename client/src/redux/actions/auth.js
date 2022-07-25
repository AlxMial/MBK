import {
    LOGOUT,
  } from "../actionTypes";
  
  import AuthService from "../services/auth.service";
  
  export const logout = () => (dispatch) => {
    AuthService.logout();
    dispatch({
      type: LOGOUT,
    });
  };