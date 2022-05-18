
import axios from "./axios";

export const GetPermissionByUserName = (userName) => {


  async function fetchMyAPI() {
    let tbUser = await axios.get(
      `users/permission/${localStorage.getItem("user")}`
    );
    if(tbUser.data.error)
    {
      window.location.replace('/auth/login'); 
    }
    else
    {
      return tbUser.data.tbUser.role;
    }
  }

  return fetchMyAPI();
};
