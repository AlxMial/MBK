import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "services/axios";
import ReactPaginate from "react-paginate";
import Modal from "react-modal";
import ConfirmDialog from "components/ConfirmDialog/ConfirmDialog";
import { exportExcel } from "services/exportExcel";
import { GetPermissionByUserName } from "services/Permission";
import moment from "moment";
import Spinner from "components/Loadings/spinner/Spinner";
import * as Address from "../../../../services/GetAddress.js";
import { useDispatch } from "react-redux";
import { fetchLoading, fetchSuccess } from "redux/actions/common";

// components
Modal.setAppElement("#root");

export default function MemberList() {
  const [listUser, setListUser] = useState([]);
  const [listSearch, setListSerch] = useState([]);
  const [pageNumber, setPageNumber] = useState(0);
  const [modalIsOpenSubject, setIsOpenSubject] = useState(false);
  const [deleteValue, setDeleteValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [typePermission, setTypePermission] = useState("");
  const usersPerPage = 10;
  const pagesVisited = pageNumber * usersPerPage;
  const dispatch = useDispatch();

  /* Modal */
  function openModalSubject(id) {
    setDeleteValue(id);
    setIsOpenSubject(true);
  }

  function closeModalSubject() {
    setIsOpenSubject(false);
  }

  const InputSearch = (e) => {
    e = e.toLowerCase();
    if (e === "") {
      setListUser(listSearch);
    } else {
      setListUser(
        listSearch.filter(
          (x) =>
            x.firstName.toLowerCase().includes(e) ||
            x.lastName.toLowerCase().includes(e) ||
            x.email.toLowerCase().includes(e) ||
            x.phone.includes(e) ||
            x.birthDate.toString().includes(e) ||
            x.registerDate.toString().includes(e)
        )
      );
      setPageNumber(0);
    }
  };

  // const handleChange = (e) => {
  //   const { name, checked } = e.target;
  //   if (name === "allSelect") {
  //     let tempUser = listUser.map((user) => {
  //       return { ...user, isDeleted: checked };
  //     });
  //     setListUser(tempUser);
  //     setDeleteNumber(tempUser.filter((x) => x.isDeleted === true).length);
  //   } else {
  //     let tempUser = listUser.map((user) =>
  //       user.id.toString() === name
  //         ? {
  //             ...user,
  //             isDeleted: checked,
  //           }
  //         : user
  //     );
  //     setListUser(tempUser);
  //     setDeleteNumber(tempUser.filter((x) => x.isDeleted === true).length);
  //   }
  // };

  const pageCount = Math.ceil(listUser.length / usersPerPage);

  const changePage = ({ selected }) => {
    setPageNumber(selected);
  };

  /* API Deleted */
  // const deleteByList = async () => {
  //   if (deleteNumber > 0) {
  //     var ArrayDeleted = [];
  //     listUser.forEach((field) => {
  //       if (field.isDeleted === true) {
  //         ArrayDeleted.push(field.id);
  //       } else field.isDeleted = false;
  //     });
  //     if (ArrayDeleted.length > 0) {
  //       console.log(ArrayDeleted);
  //       axios.delete(`/members/multidelete/${ArrayDeleted}`).then(() => {
  //         setDeleteNumber(0);
  //         setListUser(
  //           listUser.filter((val) => {
  //             return val.isDeleted !== true;
  //           })
  //         );
  //       });
  //     }
  //     closeModalSubject();
  //   }
  // };

  const deleteUser = (e) => {
    axios.delete(`/members/${e}`).then(() => {
      setListUser(
        listUser.filter((val) => {
          return val.id !== e;
        })
      );
      closeModalSubject();
    });
  };

  const Excel = async (sheetname) => {
    setIsLoading(true);
    let member = await axios.get("members/export");
    const TitleColumns = [
      "รหัสสมาชิก",
      "ชื่อ",
      "นามสกุล",
      "เบอร์โทร",
      "อีเมล",
      "ที่อยู่",
      "วันเกิด",
      "วันที่สมัคร",
      "จังหวัด",
      "อำเภอ",
      "ตำบล",
      "รหัสไปรษณีย์",
      "คะแนนสมาชิก",
    ];
    const columns = [
      "memberCard",
      "firstName",
      "lastName",
      "phone",
      "email",
      "address",
      "birthDate",
      "registerDate",
      "province",
      "district",
      "subDistrict",
      "postcode",
      "memberPoint",
    ];
    for (var i = 0; i < member.data.tbMember.length; i++) {
      member.data.tbMember[i]["province"] = await Address.getAddressName(
        "province",
        member.data.tbMember[i]["province"]
      );
      member.data.tbMember[i]["district"] = await Address.getAddressName(
        "district",
        member.data.tbMember[i]["district"]
      );
      member.data.tbMember[i]["subDistrict"] = await Address.getAddressName(
        "subDistrict",
        member.data.tbMember[i]["subDistrict"]
      );
    }
    exportExcel(
      member.data.tbMember,
      "ข้อมูลสมาชิก",
      TitleColumns,
      columns,
      sheetname
    );
    setIsLoading(false);
  };

  const fetchPermission = async () => {
    dispatch(fetchLoading());
    axios.get("members").then((response) => {
      dispatch(fetchSuccess());
      if (response.data.error) {
        console.log(response.data.error);
      } else {
        setListUser(response.data.tbMember);
        setListSerch(response.data.tbMember);
      }
    });
    // const role = await GetPermissionByUserName();
    // if (role.data.data.filter((e) => e.id === 10).length > 0) {
    //   setTypePermission("1");
    //   axios.get("members/Show").then((response) => {
    //     dispatch(fetchSuccess());
    //     if (response.data.error) {
    //       console.log(response.data.error);
    //     } else {
    //       setListUser(response.data.tbMember);
    //       setListSerch(response.data.tbMember);
    //     }
    //   });
    // } else if (role.data.data.filter((e) => e.id === 1).length > 0) {
    //   setTypePermission("3");
    //   axios.get("members").then((response) => {
    //     dispatch(fetchSuccess());
    //     if (response.data.error) {
    //       console.log(response.data.error);
    //     } else {
    //       setListUser(response.data.tbMember);
    //       setListSerch(response.data.tbMember);
    //     }
    //   });
    // } else {
    //   dispatch(fetchSuccess());
    //   setTypePermission("2");
    // }
  };

  useEffect(() => {
    fetchPermission();
  }, []);

  return (
    <>
      {isLoading ? (
        <>
          {" "}
          <Spinner customText={"Loading"} />
        </>
      ) : (
        <></>
      )}
      {/* <div className="flex flex-warp">
        <span className="text-sm font-bold margin-auto-t-b">
          <i className="fas fa-user-friends"></i>&nbsp;
        </span>
        <span className="text-base margin-auto font-bold">จัดการสมาชิก</span>
      </div> */}

      <div className="flex flex-warp">
        <span className="text-sm margin-auto-t-b font-bold ">
          <i className="fas fa-cog"></i>&nbsp;&nbsp;
        </span>
        <span className="text-base margin-auto-t-b font-bold">
          CRM&nbsp;&nbsp;/&nbsp;&nbsp;
        </span>
        <span className="text-sm margin-auto-t-b font-bold ">
          <i className="fas fa-users-cog"></i>&nbsp;&nbsp;
        </span>
        <span className="text-base margin-auto font-bold">จัดการสมาชิก</span>
      </div>
      <div className="flex flex-wrap ">
        <div className="w-full px-4">
          <div className="flex flex-warp py-2 mt-6 ">
            <span className="text-lg  text-green-mbk margin-auto font-bold">
              ข้อมูลสมาชิก
            </span>
          </div>
          <div
            className={
              "relative flex flex-col min-w-0 break-words w-full mb-6 border rounded bg-white Overflow-list "
            }
          >
            <div className="rounded-t mb-2 px-4 border-0">
              <div className="w-full mx-autp items-center flex justify-between md:flex-nowrap flex-wrap ">
                <div className="lg:w-6/12 mt-4">
                  <span className="z-3 h-full leading-snug font-normal text-center text-blueGray-300 absolute bg-transparent rounded text-base items-center justify-center pl-3 py-2">
                    <i className="fas fa-search"></i>
                  </span>
                  <input
                    type="text"
                    placeholder="Search here..."
                    className="border-0 pl-12 w-64  placeholder-blueGray-300 text-blueGray-600 relative bg-white rounded-xl text-sm shadow outline-none focus:outline-none focus:ring"
                    onChange={(e) => {
                      InputSearch(e.target.value);
                    }}
                  />
                </div>
                <div className="lg:w-6/12">
                  {/* <Link to="/admin/membersInfo"> */}
                  {/* <button
                    className=" text-black font-bold margin-auto text-xs px-2 py-2 rounded outline-none focus:outline-none  ease-linear transition-all duration-150"
                    type="button"
                    onClick={() => Excel("ข้อมูลสมาชิก")}
                  >
                    <img
                      src={require("assets/img/mbk/excel.png").default}
                      alt="..."
                      className="imgExcel margin-a"
                    ></img>{" "}Export Excel
                  </button> */}

                  <div className="flex mt-2 float-right">
                    <img
                      src={require("assets/img/mbk/excel.png").default}
                      alt="..."
                      onClick={() => Excel("ข้อมูลสมาชิก")}
                      className="imgExcel margin-auto-t-b cursor-pointer "
                    ></img>
                    {/* <span onClick={() => Excel("ข้อมูลสมาชิก")} className="text-gray-500 font-bold margin-auto-t-b ml-2 cursor-pointer ">Export Excel</span> */}
                    {/* <Link to="/admin/membersinfo" className={(typePermission === "1") ? " " : " hidden"}>
                        <button
                          className="bg-gold-mbk text-black ml-2 active:bg-gold-mbk font-bold text-xs px-2 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none  ease-linear transition-all duration-150"
                          type="button"
                        >
                          <i className="fas fa-plus-circle text-white "></i>{" "}
                          <span className="text-white text-sm px-2">
                            เพิ่มข้อมูล
                          </span>
                        </button>
                      </Link> */}
                  </div>

                  {/* <button
                    className="bg-gold-mbk border w-full text-black active:bg-gold-mbk font-bold mt-2 text-xs px-2 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none  ease-linear transition-all duration-150"
                    type="button"
                  >
                      <img
                        src={require("assets/img/mbk/excel.png").default}
                        alt="..."
                        className="imgExcel"
                      ></img>
                  </button> */}

                  {/* </Link>  */}
                </div>
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
                      ลำดับที่
                    </th>
                    <th
                      className={
                        "px-2  border border-solid py-3 text-sm  border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-50 text-blueGray-500 "
                      }
                    >
                      รหัสสมาชิก
                    </th>
                    <th
                      className={
                        "px-2  border border-solid py-3 text-sm  border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-50 text-blueGray-500 "
                      }
                    >
                      ชื่อลูกค้า
                    </th>
                    <th
                      className={
                        "px-2  border border-solid py-3 text-sm  border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-50 text-blueGray-500 "
                      }
                    >
                      เบอร์โทรศัพท์
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
                      วันเกิด
                    </th>
                    <th
                      className={
                        "px-2  border border-solid py-3 text-sm  border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-50 text-blueGray-500 "
                      }
                    >
                      วันที่สมัคร
                    </th>
                    <th
                      className={
                        "px-2  border border-solid py-3 text-sm  border-l-0 border-r-0 whitespace-nowrap font-semibold text-center bg-blueGray-50 text-blueGray-500 "
                      }
                    >
                      คะแนนคงเหลือ
                    </th>
                    <th
                      className={
                        "px-2  border border-solid py-3 text-sm  border-l-0 border-r-0 whitespace-nowrap font-semibold text-center bg-blueGray-50 text-blueGray-500 " +
                        (typePermission === "1" ? " " : " hidden")
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
                          <td className="border-t-0 px-2 align-middle border-b border-l-0 border-r-0 p-3 text-sm whitespace-nowrap text-center">
                            <span className="px-4 margin-a">
                              {pagesVisited + key + 1}
                            </span>
                          </td>
                          <td className="border-t-0 px-2 align-middle border-b border-l-0 border-r-0 text-sm whitespace-nowrap text-left cursor-pointer">
                            <Link
                              className="text-gray-mbk  hover:text-gray-mbk "
                              to={`/admin/membersInfo/${value.id}`}
                            >
                              <div className="TextWordWarp-150">
                                {value.memberCard}
                              </div>
                            </Link>
                          </td>
                          <td className="border-t-0 px-2 align-middle border-b border-l-0 border-r-0 text-sm whitespace-nowrap text-left cursor-pointer">
                            <Link
                              className="text-gray-mbk hover:text-gray-mbk "
                              to={`/admin/membersInfo/${value.id}`}
                            >
                              <div
                                title={value.firstName + " " + value.lastName}
                                className="TextWordWarp-150"
                              >
                                {value.firstName} {value.lastName}
                              </div>
                            </Link>
                          </td>
                          <td className="border-t-0 px-2 align-middle border-b border-l-0 border-r-0 text-sm whitespace-nowrap text-left cursor-pointer">
                            <Link
                              className="text-gray-mbk  hover:text-gray-mbk "
                              to={`/admin/membersInfo/${value.id}`}
                            >
                              {value.phone}
                            </Link>
                          </td>
                          <td className="border-t-0 px-2 align-middle border-b border-l-0 border-r-0 text-sm whitespace-nowrap text-left cursor-pointer">
                            <Link
                              className="text-gray-mbk  hover:text-gray-mbk"
                              to={`/admin/membersInfo/${value.id}`}
                            >
                              <div
                                className="TextWordWarp-200"
                                title={value.email}
                              >
                                {value.email}
                              </div>
                            </Link>
                          </td>
                          <td className="border-t-0 px-2 align-middle border-b border-l-0 border-r-0 text-sm whitespace-nowrap text-left ">
                            <Link
                              className="text-gray-mbk  hover:text-gray-mbk "
                              to={`/admin/membersInfo/${value.id}`}
                            >
                              {moment(value.birthDate).format("DD/MM/YYYY")}
                            </Link>
                          </td>
                          <td className="border-t-0 px-2 align-middle border-b border-l-0 border-r-0 text-sm whitespace-nowrap text-left ">
                            <Link
                              className="text-gray-mbk  hover:text-gray-mbk "
                              to={`/admin/membersInfo/${value.id}`}
                            >
                              {moment(value.registerDate).format("DD/MM/YYYY")}
                            </Link>
                          </td>
                          <td className="border-t-0 px-2 align-middle border-b border-l-0 border-r-0 text-sm whitespace-nowrap text-center">
                            {value.memberPoint}
                          </td>
                          <td
                            className={
                              "border-t-0 px-2 align-middle border-b border-l-0 border-r-0 text-sm whitespace-nowrap text-center" +
                              (typePermission === "1" ? " " : " hidden")
                            }
                          >
                            <i
                              className="fas fa-trash text-red-500 cursor-pointer"
                              onClick={() => {
                                openModalSubject(value.id);
                              }}
                            ></i>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
            <ConfirmDialog
              showModal={modalIsOpenSubject}
              message={"สมาชิก"}
              hideModal={() => {
                closeModalSubject();
              }}
              confirmModal={() => {
                deleteUser(deleteValue);
              }}
            />
            <div className="px-4">
              <div className="w-full mx-autp items-center flex justify-between md:flex-nowrap flex-wrap ">
                <div
                  className="lg:w-6/12 font-bold"
                  style={{ alignSelf: "stretch" }}
                >
                  {pagesVisited + 10 > listUser.length
                    ? listUser.length
                    : pagesVisited + 10}{" "}
                  {"/"}
                  {listUser.length} รายการ
                </div>
                <div className="lg:w-6/12">
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
        </div>
      </div>
    </>
  );
}
