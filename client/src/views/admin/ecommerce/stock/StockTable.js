import React, { useState } from "react";
import ReactPaginate from "react-paginate";
import axios from "services/axios";
import ConfirmDialog from "components/ConfirmDialog/ConfirmDialog";
import { fetchLoading } from "redux/actions/common";
import { useDispatch } from "react-redux";
import { fetchSuccess } from "redux/actions/common";
import { useToasts } from "react-toast-notifications";
const StockTable = ({
  listStock,
  openModal,
  setListStock,
  pageNumber,
  setPageNumber,
  forcePage,
  setForcePage,
}) => {
  const thClass =
    "px-2  border border-solid py-3 text-sm  border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-50 text-blueGray-500 ";
  const tdClass =
    "border-t-0 px-2  border-b border-l-0 border-r-0 p-3 text-sm whitespace-nowrap";
  const tdSpan = "text-gray-mbk  hover:text-gray-mbk ";

  const [open, setOpen] = useState(false);
  // const [pageNumber, setPageNumber] = useState(0);
  // const [forcePage, setForcePage] = useState(0);
  const usersPerPage = 10;
  const pagesVisited = pageNumber * usersPerPage;
  const pageCount = Math.ceil(listStock.length / usersPerPage) || 1;
  const [deleteValue, setDeleteValue] = useState("");
  const dispatch = useDispatch();
  const { addToast } = useToasts();
  const changePage = ({ selected }) => {
    setPageNumber(selected);
    setForcePage(selected);
  };
  const showList = [
    { label: "แสดง", value: true },
    { label: "ไม่แสดง", value: false },
  ];

  const deleteStock = (id) => {
    dispatch(fetchLoading());
    axios.delete(`/stock/${id}`).then(() => {
      setListStock(id);
      addToast("ลบข้อมูลสำเร็จ", {
        appearance: "success",
        autoDismiss: true,
      });
    });
    setOpen(false);
    dispatch(fetchSuccess());
  };

  const handleDeleteList = (id) => {
    setDeleteValue(id);
    setOpen(true);
  };

  return (
    <>
      <div className="block w-full overflow-x-auto  px-4 py-2">
        {/* Projects table */}
        <table className="items-center w-full border ">
          <thead>
            <tr>
              <th className={thClass + " text-center"}>ลำดับที่</th>
              <th className={thClass}>ชื่อสินค้า</th>
              <th className={thClass}>หมวดหมู่สินค้า</th>
              <th className={thClass + " text-right"}>ราคา</th>
              <th className={thClass + " text-right"}>จำนวนสินค้าในคลัง</th>
              <th className={thClass + " text-center"}>สถานะ</th>
              <th className={thClass + " text-center"}>สินค้าขายดี</th>
              <th className={thClass + " text-center"}>FLASH SALE</th>
              <th className={thClass + " text-center"}>สถานะการแสดง</th>
              <th className={thClass + " text-center"}>จัดการ</th>
            </tr>
          </thead>
          <tbody>
            {listStock
              .slice(pagesVisited, pagesVisited + usersPerPage)
              .map(function (value, key) {
                return (
                  <tr key={key} className="cursor-pointer">
                    <td
                      className={
                        "border-t-0 px-2 w-20 border-b border-l-0 border-r-0 p-3 text-sm whitespace-nowrap text-center"
                      }
                      onClick={() => {
                        openModal(value.id);
                      }}
                    >
                      <span className="px-4 margin-a">
                        {pagesVisited + key + 1}
                      </span>
                    </td>
                    <td
                      className={
                        "border-t-0 px-2 border-b border-l-0 border-r-0 p-3 text-sm whitespace-nowrap  cursor-pointer"
                      }
                      title={value.productName}
                      onClick={() => {
                        openModal(value.id);
                      }}
                    >
                      <div className="TextWordWarp-600">
                        {value.productName}{" "}
                      </div>
                    </td>
                    <td
                      className={
                        "border-t-0 px-2 w-48 border-b border-l-0 border-r-0 p-3 text-sm whitespace-nowrap  cursor-pointer"
                      }
                      title={value.categoryName}
                      onClick={() => {
                        openModal(value.id);
                      }}
                    >
                        {value.categoryName}
                    </td>
                    <td
                      className={
                        "border-t-0 px-2 w-24 border-b border-l-0 border-r-0 p-3 text-sm whitespace-nowrap  text-right cursor-pointer"
                      }
                      onClick={() => {
                        openModal(value.id);
                      }}
                    >
                      {value.price} ฿{" "}
                    </td>
                    <td
                      className={
                        "border-t-0 px-2  w-24 border-b border-l-0 border-r-0 p-3 text-sm whitespace-nowrap  text-right cursor-pointer"
                      }
                      onClick={() => {
                        openModal(value.id);
                      }}
                    >
                      {value.productCount}
                    </td>
                    <td
                      className={
                        "border-t-0 px-2  w-20   border-b border-l-0 border-r-0 p-3 text-sm whitespace-nowrap  text-center cursor-pointer "
                      }
                      onClick={() => {
                        openModal(value.id);
                      }}
                    >
                      <span
                        className={
                          value.productCount - value.buy > 10
                            ? "text-green-500"
                            : value.productCount - value.buy <= 0
                            ? "text-red-700"
                            : "text-orange-500"
                        }
                      >
                        {value.status}
                      </span>
                    </td>
                    <td
                      className={
                        "border-t-0 px-2  w-20  border-b border-l-0 border-r-0 p-3 text-sm whitespace-nowrap  cursor-pointer text-center "
                      }
                      onClick={() => {
                        openModal(value.id);
                      }}
                    >
                      <span className={value.isBestSeller ? "" : "hidden"}>
                        <input
                          type="checkbox"
                          className="rounded text-green-mbk"
                          defaultChecked={true}
                          disabled
                        />
                      </span>
                      <span className={value.isBestSeller ? "hidden" : ""}>
                        <input
                          type="checkbox"
                          className="rounded text-green-mbk"
                          defaultChecked={false}
                          disabled
                        />
                      </span>
                    </td>
                    <td
                      className={
                        "border-t-0 px-2  w-20  border-b border-l-0 border-r-0 p-3 text-sm whitespace-nowrap  cursor-pointer text-center "
                      }
                      onClick={() => {
                        openModal(value.id);
                      }}
                    >
                      <span className={value.isFlashSale ? "" : "hidden"}>
                        <input
                          type="checkbox"
                          className="rounded text-green-mbk"
                          defaultChecked={true}
                          disabled
                        />
                      </span>
                      <span className={value.isFlashSale ? "hidden" : ""}>
                        <input
                          type="checkbox"
                          className="rounded text-green-mbk"
                          defaultChecked={false}
                          disabled
                        />
                      </span>
                    </td>
                    <td
                      className={
                        "border-t-0 px-2  w-20  border-b border-l-0 border-r-0 p-3 text-sm whitespace-nowrap  cursor-pointer text-center"
                      }
                      onClick={() => {
                        openModal(value.id);
                      }}
                    >
                      <span className={tdSpan}>
                        {
                          showList.filter(
                            (item) => item.value === value.isInactive
                          )[0].label
                        }
                      </span>
                    </td>
                    <td
                      className={
                        "border-t-0 px-2 w-20 border-b border-l-0 border-r-0 p-3 text-sm whitespace-nowrap  cursor-pointer text-center"
                      }
                    >
                      <i
                        className="fas fa-trash text-red-500 cursor-pointer"
                        onClick={() => {
                          handleDeleteList(value.id);
                        }}
                      ></i>
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
            {pagesVisited + 10 > listStock.length
              ? listStock.length
              : pagesVisited + 10}{" "}
            {"/"}
            {listStock.length} รายการ
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
      {open && (
        <ConfirmDialog
          showModal={open}
          message={"จัดการข้อมูลสินค้า"}
          hideModal={() => {
            setOpen(false);
          }}
          confirmModal={() => {
            deleteStock(deleteValue);
          }}
        />
      )}
    </>
  );
};

export default StockTable;
