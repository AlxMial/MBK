/*eslint-disable*/
import React from "react";
import { Link } from "react-router-dom";

// components

import PagesDropdown from "components/Dropdowns/PagesDropdown.js";

export default function Navbar(props) {
  const [navbarOpen, setNavbarOpen] = React.useState(false);
  return (
    <>
      <nav className="top-0 absolute z-50 w-full flex flex-wrap items-center justify-between px-2 navbar-expand-lg bg-green-mbk padding-b">
        <div className="container  mx-auto flex flex-wrap items-center justify-between">
          <div className="w-full relative flex justify-between lg:w-auto lg:static lg:block lg:justify-start">
            <Link
              className="text-white text-sm font-bold leading-relaxed inline-block mr-4  whitespace-nowrap uppercase"
              to="/"
            >
              <img
                src={require("assets/img/mbk/logo_mbk.png").default}
                alt="..."
                className=" w-48 mt-1"
              ></img>
            </Link>
            {/* <button
              className="cursor-pointer text-xl leading-none px-3 py-1  border-solid border-transparent rounded bg-transparent block lg:hidden outline-none focus:outline-none"
              type="button"
              onClick={() => setNavbarOpen(!navbarOpen)}
            >
              <i className="text-white fas fa-bars"></i>
            </button> */}
          </div>
         
        </div>
      </nav>
    </>
  );
}
