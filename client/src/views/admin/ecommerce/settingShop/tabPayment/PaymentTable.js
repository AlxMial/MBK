import ConfirmDialog from "components/ConfirmDialog/ConfirmDialog";
import React, { useState } from "react";
import ReactPaginate from "react-paginate";
import axios from "services/axios";

const PaymentTable = ({ listPayment, openModal }) => {
  const thClass =
    "px-2  border border-solid py-3 text-sm  border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-50 text-blueGray-500 ";
  const tdClass =
    "border-t-0 px-2 align-middle border-b border-l-0 border-r-0 p-3 text-sm whitespace-nowrap";
  const tdSpan = "text-gray-mbk  hover:text-gray-mbk ";

  const [pageNumber, setPageNumber] = useState(0);
  const usersPerPage = 10;
  const pagesVisited = pageNumber * usersPerPage;
  const pageCount = Math.ceil(listPayment.length / usersPerPage);

  const [deleteValue, setDeleteValue] = useState("");

  const changePage = ({ selected }) => {
    setPageNumber(selected);
  };

  const [modalIsOpenDeleted, setIsOpenDeleted] = useState(false);

  const onModalDelete = (id) => {
    setDeleteValue(id);
    setIsOpenDeleted(true);
  };

  function closeModalDeleted() {
    setIsOpenDeleted(false);
  }
  function arrayRemove(arr, value) { 
    
    return arr.filter(function(ele){ 
        return ele.id != value; 
    });
}

  const deletePayment = () => {
    let id = null;
    var filtered = listPayment.filter( function(value, index, arr){
        if(value.id !== deleteValue)
        {
            return value;
        }
    });
    if(id)
    listPayment = filtered;
    closeModalDeleted();
    // axios.delete(`/payment/${deleteValue}`).then(() => {
    //   listPayment.filter((val) => {
    //     return val.id !== deleteValue;
    //   });
    //   closeModalDeleted();
    // });
  };

  return (
    <>
      <div className="block w-full overflow-x-auto  px-4 py-2">
        {/* Projects table */}
        <table className="items-center w-full border ">
          <thead>
            <tr>
              <th className={thClass + " text-center"}>ลำดับที่</th>
              <th className={thClass}>ชื่อธนาคาร</th>
              <th className={thClass}>เลขบัญชี</th>
              <th className={thClass}>ชื่อบัญชี</th>
              <th className={thClass}>สาขาธนาคาร</th>
              <th className={thClass}>จัดการ</th>
            </tr>
          </thead>
          <tbody>
            {listPayment
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
                      <span className={tdSpan}>{value.bankName}</span>
                    </td>
                    <td
                      className={tdClass + " cursor-pointer"}
                      onClick={() => {
                        openModal(value.id);
                      }}
                    >
                      <span className={tdSpan}>{value.accountNumber}</span>
                    </td>
                    <td
                      className={tdClass + " cursor-pointer"}
                      onClick={() => {
                        openModal(value.id);
                      }}
                    >
                      <span className={tdSpan}>{value.accountName}</span>
                    </td>
                    <td
                      className={tdClass + " cursor-pointer"}
                      onClick={() => {
                        openModal(value.id);
                      }}
                    >
                      <span className={tdSpan}>{value.bankBranchName}</span>
                    </td>
                    <td className={tdClass}>
                      <span className={tdSpan}>
                        <i
                          className="fas fa-trash text-red-500 cursor-pointer"
                          onClick={() => {
                            onModalDelete(value.id);
                          }}
                        ></i>
                      </span>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
      <div className="px-4">
        <div className="w-full mx-autp items-center flex justify-between md:flex-nowrap flex-wrap ">
          <div className="lg:w-6/12 font-bold" style={{ alignSelf: "stretch" }}>
            {pagesVisited + 10 > listPayment.length
              ? listPayment.length
              : pagesVisited + 10}{" "}
            {"/"}
            {listPayment.length} รายการ
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
      <ConfirmDialog
        showModal={modalIsOpenDeleted}
        message={"ช่องทางการชำระเงิน"}
        hideModal={() => {
          closeModalDeleted();
        }}
        confirmModal={() => {
          deletePayment(deleteValue);
        }}
      />
    </>
  );
};

export default PaymentTable;
