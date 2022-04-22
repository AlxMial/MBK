import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";

// components

import AdminNavbar from "components/Navbars/AdminNavbar.js";
import Sidebar from "components/Sidebar/Sidebar.js";
import HeaderStats from "components/Headers/HeaderStats.js";
import FooterAdmin from "components/Footers/FooterAdmin.js";

// views

import Dashboard from "views/admin/Dashboard.js";
import Maps from "views/admin/Maps.js";
import Settings from "views/admin/Settings.js";
import Tables from "views/admin/Tables.js";
import UserList from "views/admin/user/Userlist";
import useWindowDimensions from "services/useWindowDimensions"; 
import UserInfo from "views/admin/user/UserInfo";

export default function Admin() {
  const { height, width } = useWindowDimensions();
  return (
    <>
      <Sidebar />
      <div className="relative md:ml-72 bg-blueGray-100 ">
        <AdminNavbar />
        {/* Header */}
        <HeaderStats />
        <div className={"transprent-body bg-white mx-auto w-full border-5 rounded-lg minHeightInfo  "}>
          <div className={ " border-body px-4" +((width<1024)? " pt-4" : " md:px-10 pt-12")}>
            <Switch>
              <Route path="/admin/dashboard" exact component={Dashboard} />
              <Route path="/admin/maps" exact component={Maps} />
              <Route path="/admin/settings" exact component={Settings} />
              <Route path="/admin/tables" exact component={Tables} />
              <Route path="/admin/users" exact component={UserList} />
              <Route path="/admin/usersinfo" exact component={UserInfo} />
              <Route path="/admin/usersinfo/:id" exact component={UserInfo} />
              <Redirect from="/admin" to="/admin/dashboard" />
            </Switch>
            <FooterAdmin />
          </div>
        </div>
      </div>
    </>
  );
}
