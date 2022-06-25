
import axios from "./axios";

export const GetPermissionByUserName = () => {
  async function fetchMyAPI() {
    try{ 
    let tbMenus = await axios.get("menus");
    return tbMenus;
    }catch {
      window.location.replace('/auth/login'); 
    }

  }
  return fetchMyAPI();
};

export const GetPermissionControl = (menuId) => {
  async function fetchMyAPI() {
    let tbPermission = await axios.post("permission",{menuId:menuId});
    return tbPermission;
  }
  return fetchMyAPI();
};