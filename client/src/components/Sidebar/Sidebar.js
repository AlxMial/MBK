/*eslint-disable*/
import React, { useState,useEffect } from "react";
import { Link,useHistory } from "react-router-dom";
import UserDropdown from "components/Dropdowns/UserDropdown.js";
import useWindowDimensions from "services/useWindowDimensions";
import { getPermissionByUserName } from "services/Permission";

export default function Sidebar() {
  const [collapseShow, setCollapseShow] = React.useState("hidden");
  const { height, width } = useWindowDimensions();
  const [ isCRM , setIsCRM ] = useState(false);
  const [ isEcommerce , setIsEcommerce ] = useState(false);
  const [ isReport , setIsReport ] = useState(false);
  const [typePermission, setTypePermission] = useState("");
  let history = useHistory();
  const ClickCRM = () => {
    setIsCRM(!isCRM);
  }

  const ClickEcommerce = () => {
    setIsEcommerce(!isEcommerce);
  }

  const ClickReport = () => {
    setIsReport(!isReport);
  }

  const fetchPermission = async  () => {
    const role = await getPermissionByUserName();
    setTypePermission(role);
    if(role === "3")
    {
      history.push("/admin/members");
      setIsCRM(true);
    } 
    else if (role === "2")
    {
      history.push("/admin/empty");
      setIsCRM(true);
    }
  }

  useEffect( () => {
    fetchPermission();
  }, []);


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
            to="/admin/users"
          >
            <div className="pc">
              <img
                src={require("assets/img/mbk/side_mbk.png").default}
                alt="..."
                className="mt-1"
              ></img>
            </div>
            <div className="mobile">
              <p className="text-white mb-0">ข้าวมาบุญครอง</p>
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
              <i className="fas fa-th"></i> <span className="px-2">เมนู</span>
            </h6>
            {/* Navigation */}
            <ul className="md:flex-col md:min-w-full flex flex-col list-none">
              <li className= {"items-center" + ((typePermission !== "1") ? " hidden" : " ")}>
                <Link
                  className={
                    "text-sm uppercase py-4 px-2 font-bold block " +
                    (window.location.href.indexOf("/admin/users") !== -1
                      ? "text-gold-mbk hover:text-gold-mbk"
                      : width < 765
                      ? " text-blueGray-700 hover:text-gold-mbk"
                      : " text-white hover:text-gold-mbk")
                  }
                  to="/admin/users"
                >
                  <i
                    className={
                      "fas fa-user-circle mr-2 text-sm " +
                      (window.location.href.indexOf("/admin/users") !== -1
                        ? "opacity-75"
                        : width < 765
                        ? " text-blueGray-700"
                        : " text-white")
                    }
                  ></i>{" "}
                  จัดการผู้ดูแลระบบ
                </Link>
              </li>

              <button
                type="button"
                className={
                  "flex items-center py-4 px-2 w-full text-sm font-normal bg-transparent outline-none button-focus" +
                  (width < 765 ? " text-blueGray-700" : " text-white") + ((typePermission === "2") ? " hidden" : " ")
                }

                onClick={()=> ClickCRM() }
              >
                <i className="fas fa-cog text-xs"></i>
                <span className="text-sm px-4 pt-1 font-bold block">CRM</span>
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </button>
              <ul
  
                className={"py-2 space-y-2" + ((isCRM) ? " block" : " hidden") +  ((typePermission === "2") ? " hidden" : " ")}
              >
                <li className="items-center">
                  <Link
                    className={
                      "text-sm uppercase py-3 pl-11 font-bold block " +
                      (window.location.href.indexOf("/admin/members") !== -1
                        ? "text-gold-mbk hover:text-gold-mbk"
                        : width < 765
                        ? " text-blueGray-700 hover:text-gold-mbk"
                        : " text-white hover:text-gold-mbk")
                    }
                    to="/admin/members"
                  >
                    <i
                      className={
                        "fas fa-user-friends mr-2 text-sm " +
                        (window.location.href.indexOf("/admin/members") !== -1
                          ? "opacity-75"
                          : width < 765
                          ? " text-blueGray-700"
                          : " text-white")
                      }
                    ></i>{" "}
                    จัดการสมาชิก
                  </Link>
                </li>
                <li className="items-center">
                  <Link
                    className={
                      "text-sm uppercase py-3 pl-11 font-bold block " +
                      (window.location.href.indexOf("/admin/points") !== -1
                        ? "text-gold-mbk hover:text-gold-mbk"
                        : width < 765
                        ? " text-blueGray-700 hover:text-gold-mbk"
                        : " text-white hover:text-gold-mbk")
                    }
                    to="/admin/points"
                  >
                    <i
                      className={
                        "fas fa-chess mr-2 text-sm " +
                        (window.location.href.indexOf("/admin/points") !== -1
                          ? "opacity-75"
                          : width < 765
                          ? " text-blueGray-700"
                          : " text-white")
                      }
                    ></i>{" "}
                    เงื่อนไขคะแนน
                  </Link>
                </li>
                {/* <li className="items-center">
                  <Link
                    className={
                      "text-sm uppercase py-3 pl-11 font-bold block " +
                      (window.location.href.indexOf("/admin/settings") !== -1
                        ? "text-gold-mbk hover:text-gold-mbk"
                        : width < 765
                        ? " text-blueGray-700 hover:text-gold-mbk"
                        : " text-white hover:text-gold-mbk")
                    }
                    to="/admin/settings"
                  >
                    <i
                      className={
                        "fas fa-gift mr-2 text-sm " +
                        (window.location.href.indexOf("/admin/settings") !== -1
                          ? "opacity-75"
                          : width < 765
                          ? " text-blueGray-700"
                          : " text-white")
                      }
                    ></i>{" "}
                    เงื่อนไขแลกของรางวัล
                  </Link>
                </li> */}
              </ul>

              {/* <button
                type="button"
                className={
                  "flex items-center py-4 px-2 w-full text-sm font-normal bg-transparent outline-none button-focus" +
                  (width < 765 ? " text-blueGray-700" : " text-white")
                }
                onClick={()=> ClickEcommerce() }
              >
                <i className="fas fa-shopping-cart text-xs"></i>
                <span className="text-sm px-4 pt-1 font-bold block">
                  E-Commerce
                </span>
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </button>
              <ul className={"py-2 space-y-2 " + ((isEcommerce) ? " block" : " hidden") }>
                <li className="items-center">
                  <Link
                    className={
                      "text-sm uppercase py-3 pl-11 font-bold block " +
                      (window.location.href.indexOf("/admin/dashboard") !== -1
                        ? "text-gold-mbk hover:text-gold-mbk"
                        : width < 765
                        ? " text-blueGray-700 hover:text-gold-mbk"
                        : " text-white hover:text-gold-mbk")
                    }
                    to="/admin/dashboard"
                  >
                    <i
                      className={
                        "fas fa-dolly mr-2 text-sm " +
                        (window.location.href.indexOf("/admin/dashboard") !== -1
                          ? "opacity-75"
                          : width < 765
                          ? " text-blueGray-700"
                          : " text-white")
                      }
                    ></i>{" "}
                    ตั้งค่าร้านค้า
                  </Link>
                </li>
                <li className="items-center">
                  <Link
                    className={
                      "text-sm uppercase py-3 pl-11 font-bold block " +
                      (window.location.href.indexOf("/admin/stocks") !== -1
                        ? "text-gold-mbk hover:text-gold-mbk"
                        : width < 765
                        ? " text-blueGray-700 hover:text-gold-mbk"
                        : " text-white hover:text-gold-mbk")
                    }
                    to="/admin/stocks"
                  >
                    <i
                      className={
                        "fas fa-store mr-2 text-sm " +
                        (window.location.href.indexOf("/admin/stocks") !== -1
                          ? "opacity-75"
                          : width < 765
                          ? " text-blueGray-700"
                          : " text-white")
                      }
                    ></i>{" "}
                    คลังสินค้า
                  </Link>
                </li>
                <li className="items-center">
                  <Link
                    className={
                      "text-sm uppercase py-3 pl-11 font-bold block " +
                      (window.location.href.indexOf("/admin/settings") !== -1
                        ? "text-gold-mbk hover:text-gold-mbk"
                        : width < 765
                        ? " text-blueGray-700 hover:text-gold-mbk"
                        : " text-white hover:text-gold-mbk")
                    }
                    to="/admin/settings"
                  >
                    <i
                      className={
                        "fas fa-receipt mr-2 text-sm " +
                        (window.location.href.indexOf("/admin/settings") !== -1
                          ? "opacity-75"
                          : width < 765
                          ? " text-blueGray-700"
                          : " text-white")
                      }
                    ></i>{" "}
                    รายการสั่งซื้อ
                  </Link>
                </li>
                <li className="items-center">
                  <Link
                    className={
                      "text-sm uppercase py-3 pl-11 font-bold block " +
                      (window.location.href.indexOf("/admin/settings") !== -1
                        ? "text-gold-mbk hover:text-gold-mbk"
                        : width < 765
                        ? " text-blueGray-700 hover:text-gold-mbk"
                        : " text-white hover:text-gold-mbk")
                    }
                    to="/admin/settings"
                  >
                    <i
                      className={
                        "fas fa-window-close mr-2 text-sm " +
                        (window.location.href.indexOf("/admin/settings") !== -1
                          ? "opacity-75"
                          : width < 765
                          ? " text-blueGray-700"
                          : " text-white")
                      }
                    ></i>{" "}
                    ยกเลิกและคืนสินค้า
                  </Link>
                </li>
              </ul> */}
              {/* <button
                type="button"
                className={
                  "flex items-center py-4 px-2 w-full text-sm font-normal bg-transparent outline-none button-focus" +
                  (width < 765 ? " text-blueGray-700" : " text-white")
                }
                onClick={()=> ClickReport() }
              >
                <i className="fas fa-scroll text-xs"></i>
                <span className="text-sm px-4 uppercase pt-1 font-bold block">
                  รายงาน
                </span>
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </button>
              <ul
                id="dropdown-example-report"
                className={" py-2 space-y-2 " + ((isReport) ? " block" : " hidden") }
              >
                <li className="items-center">
                  <Link
                    className={
                      "text-sm uppercase py-3 pl-11 font-bold block " +
                      (window.location.href.indexOf("/admin/dashboard") !== -1
                        ? "text-gold-mbk hover:text-gold-mbk"
                        : width < 765
                        ? " text-blueGray-700 hover:text-gold-mbk"
                        : " text-white hover:text-gold-mbk")
                    }
                    to="/admin/dashboard"
                  >
                    <i
                      className={
                        "fas fa-dice mr-2 text-sm " +
                        (window.location.href.indexOf("/admin/dashboard") !== -1
                          ? "opacity-75"
                          : width < 765
                          ? " text-blueGray-700"
                          : " text-white")
                      }
                    ></i>{" "}
                    คะแนน
                  </Link>
                </li>
                <li className="items-center">
                  <Link
                    className={
                      "text-sm uppercase py-3 pl-11 font-bold block " +
                      (window.location.href.indexOf("/admin/settings") !== -1
                        ? "text-gold-mbk hover:text-gold-mbk"
                        : width < 765
                        ? " text-blueGray-700 hover:text-gold-mbk"
                        : " text-white hover:text-gold-mbk")
                    }
                    to="/admin/settings"
                  >
                    <i
                      className={
                        "fas fa-gift mr-2 text-sm " +
                        (window.location.href.indexOf("/admin/settings") !== -1
                          ? "opacity-75"
                          : width < 765
                          ? " text-blueGray-700"
                          : " text-white")
                      }
                    ></i>{" "}
                    แลกของรางวัล
                  </Link>
                </li>
              </ul> */}
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}
