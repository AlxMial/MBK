import React from "react";
import { useHistory } from "react-router-dom";
import UserDropdown from "components/Dropdowns/UserDropdown.js";

export default function Navbar() {
  let history = useHistory();

  const OnLogOut = () => {
    sessionStorage.removeItem("accessToken");
    sessionStorage.removeItem("roleUser");
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("fullName");
    history.push("/auth/login");
  };

  return (
    <>
      {/* Navbar */}
      <nav className=" absolute w-full z-10 bg-transparent md:flex-row md:flex-nowrap md:justify-start flex items-center pt-4">
        <div className="w-full mx-autp items-center flex justify-between md:flex-nowrap flex-wrap md:px-10 px-4 Justify-right">
          {/* Brand */}
          {/* <a
            className="text-white text-sm uppercase hidden lg:inline-block font-semibold"
            href="#pablo"
            onClick={(e) => e.preventDefault()}
          >
          </a> */}
          {/* User */}
          <ul className="flex-col md:flex-row list-none items-center hidden md:flex text-white">
            <span className="mr-1">{sessionStorage.getItem("fullName")}</span>{" "}
            {" : "}{" "}
            <span onClick={(e) => OnLogOut()} className="ml-1 cursor-pointer">
              ออกจากระบบ
            </span>
          </ul>
        </div>
      </nav>
      {/* End Navbar */}
    </>
  );
}
