/*eslint-disable*/
import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import UserDropdown from "components/Dropdowns/UserDropdown.js";
import useWindowDimensions from "services/useWindowDimensions";
import { GetPermissionByUserName } from "services/Permission";
import ModuleButton from "./moduleButton";

export default function Sidebar() {
  const [collapseShow, setCollapseShow] = React.useState("hidden");
  const { height, width } = useWindowDimensions();
  const [isCRM, setIsCRM] = useState(false);
  const [isEcommerce, setIsEcommerce] = useState(false);
  const [isReport, setIsReport] = useState(false);
  const [typePermission, setTypePermission] = useState("");
  const [menuList, setMenuList] = useState([]);
  const [showMenu, setShowMenu] = useState("");
  let history = useHistory();
  const ClickCRM = () => {
    setIsCRM(!isCRM);
  };

  const ClickEcommerce = () => {
    setIsEcommerce(!isEcommerce);
  };

  const ClickReport = () => {
    setIsReport(!isReport);
  };

  const fetchPermission = async () => {
    const role = await GetPermissionByUserName();
    if (role !== undefined) {
      if (role.data.data.length > 0) {
        if (role.data.data.filter((e) => e.id === 10).length > 0) {
            setTypePermission("1"); 
        } else if (role.data.data.filter((e) => e.id === 1).length > 0) {
          setTypePermission("3");
        } else {
          setTypePermission("2");
        }
      }
      setMenuList(role.data.data);
    }
  };

  const onSession = (link) => {
    sessionStorage.setItem("linkPage", link);
  };

  useEffect(() => {
    fetchPermission();
  }, []);

  const linkClassName = (href) => {
    const isAdmin = href.includes("users") ? "px-2" : "pl-11";
    return (
      "text-sm uppercase py-3 font-bold block " +
      isAdmin +
      (window.location.href.indexOf(href) !== -1
        ? " text-gold-mbk hover:text-gold-mbk"
        : width < 765
        ? " text-blueGray-700 hover:text-gold-mbk"
        : " text-white hover:text-gold-mbk")
    );
  };

  const iClassName = (href, icon) => {
    return (
      icon +
      " mr-2 text-sm " +
      (window.location.href.indexOf(href) !== -1
        ? "opacity-75"
        : width < 765
        ? " text-blueGray-700"
        : " text-white")
    );
  };

  // const menuList = [
  //   { id: 1, module: 'crm', link: '/admin/members', label: '????????????????????????????????????', icon: 'fas fa-users-cog' },
  //   { id: 2, module: 'crm', link: '/admin/points', label: '???????????????????????????????????????', icon: 'fas fa-coins' },
  //   { id: 3, module: 'crm', link: '/admin/redemptions', label: '????????????????????????????????????????????????????????????', icon: 'fas fa-gift' },
  //   { id: 4, module: 'ecommerce', link: '/admin/settingShop', label: '??????????????????????????????????????????', icon: 'fas fa-store' },
  //   { id: 5, module: 'ecommerce', link: '/admin/stocks', label: '??????????????????????????????', icon: 'fas fa-warehouse' },
  //   { id: 6, module: 'ecommerce', link: '/admin/order', label: '??????????????????????????????????????????', icon: 'fas fa-shopping-basket' },
  //   { id: 7, module: 'ecommerce', link: '/admin/cancelAndReturn', label: '??????????????????????????????????????????????????????', icon: 'fas fa-undo-alt'},
  //   { id: 8, module: 'report', link: '/admin/pointHistoryReport', label: '??????????????????????????????????????????????????????????????????????????? Code ????????????????????????????????????'},
  //   { id: 9, module: 'report', link: '/admin/collectPointsReport', label: '?????????????????????????????????????????????'},
  // ]

  return (
    <>
      <nav className=" bg-green-mbk md:left-0 md:block md:fixed md:top-0 md:bottom-0 md:overflow-y-auto md:flex-row md:flex-nowrap md:overflow-hidden shadow-xl flex flex-wrap items-center justify-between relative md:w-72 z-10 py-2 px-6">
        <div className=" bg-green-mbk md:flex-col md:items-stretch md:min-h-full md:flex-nowrap px-0 flex flex-wrap items-center justify-between w-full mx-auto">
          {/* Toggler */}
          <button
            className="cursor-pointer text-white  md:hidden px-3 py-1 text-xl leading-none rounded"
            type="button"
            onClick={() => setCollapseShow("bg-white m-2 py-3 px-6")}
          >
            <i className="fas fa-bars"></i>
          </button>
          {/* Brand */}
          <Link
            className="md:block text-left md:pb-2 text-white mr-0 inline-block whitespace-nowrap text-xl uppercase font-bold p-4 px-0"
            to={
              typePermission === "2"
                ? "/admin/order"
                : typePermission === "3"
                ? "/admin/members"
                : "/admin/users"
            }
          >
            <div className="pc">
              <img
                src={require("assets/img/mbk/side_mbk.png").default}
                alt="..."
                className="mt-1"
              ></img>
            </div>
            <div className="mobile">
              <p className="text-white mb-0">???????????????????????????????????????</p>
            </div>
          </Link>
          {/* User */}
          <ul className="md:hidden items-center flex flex-wrap list-none margin-auto-t-b">
            <li className="inline-block relative">
              <UserDropdown />
            </li>
          </ul>
          {/* Collapse */}
          <div
            className={
              "md:flex md:flex-col md:items-stretch md:opacity-100 md:relative md:mt-4 md:shadow-none shadow absolute top-0 left-0 right-0 z-40 overflow-y-auto overflow-x-hidden h-auto items-center flex-1 rounded " +
              collapseShow
            }
          >
            {/* Collapse header */}
            <div className="md:min-w-full md:hidden block pb-2 mb-2">
              <div className="flex flex-wrap">
                <div className="w-6/12">
                  <Link
                    className="md:block text-left md:pb-2 text-blueGray-600 mr-0 inline-block whitespace-nowrap text-sm uppercase font-bold p-4 px-0"
                    to="/"
                  >
                    <img
                      src={require("assets/img/mbk/side_mbk.png").default}
                      alt="..."
                      className="w-48 mt-1"
                    ></img>
                  </Link>
                </div>
                <div className="w-6/12 flex justify-end">
                  <button
                    type="button"
                    className="cursor-pointer text-black opacity-50 md:hidden px-3 py-1 text-xl leading-none bg-transparent rounded border border-solid border-transparent"
                    onClick={() => setCollapseShow("hidden")}
                  >
                    <i className="fas fa-times"></i>
                  </button>
                </div>
              </div>
            </div>
            {/* Form */}

            {/* Heading */}
            <h6
              className={
                "md:min-w-full  text-sm uppercase font-bold block pt-1 pb-4 no-underline text-center" +
                (width < 765 ? " text-blueGray-700" : " text-white")
              }
            >
              <i className="fas fa-th"></i> <span className="px-2">????????????</span>
            </h6>
            {/* Navigation */}
            <ul className="md:flex-col md:min-w-full flex flex-col list-none">
              <li
                className={
                  "items-center" +
                  (menuList.filter((e) => e.id.toString().includes(10)).length > 0
                    ? " "
                    : " hidden")
                }
              >
                <Link
                  to="/admin/users"
                  onClick={() => onSession("/admin/users")}
                  className={linkClassName("/admin/users")}
                >
                  <i
                    className={iClassName(
                      "/admin/users",
                      "fas fa-user-friends"
                    )}
                  ></i>
                  ???????????????????????????????????????????????????
                </Link>
              </li>
              <ModuleButton
                onClick={() => ClickCRM()}
                label="CRM"
                icon="fas fa-cog"
                typePermission={typePermission}
              />
              <ul
                className={
                  "py-2 space-y-2" +
                  (isCRM ? " block" : " hidden") +
                  (typePermission === "2" ? " " : " ")
                }
              >
                {menuList
                  .filter((m) => m.module === "crm")
                  .map((item) => {
                    return (
                      <li className="items-center" key={item.id}>
                        <Link
                          to={item.link}
                          onClick={() => onSession(item.link)}
                          className={linkClassName(item.link)}
                        >
                          <i className={iClassName(item.link, item.icon)}></i>
                          {item.label}
                        </Link>
                      </li>
                    );
                  })}
              </ul>
              <ModuleButton
                onClick={() => ClickEcommerce()}
                label="E-Commerce"
                icon="fas fa-shopping-cart"
                typePermission={typePermission}
              />
              <ul
                className={
                  "py-2 space-y-2 " + (isEcommerce ? " block" : " hidden")
                }
              >
                {menuList
                  .filter((m) => m.module === "ecommerce")
                  .map((item) => {
                    return (
                      <li className="items-center" key={item.id}>
                        <Link
                          to={item.link}
                          onClick={() => onSession(item.link)}
                          className={linkClassName(item.link)}
                        >
                          <i className={iClassName(item.link, item.icon)}></i>
                          {item.label}
                        </Link>
                      </li>
                    );
                  })}
              </ul>
              <ModuleButton
                onClick={() => ClickReport()}
                label="Report"
                icon="fas fa-file"
                typePermission={typePermission}
              />
              <ul
                className={
                  " space-y-2 " + (isReport ? " block" : " hidden")
                }
              >
                {menuList
                  .filter((m) => m.module === "report")
                  .map((item) => {
                    return (
                      <li className="items-center" key={item.id}>
                        <Link
                          to={item.link}
                          onClick={() => onSession(item.link)}
                          className={linkClassName(item.link)}
                        >
                          {/* <i className={iClassName(item.link, item.icon)}></i> */}
                          {item.label}
                        </Link>
                      </li>
                    );
                  })}
              </ul>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}
