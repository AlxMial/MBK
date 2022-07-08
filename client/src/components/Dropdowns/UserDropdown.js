import React,{useEffect,useContext, useState} from "react";
import { createPopper } from "@popperjs/core";
import { useHistory, Link } from "react-router-dom";
import { AuthContext } from '../../services/AuthContext';

const UserDropdown = () => {
  // dropdown props
  const [dropdownPopoverShow, setDropdownPopoverShow] = React.useState(false);
  const [isDropDown, setIsDropDown] = React.useState(true);
  const btnDropdownRef = React.createRef();
  const popoverDropdownRef = React.createRef();
  const { authState } = useContext(AuthContext);
  const [fullName , setFullName] = useState('');
  let history = useHistory();
  const openDropdownPopover = () => {
    createPopper(btnDropdownRef.current, popoverDropdownRef.current, {
      placement: "bottom-start",
    });
    setDropdownPopoverShow(true);
  };
  const closeDropdownPopover = () => {
    setDropdownPopoverShow(false);
  };

  const OnLogOut = () => {
    sessionStorage.removeItem("accessToken");
    sessionStorage.removeItem("roleUser");
    sessionStorage.removeItem("username");
    sessionStorage.removeItem("fullName");
    history.push("/auth/login");
  }

  useEffect(() => {
    const getFullName = sessionStorage.getItem('fullName');
    setFullName(getFullName);
    const checkIfClickedOutside = (e) => {
      setIsDropDown(true);
      if (dropdownPopoverShow && e.toElement.id !== "member" && e.toElement.id !== "username" && e.toElement.id !== "logout"  && e.toElement.id !== "user" &&  btnDropdownRef.current || e.toElement.id === "") {
          setDropdownPopoverShow(false);
          if(dropdownPopoverShow)
            setIsDropDown(false);
      }
    };
    document.addEventListener("mousedown", checkIfClickedOutside);

    return () => {
      document.removeEventListener("mousedown", checkIfClickedOutside);
    };
  }, [dropdownPopoverShow]);

  return (
    <>
      <a
        className="text-blueGray-500 block"
        href="#pablo"
        ref={btnDropdownRef}
        onClick={(e) => {
          (dropdownPopoverShow || !isDropDown) ? closeDropdownPopover() : openDropdownPopover();
        }}
      >
        <div className="items-center flex">
          <span className="w-10 h-10 text-sm text-white  inline-flex items-center justify-center rounded-full">
            <img
              alt="..."
              className="w-full rounded-full align-middle border-none"
              src={require("assets/img/mbk/user-no-profile.png").default}
            />
          </span>
        </div>
      </a>
      <div
        ref={popoverDropdownRef}
        className={
          (dropdownPopoverShow ? "block " : "hidden ") +
          "bg-white text-base z-50 float-left py-4 list-none text-left rounded shadow-lg min-w-48 margin-t-im "
        }
        id="UserMenu"
      >
        <a
          href="#pablo"
          className={
            "text-sm py-2 text-center px-2 hover:text-gold-mbk font-normal block w-full whitespace-nowrap bg-transparent text-black font-bold"
          }
          onClick={(e) => e.preventDefault()}
          id="member"
        >
          { fullName }
        </a>
        <hr className="w-10/12 margin-a bg-green-mbk" style={{borderTop: '1px solid #047738',  opacity:'0.25'}}/>
        <a
          href="#pablo"
          className={
            "text-sm hover:text-gold-mbk text-center py-2 px-2 font-normal block w-full whitespace-nowrap bg-transparent text-black font-bold"
          }
          onClick={(e) => OnLogOut()}
          id="logout"
        >
          ออกจากระบบ
        </a>
      </div>
    </>
  );
};

export default UserDropdown;
