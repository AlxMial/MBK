import ConfirmDialog from "components/ConfirmDialog/ConfirmDialog";
import React, { useState } from "react";
import ReactPaginate from "react-paginate";
import axios from "services/axios";

const PromotionTable = ({ listPromotion, setListPromotion, openModal }) => {
  const thClass =
    "px-2  border border-solid py-3 text-sm  border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-50 text-blueGray-500 ";
  const tdClass =
    "border-t-0 px-2 align-middle border-b border-l-0 border-r-0 p-3 text-sm whitespace-nowrap";
  const tdSpan = "text-gray-mbk  hover:text-gray-mbk ";

  const [pageNumber, setPageNumber] = useState(0);
  const [forcePage, setForcePage] = useState(0);
  const usersPerPage = 10;
  const pagesVisited = pageNumber * usersPerPage;
  const pageCount = Math.ceil(listPromotion.length / usersPerPage)||1;
  const [deleteValue, setDeleteValue] = useState("");
  const [modalIsOpenSubject, setIsOpenSubject] = useState(false);
  const changePage = ({ selected }) => {
    setPageNumber(selected);
    setForcePage(selected);
  };
  const deletePromotion = () => {
    axios.delete(`/promotionStore/${deleteValue}`).then(() => {
      setListPromotion(
        listPromotion.filter((val) => {
          return val.id !== deleteValue;
        })
      );
      closeModalSubject();
    });
  };

  /* Modal */
  function openModalSubject(id) {
    setDeleteValue(id);
    setIsOpenSubject(true);
  }

  function closeModalSubject() {
    setIsOpenSubject(false);
  }

  const conditionType = [
    { label: "ส่วนลด", value: "1" },
    { label: "% ส่วนลด", value: "2" },
    { label: "สินค้าสมนาคุณ", value: "3" },
  ];

  return (
    <>
      <div className="block w-full overflow-x-auto  px-4 py-2">
        {/* Projects table */}
        <table className="items-center w-full border ">
          <thead>
            <tr>
              <th className={thClass + " text-center"}>ลำดับที่</th>
              <th className={thClass}>ชื่อแคมเปญ</th>
              <th className={thClass}>ยอดรวม</th>
              <th className={thClass}>เงื่อนไข</th>
              <th className={thClass}>รายละเอียด</th>
              <th className={thClass + "  text-center"}>สถานะ</th>
              <th className={thClass + "  text-center"}>จัดการ</th>
            </tr>
          </thead>
          <tbody>
            {listPromotion
              .slice(pagesVisited, pagesVisited + usersPerPage)
              .map(function (value, key) {
                return (
                  <tr key={key} className="cursor-pointer">
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
                      <span className={tdSpan}>{value.campaignName}</span>
                    </td>
                    <td
                      className={tdClass + " cursor-pointer"}
                      onClick={() => {
                        openModal(value.id);
                      }}
                    >
                      <span className={tdSpan}>{value.buy}</span>
                    </td>
                    <td
                      className={tdClass + " cursor-pointer"}
                      onClick={() => {
                        openModal(value.id);
                      }}
                    >
                      <span className={tdSpan}>
                        {
                          conditionType.filter(
                            (d) => d.value === value.condition
                          )[0].label
                        }
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
                    <td
                      className={tdClass + " cursor-pointer  text-center"}
                      onClick={() => {
                        openModal(value.id);
                      }}
                    >
                      <span className={tdSpan}>{value.isInactive?"เปิดการใช้งาน":"ปิดการใช้งาน"}</span>
                    </td>
                    <td className={tdClass + " cursor-pointer text-center"}>
                      <i
                        className={
                          "fas fa-trash cursor-pointer" + " text-red-500"
                        }
                        onClick={(e) => {
                          openModalSubject(value.id);
                        }}
                      ></i>
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
            deletePromotion();
          }}
        />
      </div>
      <div className="px-4">
        <div className="w-full mx-autp items-center flex justify-between md:flex-nowrap flex-wrap ">
          <div className="lg:w-6/12 font-bold" style={{ alignSelf: "stretch" }}>
            {pagesVisited + 10 > listPromotion.length
              ? listPromotion.length
              : pagesVisited + 10}{" "}
            {"/"}
            {listPromotion.length} รายการ
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

export default PromotionTable;
