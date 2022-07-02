
import axios from "./axios";

export const GetPermissionByUserName = () => {
  async function fetchMyAPI() {
    try{ 
      let tbMenus = await axios.get("menus");
      if(tbMenus.data.error) {
        if(!window.location.pathname.includes('line') && !window.location.pathname.includes('auth'))
        {
          if(window.location.pathname !== "/auth/login") { 
            // window.location.replace('/auth/login');
          }
        }
        // if(!window.location.pathname.includes('line')) {
     
        // }
      } else { 
        return tbMenus;
      }
    }catch (err) {
      // window.location.replace('/auth/login'); 
      //history.push('/auth/login');
    }

  }
  return fetchMyAPI();
};

export const GetPermissionControl = (menuId) => {
  async function fetchMyAPI() {
    let tbPermission = await axios.post("permission",{menuId:menuId});
    // console.log(tbPermission);
    return tbPermission;
  }
  return fetchMyAPI();
};