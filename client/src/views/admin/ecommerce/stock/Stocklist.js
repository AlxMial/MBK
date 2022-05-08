import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "services/axios";
import ReactPaginate from "react-paginate";
import Modal from "react-modal";
import ConfirmDialog from "components/ConfirmDialog/ConfirmDialog";
import moment from "moment";

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

export default function StockList() {
  const [listUser, setListUser] = useState([]);
  const [listSearch, setListSerch] = useState([]);
  const [pageNumber, setPageNumber] = useState(0);
  const [deleteNumber, setDeleteNumber] = useState(0);
  const [modalIsOpenSubject, setIsOpenSubject] = useState(false);
  const [deleteValue, setDeleteValue] = useState("");
  const usersPerPage = 10;
  const pagesVisited = pageNumber * usersPerPage;

  const options = [
    { value: "1", label: "ผู้ดูแลระบบ" },
    { value: "2", label: "บัญชี" },
    { value: "3", label: "การตลาด" },
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
    if (e === "") {
      setListUser(listSearch);
    } else {
      setListUser(
        listUser.filter(
          (x) =>
            x.firstName.includes(e) ||
            x.lastName.includes(e) ||
            x.email.includes(e) ||
            x.phone.includes(e)
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
        axios.delete(`/members/multidelete/${ArrayDeleted}`).then(() => {
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
    axios.delete(`/members/${e}`).then(() => {
      setListUser(
        listUser.filter((val) => {
          return val.id !== e;
        })
      );
      closeModalSubject();
    });
  };

  useEffect(() => {
    axios.get("members").then((response) => {
      if (response.data.error) {
      } else {
        setListUser(response.data.tbMember);
        setListSerch(response.data.tbMember);
      }
    });
  }, []);

  return (
    <>
      <div className="flex flex-warp">
        <span className="text-sm font-bold margin-auto-t-b">
          <i className="fas fa-store"></i>&nbsp;
        </span>
        <span className="text-base margin-auto font-bold">จักการคลังสินค้า</span>
      </div>
      <div className="flex flex-wrap ">
        <div className="w-full px-4">
          <div className="flex flex-warp py-2 mt-6 ">
            <span className="text-lg  text-green-mbk margin-auto font-bold">
              จักการคลังสินค้า
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
                  <Link to="/admin/stocksinfo">
                    <button
                      className="bg-gold-mbk text-black active:bg-gold-mbk font-bold  text-xs px-2 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none  ease-linear transition-all duration-150"
                      type="button"
                    >
                      <i className="fas fa-plus-circle text-white "></i>{" "}
                      <span className="text-white text-sm px-2">เพิ่ม</span>
                    </button>
                  </Link>
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
                      Member Card
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
                          <td className="border-t-0 px-2 align-middle border-b border-l-0 border-r-0 p-3 text-sm whitespace-nowrap text-center">
                            <span className="px-4 margin-a">{key + 1}</span>
                          </td>
                          <td className="border-t-0 px-2 align-middle border-b border-l-0 border-r-0 text-sm whitespace-nowrap text-left cursor-pointer">
                            <Link
                              className="text-gray-mbk  hover:text-gray-mbk "
                              to={`/admin/membersInfo/${value.id}`}
                            >
                              {value.memberCard}
                            </Link>
                          </td>
                          <td className="border-t-0 px-2 align-middle border-b border-l-0 border-r-0 text-sm whitespace-nowrap text-left cursor-pointer">
                            <Link
                              className="text-gray-mbk hover:text-gray-mbk "
                              to={`/admin/membersInfo/${value.id}`}
                            >
                              <div className="TextWordWarpCode">
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
                              {value.email}
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
                            0
                          </td>
                          <td className="border-t-0 px-2 align-middle border-b border-l-0 border-r-0 text-sm whitespace-nowrap text-center">
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
              message={"จัดการข้อมูลสมาชิก"}
              hideModal={() => {
                closeModalSubject();
              }}
              confirmModal={() => {
                deleteUser(deleteValue);
              }}
            />
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
