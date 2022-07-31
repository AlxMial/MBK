import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import axios from "services/axios";
import ReactPaginate from "react-paginate";
import ConfirmDialog from "components/ConfirmDialog/ConfirmDialog";
import ValidateService from "services/validateValue";
import { fetchLoading, fetchSuccess } from "redux/actions/common";
import { useToasts } from "react-toast-notifications";
import moment from "moment";
// components

export default function ConditionRewardList() {
  const { addToast } = useToasts();
  const [listRedemption, setListRedemption] = useState([]);
  const [listSearch, setListSerch] = useState([]);
  const [pageNumber, setPageNumber] = useState(0);
  const [forcePage, setForcePage] = useState(0);
  const [deleteNumber, setDeleteNumber] = useState(0);
  const [modalIsOpenSubject, setIsOpenSubject] = useState(false);
  const [deleteValue, setDeleteValue] = useState("");
  const RedemptionsPerPage = 10;
  const pagesVisited = pageNumber * RedemptionsPerPage;
  const dispatch = useDispatch();

  const redemptionType = [
    { value: "1", label: "Standard" },
    { value: "2", label: "Game" },
  ];

  const rewardType = [
    { value: "1", label: "E-Coupon" },
    { value: "2", label: "สินค้า" },
  ];
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
      setListRedemption(listSearch);
    } else {
      setListRedemption(
        listSearch.filter((x) => {
          if (
            x.redemptionName.includes(e) ||
            moment(x.startDate).format("DD/MM/YYYY").includes(e) ||
            moment(x.endDate).format("DD/MM/YYYY").includes(e) ||
            x.points.toString().includes(e) ||
            (x.redemptionType == 1 ? "Standard" : "Game")
              .toLowerCase()
              .includes(e) ||
            (x.rewardType == 1 ? "E-Coupon" : "สินค้า")
              .toLowerCase()
              .includes(e) ||
            (new Date(x.endDate) < new Date()
              ? "หมดอายุ"
              : x.isActive
              ? "เปิดการใช้งาน"
              : "ปิดการใช้งาน"
            ).includes(e)
          ) {
            return x;
          }
        })
      );
    }
    setPageNumber(0);
    setForcePage(0);
  };

  const handleChange = (e) => {
    const { name, checked } = e.target;
    if (name === "allSelect") {
      let tempRedemption = listRedemption.map((Redemption) => {
        return { ...Redemption, isDeleted: checked };
      });
      setListRedemption(tempRedemption);
      setDeleteNumber(
        tempRedemption.filter((x) => x.isDeleted === true).length
      );
    } else {
      let tempRedemption = listRedemption.map((Redemption) =>
        Redemption.id.toString() === name
          ? {
              ...Redemption,
              isDeleted: checked,
            }
          : Redemption
      );
      setListRedemption(tempRedemption);
      setDeleteNumber(
        tempRedemption.filter((x) => x.isDeleted === true).length
      );
    }
  };

  const pageCount = Math.ceil(listRedemption.length / RedemptionsPerPage) || 1;

  const changePage = ({ selected }) => {
    setPageNumber(selected);
    setForcePage(selected);
  };

  const deleteRedemption = (e) => {
    axios.delete(`/redemptions/${e}`).then((res) => {
      console.log(res);
      if (res.status == 200) {
        if (res.data.status) {
          setListRedemption(
            listRedemption.filter((val) => {
              return val.id !== e;
            })
          );
          addToast("ลบข้อมูลสำเร็จ", {
            appearance: "success",
            autoDismiss: true,
          });
        } else {
          addToast("ลบข้อมูลไม่สำเร็จ เนื่องจากถูกนำไปใช้งาน", {
            appearance: "warning",
            autoDismiss: true,
          });
        }
      }
      closeModalSubject();
    });
  };

  useEffect(() => {
    dispatch(fetchLoading());
    axios.get("redemptions").then((response) => {
      dispatch(fetchSuccess());
      if (response.data.error) {
      } else {
        if (response.data.tbRedemptionConditionsHD !== null) {
          setListRedemption(response.data.tbRedemptionConditionsHD);
          setListSerch(response.data.tbRedemptionConditionsHD);
        }
      }
    });
  }, []);

  return (
    <>
      <div className="flex flex-warp">
        <span className="text-sm margin-auto-t-b font-bold ">
          <i className="fas fa-cog"></i>&nbsp;&nbsp;
        </span>
        <span className="text-base margin-auto-t-b font-bold">
          CRM&nbsp;&nbsp;/&nbsp;&nbsp;
        </span>
        <span className="text-sm margin-auto-t-b font-bold ">
          <i className="fas fa-gift"></i>&nbsp;&nbsp;
        </span>
        <span className="text-base margin-auto font-bold">
          เงื่อนไขแลกของรางวัล
        </span>
      </div>
      <div className="flex flex-wrap ">
        <div className="w-full px-4">
          <div className="flex flex-warp py-2 mt-6 ">
            <span className="text-lg  text-green-mbk margin-auto font-bold">
              ข้อมูลเงื่อนไขแลกของรางวัล
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
                  {/* <Link to="/admin/redemptionsInfo"> */}
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
                    {/* <img
                      src={require("assets/img/mbk/excel.png").default}
                      alt="..."
                      onClick={() => Excel("ข้อมูลสมาชิก")}
                      className="imgExcel margin-auto-t-b cursor-pointer "
                    ></img> */}
                    {/* <span onClick={() => Excel("ข้อมูลสมาชิก")} className="text-gray-500 font-bold margin-auto-t-b ml-2 cursor-pointer ">Export Excel</span> */}
                    <Link to="/admin/redemptionsimport">
                      <button
                        className="bg-white bg-import text-black ml-2 active:bg-white font-bold text-xs px-2 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none  ease-linear transition-all duration-150"
                        type="button"
                      >
                        <i className="fas fa-file-import text-gray-700 "></i>{" "}
                        <span className="text-gray-700 text-sm px-2">
                          Import Partner Coupon
                        </span>
                      </button>
                    </Link>
                    <Link to="/admin/redemptionsinfo">
                      <button
                        className="bg-gold-mbk bg-import text-black ml-2 active:bg-gold-mbk font-bold text-xs px-2 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none  ease-linear transition-all duration-150"
                        type="button"
                      >
                        <i className="fas fa-plus-circle text-white "></i>{" "}
                        <span className="text-white text-sm px-2">
                          เพิ่มเงื่อนไขการแลกของรางวัล
                        </span>
                      </button>
                    </Link>
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
                      ชื่อแคมเปญ
                    </th>
                    <th
                      className={
                        "px-2  border border-solid py-3 text-sm  border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-50 text-blueGray-500 "
                      }
                    >
                      ประเภทเงื่อนไข
                    </th>
                    <th
                      className={
                        "px-2  border border-solid py-3 text-sm  border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-50 text-blueGray-500 "
                      }
                    >
                      ประเภทรางวัล
                    </th>
                    <th
                      className={
                        "px-2  border border-solid py-3 text-sm  border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-50 text-blueGray-500 "
                      }
                    >
                      คะแนน
                    </th>
                    <th
                      className={
                        "px-2  border border-solid py-3 text-sm  border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-50 text-blueGray-500 "
                      }
                    >
                      วันที่เริ่มต้น
                    </th>
                    <th
                      className={
                        "px-2  border border-solid py-3 text-sm  border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-50 text-blueGray-500 "
                      }
                    >
                      วันที่สิ้นสุด
                    </th>
                    <th
                      className={
                        "px-2  border border-solid py-3 text-sm  border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-50 text-blueGray-500 "
                      }
                    >
                      สถานะ
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
                  {listRedemption
                    .slice(pagesVisited, pagesVisited + RedemptionsPerPage)
                    .map(function (value, key) {
                      return (
                        <tr key={key}>
                          <td className=" w-10 border-t-0 px-2 align-middle border-b border-l-0 border-r-0 p-3 text-sm whitespace-nowrap text-center">
                            {pagesVisited + key + 1}
                          </td>
                          <td className="border-t-0 px-2 align-middle border-b border-l-0 border-r-0 text-sm whitespace-nowrap text-left cursor-pointer">
                            <Link
                              className="text-gray-mbk  hover:text-gray-mbk "
                              to={`/admin/redemptionsInfo/${value.id}`}
                            >
                              <div className="TextWordWarp-600">
                                {value.redemptionName}
                              </div>
                            </Link>
                          </td>
                          <td className="w-24 border-t-0 px-2 align-middle border-b border-l-0 border-r-0 text-sm whitespace-nowrap text-left cursor-pointer">
                            <Link
                              className="text-gray-mbk hover:text-gray-mbk "
                              to={`/admin/redemptionsInfo/${value.id}`}
                            >
                              <div className="">
                                {ValidateService.defaultValueText(
                                  redemptionType,
                                  value.redemptionType
                                )}
                              </div>
                            </Link>
                          </td>
                          <td className=" w-24 border-t-0 px-2 align-middle border-b border-l-0 border-r-0 text-sm whitespace-nowrap text-left cursor-pointer">
                            <Link
                              className="text-gray-mbk hover:text-gray-mbk "
                              to={`/admin/redemptionsInfo/${value.id}`}
                            >
                              <div
                                className={
                                  value.redemptionType == 2 ? " hidden" : " "
                                }
                              >
                                {ValidateService.defaultValueText(
                                  rewardType,
                                  value.rewardType
                                )}
                              </div>
                            </Link>
                          </td>
                          <td className="w-24 border-t-0 px-2 align-middle border-b border-l-0 border-r-0 text-sm whitespace-nowrap text-left cursor-pointer">
                            <Link
                              className="text-gray-mbk  hover:text-gray-mbk "
                              to={`/admin/redemptionsInfo/${value.id}`}
                            >
                              {value.points}
                            </Link>
                          </td>
                          <td className="w-24 border-t-0 px-2 align-middle border-b border-l-0 border-r-0 text-sm whitespace-nowrap text-left cursor-pointer">
                            <Link
                              className="text-gray-mbk  hover:text-gray-mbk"
                              to={`/admin/redemptionsInfo/${value.id}`}
                            >
                              {moment(value.startDate).format("DD/MM/YYYY")}
                            </Link>
                          </td>
                          <td className="w-24 border-t-0 px-2 align-middle border-b border-l-0 border-r-0 text-sm whitespace-nowrap text-left ">
                            <Link
                              className="text-gray-mbk  hover:text-gray-mbk "
                              to={`/admin/redemptionsInfo/${value.id}`}
                            >
                              {value.isNotExpired}{" "}
                              {value.isNotExpired
                                ? "ไม่มีวันหมดอายุ"
                                : moment(value.endDate).format("DD/MM/YYYY")}
                            </Link>
                          </td>
                          <td className="w-24 border-t-0 px-2 align-middle border-b border-l-0 border-r-0 text-sm whitespace-nowrap text-left ">
                            <Link
                              className="text-gray-mbk  hover:text-gray-mbk "
                              to={`/admin/redemptionsInfo/${value.id}`}
                            >
                              {new Date(
                                moment(new Date(value.endDate)).format(
                                  "YYYY-MM-DD"
                                )
                              ) <
                              new Date(moment(new Date()).format("YYYY-MM-DD"))
                                ? "หมดอายุ"
                                : value.isActive
                                ? "เปิดการใช้งาน"
                                : "ปิดการใช้งาน"}
                            </Link>
                          </td>

                          <td
                            className={
                              " w-24 border-t-0 px-2 align-middle border-b border-l-0 border-r-0 text-sm whitespace-nowrap text-center"
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
              message={"เงื่อนไขแลกของรางวัล"}
              hideModal={() => {
                closeModalSubject();
              }}
              confirmModal={() => {
                deleteRedemption(deleteValue);
              }}
            />
            <div className="px-4">
              <div className="w-full mx-autp items-center flex justify-between md:flex-nowrap flex-wrap ">
                <div
                  className="lg:w-6/12 font-bold"
                  style={{ alignSelf: "stretch" }}
                >
                  {pagesVisited + 10 > listRedemption.length
                    ? listRedemption.length
                    : pagesVisited + 10}{" "}
                  {"/"}
                  {listRedemption.length} รายการ
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
                    forcePage={forcePage}
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
