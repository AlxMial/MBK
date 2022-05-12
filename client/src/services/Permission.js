import { useEffect, useState } from "react";
import axios from "./axios";

export const getPermissionByUserName = (userName) => {
  

   async function fetchMyAPI() {
    let tbUser =  await axios.get(`users/permission/${localStorage.getItem("user")}`)
    return tbUser.data.tbUser.role;
  }

   return fetchMyAPI();
}