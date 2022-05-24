import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";
// components
import AdminNavbar from "components/Navbars/AdminNavbar.js";
import Sidebar from "components/Sidebar/Sidebar.js";
import HeaderStats from "components/Headers/HeaderStats.js";
import FooterAdmin from "components/Footers/FooterAdmin.js";
// views
import UserList from "views/admin/user/Userlist";
import useWindowDimensions from "services/useWindowDimensions";
import UserInfo from "views/admin/user/UserInfo";
import MemberList from "views/admin/crm/member/Memberlist";
import MemberInfo from "views/admin/crm/member/MemberInfo";
import PointManage from "views/admin/crm/point/PointManage";
import StockInfo from "views/admin/ecommerce/stock/StockInfo";
import StockList from "views/admin/ecommerce/stock/Stocklist";
import empty from "views/empty";
import SettingShop from "views/admin/ecommerce/settingShop";
import ContentLoader from "components/Loadings/ContentLoader";
import ConditionRewardList from "views/admin/crm/conditionReward/conditionRewardlist";
import ConditioRewardInfo from "views/admin/crm/conditionReward/conditioRewardInfo";
import Stock from "views/admin/ecommerce/stock";
import Order from "views/admin/ecommerce/order";

export default function Admin() {

  const { height, width } = useWindowDimensions();
  return (
    <>
      <ContentLoader />
      <Sidebar />
      <div className="relative md:ml-72 bg-blueGray-100 ">
        <AdminNavbar />
        {/* Header */}
        <HeaderStats />
        <div
          className={
            "transprent-body bg-white mx-auto w-full border-5 rounded-lg   "
          }
        >
          <div
            className={
              " border-body px-4 minHeight " +
              (width < 1024 ? " pt-4" : " md:px-10 pt-12")
            }
          >
            <Switch>
              {/* <Route path="/admin/dashboard" exact component={Dashboard} />
              <Route path="/admin/maps" exact component={Maps} />
              <Route path="/admin/settings" exact component={Settings} />
              <Route path="/admin/tables" exact component={Tables} /> */}
              <Route path="/admin/empty" exact component={empty} />
              <Route path="/admin/users" exact component={UserList} />
              <Route path="/admin/usersinfo" exact component={UserInfo} />
              <Route path="/admin/usersinfo/:id" exact component={UserInfo} />
              <Route path="/admin/members" exact component={MemberList} />
              <Route path="/admin/membersinfo" exact component={MemberInfo} />
              <Route
                path="/admin/membersinfo/:id"
                exact
                component={MemberInfo}
              />
              <Route path="/admin/redemptions" exact component={ConditionRewardList} />
              <Route path="/admin/redemptionsinfo" exact component={ConditioRewardInfo} />
              <Route path="/admin/redemptionsinfo/:id" exact component={ConditioRewardInfo} />
              <Route path="/admin/settingShop" exact component={SettingShop} />
              {/* <Route path="/admin/stocks" exact component={StockList} /> */}
              <Route path="/admin/order" exact component={Order} />
              <Route path="/admin/stocks" exact component={Stock} />
              <Route path="/admin/stocksinfo" exact component={StockInfo} />
              <Route path="/admin/stocksinfo/:id" exact component={StockInfo} />
              <Route path="/admin/points" exact component={PointManage} />

              <Redirect from="/admin" to="/admin/users" />
            </Switch>
            {/* <FooterAdmin /> */}
          </div>

        </div>
      </div>
    </>
  );
}
