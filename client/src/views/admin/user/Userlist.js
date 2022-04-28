import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "services/axios";
import ReactPaginate from "react-paginate";
import Modal from "react-modal";
import ConfirmDialog from "components/ConfirmDialog/ConfirmDialog";
import * as Storage from "../../../services/Storage.service";
// components
Modal.setAppElement("#root");
const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    padding: "0%",
    transform: "translate(-50%, -50%)",
    overflowY: "auto",
    overflowX: "auto",
    backgroundColor: "#F1F5F9",
  },
  overlay: { zIndex: 100, backgroundColor: "rgba(70, 70, 70, 0.5)" },
};

export default function UserList() {
  const [listUser, setListUser] = useState([]);
  const [listSearch, setListSerch] = useState([]);
  const [pageNumber, setPageNumber] = useState(0);
  const [deleteNumber, setDeleteNumber] = useState(0);
  const [modalIsOpenSubject, setIsOpenSubject] = useState(false);
  const usersPerPage = 10;
  const pagesVisited = pageNumber * usersPerPage;

  const options = [
    { value: "1", label: "ผู้ดูแลระบบ" },
    { value: "2", label: "บัญชี" },
    { value: "3", label: "การตลาด" },
  ];

  /* Modal */
  function openModalSubject() {
    setIsOpenSubject(true);
  }

  function closeModalSubject() {
    setIsOpenSubject(false);
  }

  const InputSearch = (e) => {
    if (e === "") {
      setListUser(listSearch);
    } else {
      setListUser(
        listUser.filter(
          (x) =>
            x.firstName.includes(e) ||
            x.lastName.includes(e) ||
            x.email.includes(e) ||
            x.role.includes(e)
        )
      );
    }
  };

  const handleChange = (e) => {
    const { name, checked } = e.target;
    if (name === "allSelect") {
      let tempUser = listUser.map((user) => {
        return { ...user, isDeleted: checked };
      });
      setListUser(tempUser);
      setDeleteNumber(tempUser.filter((x) => x.isDeleted === true).length);
    } else {
      let tempUser = listUser.map((user) =>
        user.id.toString() === name
          ? {
              ...user,
              isDeleted: checked,
            }
          : user
      );
      setListUser(tempUser);
      setDeleteNumber(tempUser.filter((x) => x.isDeleted === true).length);
    }
  };

  const pageCount = Math.ceil(listUser.length / usersPerPage);

  const changePage = ({ selected }) => {
    setPageNumber(selected);
  };

  const ChangeSelect = (options, value) => {
    if (value === "") {
      value = "1";
    }
    return (value = options.filter((x) => x.value === value.toString())[0]
      .label);
  };

  /* API Deleted */
  const deleteByList = async () => {
    if (deleteNumber > 0) {
      var ArrayDeleted = [];
      listUser.forEach((field) => {
        if (field.isDeleted === true) {
          ArrayDeleted.push(field.id);
        } else field.isDeleted = false;
      });
      if (ArrayDeleted.length > 0) {
        console.log(ArrayDeleted);
        axios.delete(`/users/multidelete/${ArrayDeleted}`).then(() => {
          setDeleteNumber(0);
          setListUser(
            listUser.filter((val) => {
              return val.isDeleted !== true;
            })
          );
        });
      }
      closeModalSubject();
    }
  };

  const deleteUser = (e) => {
    axios.delete(`/users/${e}`).then(() => {
      setListUser(
        listUser.filter((val) => {
          return val.id !== e;
        })
      );
      closeModalSubject();
    });
  };

  useEffect(() => {
    axios.get("users").then((response) => {
      if (response.data.error) {
      } else {
        response.data.tbUser.forEach(
          (value) => (value.role = ChangeSelect(options, value.role))
        );
        setListUser(response.data.tbUser);
        setListSerch(response.data.tbUser);
      }
    });
  }, []);

  return (
    <>
      <div className="flex flex-warp">
        <span className="text-base font-bold margin-auto-t-b">
          <i className="fas fa-user-circle"></i>&nbsp;
        </span>
        <span className="text-base margin-auto font-bold">ข้อมูลผู้ใช้</span>
      </div>

      <div className="flex flex-wrap ">
        <div className="w-full px-4">
          <div className="flex flex-warp py-2 mt-6 ">
            <span className="text-lg  text-green-mbk margin-auto font-bold">
              จัดการข้อมูลผู้ใช้
            </span>
          </div>
          <div
            className={
              "relative flex flex-col min-w-0 break-words w-full mb-6 border rounded bg-white"
            }
          >
            <div className="rounded-t mb-0 px-4 py-3 border-0">
              <div className="w-full mx-autp items-center flex justify-between md:flex-nowrap flex-wrap ">
                <div className="lg:w-6/12">
                  <span className="z-3 h-full leading-snug font-normal text-center text-blueGray-300 absolute bg-transparent rounded text-base items-center justify-center pl-3 py-2">
                    <i className="fas fa-search"></i>
                  </span>
                  <input
                    type="text"
                    placeholder="Search here..."
                    className="border-0 pl-12 w-64 placeholder-blueGray-300 text-blueGray-600 relative bg-white rounded-xl text-sm shadow outline-none focus:outline-none focus:ring"
                    onChange={(e) => {
                      InputSearch(e.target.value);
                    }}
                  />
                </div>
                <div className="lg:w-6/12 text-right">
                  <Link to="/admin/usersinfo">
                    <button
                      className="bg-gold-mbk text-black active:bg-gold-mbk font-bold  text-xs px-2 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none  ease-linear transition-all duration-150"
                      type="button"
                    >
                      <i className="fas fa-plus-circle text-white "></i>{" "}
                      <span className="text-white text-sm px-2">
                        เพิ่มข้อมูล
                      </span>
                    </button>
                  </Link>
                </div>
                {/* Brand */}
                {/* <div className={"font-semibold text-lg text-blueGray-700"}>
                  <span className="z-3 h-full leading-snug font-normal text-center text-blueGray-300 absolute bg-transparent rounded text-base items-center justify-center pl-3 py-2">
                    <i className="fas fa-search"></i>
                  </span>
                  <input
                    type="text"
                    placeholder="Search here..."
                    className="border-0 pl-12 placeholder-blueGray-300 text-blueGray-600 relative bg-white bg-white rounded text-sm shadow outline-none focus:outline-none focus:ring w-full pl-12"
                    onChange={(e) => {
                      InputSearch(e.target.value);
                    }}
                  />
                </div> */}

                {/* <h3 className={"font-semibold px-2 text-lg text-blueGray-700"}>
                  |
                </h3>
                <h3 className={"font-semibold text-sm text-blueGray-700"}>
                  {listUser.length} รายการ
                </h3>
                <h3
                  className={
                    "font-semibold text-sm text-blueGray-700 leading-2" +
                    (deleteNumber > 0 ? " block" : " hidden")
                  }
                >
                  &nbsp;{" "}
                  <i
                    className="fas fa-trash text-red-500 cursor-pointer"
                    onClick={() => {
                      openModalSubject();
                    }}
                  ></i>{" "}
                  &nbsp;
                  <span className="text-sm">ลบข้อมูล {deleteNumber} รายการ</span>
                  <ConfirmDialog
                    showModal={modalIsOpenSubject}
                    message={
                      Storage.GetLanguage() === "th"
                        ? "จัดการบัญชีผู้ใช้"
                        : "Account Management"
                    }
                    hideModal={() => {
                      closeModalSubject();
                    }}
                    confirmModal={() => {
                      deleteByList();
                    }}
                  />
                </h3> */}
                {/* Form */}
                {/* <form className="md:flex hidden flex-row flex-wrap items-center lg:ml-auto mr-3">
                  <div className="relative flex w-full flex-wrap items-stretch">
                    <span className="z-10 h-full leading-snug font-normal absolute text-center text-blueGray-300 absolute bg-transparent rounded text-base items-center justify-center pl-3 py-2">
                      <i className="fas fa-search"></i>
                    </span>
                    <input
                      type="text"
                      placeholder="Search here..."
                      className="border-0 pl-12 placeholder-blueGray-300 text-blueGray-600 relative bg-white bg-white rounded text-sm shadow outline-none focus:outline-none focus:ring w-full pl-12"
                      onChange={(e) => {
                        InputSearch(e.target.value);
                      }}
                    />
                  </div>
                </form> */}
                {/* User */}
                {/* <ul className="flex-col md:flex-row list-none items-center hidden md:flex">
                  <Link to="/admin/usersinfo">
                    <button
                      className="bg-gold-mbk text-black active:bg-gold-mbk font-bold  text-xs px-2 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none  ease-linear transition-all duration-150"
                      type="button"
                    >
                      <i className="fas fa-plus-circle text-white "></i>{" "}
                      <span className="text-white text-sm px-2">
                        เพิ่มข้อมูล
                      </span>
                    </button>
                  </Link>
                </ul> */}
              </div>
            </div>
            <div className="block w-full overflow-x-auto  px-4 py-2">
              {/* Projects table */}
              <table className="items-center w-full  border ">
                <thead>
                  <tr>
                    <th
                      className={
                        "px-6 align-middle border border-solid py-3 text-sm  border-l-0 border-r-0 whitespace-nowrap font-semibold text-center bg-blueGray-50 text-blueGray-500 "
                      }
                    >
                      {/* <input
                        type="checkbox"
                        name="allSelect"
                        checked={
                          !listUser.some(
                            (users) => users?.isDeleted !== true
                          )
                        }
                        onChange={handleChange}
                        className="form-checkbox rounded text-green-200-mju w-5 h-5 ease-linear transition-all duration-150"
                      /> */}
                      ลำดับที่
                    </th>
                    <th
                      className={
                        "px-2  border border-solid py-3 text-sm  border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-50 text-blueGray-500 "
                      }
                    >
                      User name
                    </th>
                    <th
                      className={
                        "px-2  border border-solid py-3 text-sm  border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-50 text-blueGray-500 "
                      }
                    >
                      Role
                    </th>
                    <th
                      className={
                        "px-2  border border-solid py-3 text-sm  border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-50 text-blueGray-500 "
                      }
                    >
                      ชื่อ - นามสกุล
                    </th>
                    <th
                      className={
                        "px-2  border border-solid py-3 text-sm  border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-50 text-blueGray-500 "
                      }
                    >
                      Email
                    </th>
                    <th
                      className={
                        "px-2  border border-solid py-3 text-sm  border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-50 text-blueGray-500 "
                      }
                    >
                      เลขบัตรประชาชน
                    </th>
                    <th
                      className={
                        "px-2  border border-solid py-3 text-sm  border-l-0 border-r-0 whitespace-nowrap font-semibold text-center bg-blueGray-50 text-blueGray-500 "
                      }
                    >
                      จัดการ
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {listUser
                    .slice(pagesVisited, pagesVisited + usersPerPage)
                    .map(function (value, key) {
                      return (
                        <tr key={key}>
                          <td className="border-t-0 px-2 align-middle border-b border-l-0 border-r-0 text-sm whitespace-nowrap p-3 text-center cursor-pointer">
                            {/* <input
                              type="checkbox"
                              name={value.id}
                              checked={value?.isDeleted || false}
                              onChange={handleChange}
                              className="form-checkbox rounded text-green-200-mju w-5 h-5 ease-linear transition-all duration-150"
                            /> */}
                            <span className="px-4 margin-a">{key + 1}</span>
                          </td>
                          <td className="border-t-0 px-2 align-middle border-b border-l-0 border-r-0 text-sm whitespace-nowrap text-left cursor-pointer">
                            <Link className="text-gray-mbk hover:text-gray-mbk " to={`/admin/usersinfo/${value.id}`}>
                              {value.userName}
                            </Link>
                          </td>
                          <td className="border-t-0 px-2 align-middle border-b border-l-0 border-r-0 text-sm whitespace-nowrap text-left cursor-pointer">
                            <Link className="text-gray-mbk hover:text-gray-mbk " to={`/admin/usersinfo/${value.id}`}>
                              <div className="TextWordWarpCode">
                                {value.role}
                              </div>
                            </Link>
                          </td>
                          <td className="border-t-0 px-2 align-middle border-b border-l-0 border-r-0 text-sm whitespace-nowrap text-left cursor-pointer">
                            <Link className="text-gray-mbk hover:text-gray-mbk " to={`/admin/usersinfo/${value.id}`}>
                              {value.firstName} {value.lastName}
                            </Link>
                          </td>
                          <td className="border-t-0 px-2 align-middle border-b border-l-0 border-r-0 text-sm whitespace-nowrap text-left cursor-pointer">
                            <Link className="text-gray-mbk hover:text-gray-mbk " to={`/admin/usersinfo/${value.id}`}>
                              {value.email}
                            </Link>
                          </td>
                          <td className="border-t-0 px-2 align-middle border-b border-l-0 border-r-0 text-sm whitespace-nowrap text-left ">
                            <Link className="text-gray-mbk hover:text-gray-mbk " to={`/admin/usersinfo/${value.id}`}>
                              {value.identityCard}
                            </Link>
                          </td>
                          <td className="border-t-0 px-2 align-middle border-b border-l-0 border-r-0 text-sm whitespace-nowrap text-center ">
                            <i
                              className="fas fa-trash text-red-500 cursor-pointer"
                              onClick={() => {
                                openModalSubject();
                              }}
                            ></i>
                            <ConfirmDialog
                              showModal={modalIsOpenSubject}
                              message={
                                Storage.GetLanguage() === "th"
                                  ? "จัดการข้อมูลผู้ใช้"
                                  : "Users Management"
                              }
                              hideModal={() => {
                                closeModalSubject();
                              }}
                              confirmModal={() => {
                                deleteUser(value.id);
                              }}
                            />
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
            <div className="py-4">
              <ReactPaginate
                previousLabel={" < "}
                nextLabel={" > "}
                pageCount={pageCount}
                onPageChange={changePage}
                containerClassName={"paginationBttns"}
                previousLinkClassName={"previousBttn"}
                nextLinkClassName={"nextBttn"}
                disabledClassName={"paginationDisabled"}
                activeClassName={"paginationActive"}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
