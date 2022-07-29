import SelectUC from "components/SelectUC";
import React, { useState } from "react";
import ReactPaginate from "react-paginate";
import ValidateService from "services/validateValue";
import axios from "services/axios";
import { fetchLoading } from "redux/actions/common";
import ConfirmDialog from "components/ConfirmDialog/ConfirmDialog";

const LogisticTable = ({
  listLogistic,
  setListLogistic,
  openModal,
  saveLogisticSuccess,
  saveLogisticNotSuccess,
}) => {
  const thClass =
    "px-2  border border-solid py-3 text-sm  border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-50 text-blueGray-500 ";
  const tdClass =
    "border-t-0 px-2 align-middle border-b border-l-0 border-r-0 p-3 text-sm whitespace-nowrap";
  const tdSpan = "text-gray-mbk  hover:text-gray-mbk ";
  const [pageNumber, setPageNumber] = useState(0);
  const [forcePage, setForcePage] = useState(0);
  const usersPerPage = 10;
  const pagesVisited = pageNumber * usersPerPage;
  const pageCount = Math.ceil(listLogistic.length / usersPerPage)||1;

  const [modalIsOpenSubject, setIsOpenSubject] = useState(false);
  const [deleteValue, setDeleteValue] = useState("");

  const changePage = ({ selected }) => {
    setPageNumber(selected);
    setForcePage(selected);
  };

  const logisticTypeList = [
    { label: "Kerry Express", value: "1" },
    // { label: "Flash Express", value: "flash" },
    { label: "ไปรษณีย์ไทย", value: "2" },
  ];

  const showList = [
    { label: "แสดง", value: true },
    { label: "ไม่แสดง", value: false },
  ];

  /* Modal */
  function openModalSubject(id) {
    setDeleteValue(id);
    setIsOpenSubject(true);
  }

  function closeModalSubject() {
    setIsOpenSubject(false);
  }

  const deleteLogistic = () => {
    // var filtered = listLogistic.filter( function(value, index, arr){
    //     if(value.id !== deleteValue)
    //     {
    //         return value;
    //     }
    // });
    // listLogistic = filtered;
    // setListLogistic(
    //     listLogistic.filter((val) => {
    //         return val.id !== deleteValue;
    //     })
    // );
    // closeModalSubject();
    axios.delete(`/logistic/${deleteValue}`).then(() => {
      setListLogistic(
        listLogistic.filter((val) => {
          return val.id !== deleteValue;
        })
      );
      closeModalSubject();
    });
  };

  const handleChangeShowToEmp = (value, newValue) => {
    value.isShow = newValue;
    fetchLoading();
    value.updateBy = sessionStorage.getItem("user");
    console.log(value);
    if (value.id) {
      axios.put("logistic", value).then((res) => {
        if (res.data.status) {
          saveLogisticSuccess();
        } else {
          saveLogisticNotSuccess();
        }
      });
    } else {
      value.addBy = sessionStorage.getItem("user");
      axios.post("logistic", value).then(async (res) => {
        if (res.data.status) {
          saveLogisticSuccess();
        } else {
          saveLogisticNotSuccess();
        }
      });
    }
  };

  return (
    <>
      <div className="block w-full overflow-x-auto  px-4 py-2">
        {/* Projects table */}
        <table className="items-center w-full border ">
          <thead>
            <tr>
              <th className={thClass + " text-center"}>ลำดับที่</th>
              <th className={thClass}>ชื่อการจัดส่ง</th>
              <th className={thClass}>ผู้ใช้บริการส่งสินค้า</th>
              <th className={thClass}>รายละเอียด</th>
              <th className={thClass + " text-center"}>ค่าจัดส่ง</th>
              <th className={thClass + " text-center"}>จัดการ</th>
            </tr>
          </thead>
          <tbody>
            {listLogistic
              .slice(pagesVisited, pagesVisited + usersPerPage)
              .map(function (value, key) {
                return (
                  <tr key={key}>
                    <td
                      className={tdClass + " text-center"}
                      onClick={() => {
                        openModal(value.id);
                      }}
                    >
                      <span className="px-4 margin-a">
                        {pagesVisited + key + 1}
                      </span>
                    </td>
                    <td
                      className={tdClass + " cursor-pointer"}
                      onClick={() => {
                        openModal(value.id);
                      }}
                    >
                      <span className={tdSpan}>{value.deliveryName}</span>
                    </td>
                    <td
                      className={tdClass + " cursor-pointer"}
                      onClick={() => {
                        openModal(value.id);
                      }}
                    >
                      <span className={tdSpan}>
                        {value.logisticCatagoryName}
                      </span>
                    </td>
                    <td
                      className={tdClass + " cursor-pointer"}
                      onClick={() => {
                        openModal(value.id);
                      }}
                    >
                      <span className={tdSpan}>{value.description}</span>
                    </td>
                    <td className={tdClass + " cursor-pointer text-center"}>
                      <span className={tdSpan}>
                        {value.deliveryCost === 0
                          ? "ฟรี"
                          : value.deliveryCost + " ฿"}
                      </span>
                      {/* <span className={tdSpan}>
                                                <SelectUC
                                                    name="showToEmp"
                                                    onChange={(e) => {
                                                        handleChangeShowToEmp(value, e.value);
                                                    }}
                                                    options={showList}
                                                    value={ValidateService.defaultValue(
                                                        showList,
                                                        value.isShow
                                                    )}
                                                />
                                            </span> */}
                    </td>
                    <td className={tdClass + " text-center"}>
                      <i
                        className={
                          "fas fa-trash cursor-pointer" + " text-red-500"
                        }
                        onClick={(e) => {
                          openModalSubject(value.id);
                        }}
                      ></i>
                      {/* <span className={tdSpan}>
                                                <SelectUC
                                                    name="showToEmp"
                                                    onChange={(e) => {
                                                        handleChangeShowToEmp(value, e.value);
                                                    }}
                                                    options={showList}
                                                    value={ValidateService.defaultValue(
                                                        showList,
                                                        value.isShow
                                                    )}
                                                />
                                            </span> */}
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
        <ConfirmDialog
          showModal={modalIsOpenSubject}
          message={"กำหนดช่องทางการส่งของ"}
          hideModal={() => {
            closeModalSubject();
          }}
          confirmModal={() => {
            deleteLogistic();
          }}
        />
      </div>
      <div className="px-4">
        <div className="w-full mx-autp items-center flex justify-between md:flex-nowrap flex-wrap ">
          <div className="lg:w-6/12 font-bold" style={{ alignSelf: "stretch" }}>
            {pagesVisited + 10 > listLogistic.length
              ? listLogistic.length
              : pagesVisited + 10}{" "}
            {"/"}
            {listLogistic.length} รายการ
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
    </>
  );
};

export default LogisticTable;
