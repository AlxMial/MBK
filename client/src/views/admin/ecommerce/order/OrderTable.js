import moment from "moment";
import React, { useState } from "react";
import ReactPaginate from "react-paginate";
// import ModalImage from "react-modal-image";
import FilesService from "services/files";
import Modal from "react-modal";
import SlipModal from "./SlipModal";
import axios from "services/axios";
import { useDispatch } from "react-redux";
// import { fetchLoading, fetchSuccess } from "redux/actions/common";
// import { exportExcel } from "services/exportExcel";

const OrderTable = ({
  orderList,
  openModal,
  pageNumber,
  setPageNumber,
  forcePage,
  setForcePage,
}) => {
  Modal.setAppElement("#root");
  const dispatch = useDispatch();
  const thClass =
    "px-2  border border-solid py-3 text-sm  border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-50 text-blueGray-500 ";
  const tdClass =
    "border-t-0 px-2 align-middle border-b border-l-0 border-r-0 p-3 text-sm whitespace-nowrap";
  const tdSpan = "text-gray-mbk ";

  const [open, setOpen] = useState(false);
  const [image, setImage] = useState("");
  // const [pageNumber, setPageNumber] = useState(0);
  const usersPerPage = 10;
  const pagesVisited = pageNumber * usersPerPage;
  const pageCount = Math.ceil(orderList.length / usersPerPage) || 1;

  const changePage = ({ selected }) => {
    setPageNumber(selected);
    setForcePage(selected);
  };

  const getStatus = (value) => {
    if (value.paymentStatus == 1 && !value.isCancel) {
      return { text: "รอการชำระเงิน", color: " text-yellow-500 " };
    } else if (value.paymentStatus == 2 && !value.isCancel) {
      return { text: "รอตรวจสอบ", color: " text-yellow-500 " };
    } else if (
      value.paymentStatus == 3 &&
      value.transportStatus == 1 &&
      !value.isCancel
    ) {
      return { text: "เตรียมส่ง", color: " text-lightBlue-600 " };
    } else if (
      value.paymentStatus == 3 &&
      value.transportStatus == 2 &&
      !value.isCancel
    ) {
      return { text: "กำลังส่ง", color: " text-orange-500 " };
    } else if (
      value.paymentStatus == 3 &&
      value.transportStatus == 3 &&
      !value.isCancel
    ) {
      return { text: "ส่งแล้ว", color: " text-green-500  " };
    } else if (value.isCancel) {
      return { text: "ยกเลิกคำสั่งซื้อ", color: " text-red-500   " };
    } else if (value.isReturn) {
      return { text: "คืนสินค้า", color: " text-red-500   " };
    } else {
      return { text: "", color: " text-gray-mbk " };
    }
  };

  const getStatuspayment = (v) => {
    switch (v) {
      case "1":
        return { text: "รอการชำระเงิน", color: " text-yellow-500 " };
      case "2":
        return { text: "รอตรวจสอบ", color: " text-lightBlue-500 " };
      default:
        return { text: "ชำระเงินแล้ว", color: " text-green-500 " };
    }
  };
  const getStatustransportStatus = (v) => {
    if (v.paymentStatus == 3 && !v.isCancel && v.tbCancelOrder == null) {
      if (v.isReturn || v.tbReturnOrder != null) {
        return { text: "คืนสินค้า", color: " text-red-500 " };
      } else if (v.transportStatus == 1) {
        return { text: "เตรียมส่ง", color: " text-yellow-500 " };
      } else if (v.transportStatus == 2) {
        return { text: "อยู่ระหว่างจัดส่ง", color: " text-lightBlue-500 " };
      } else {
        return { text: "ส่งแล้ว", color: " text-green-500 " };
      }
    } else {
      if (v.isCancel || v.tbCancelOrder != null) {
        return { text: "ยกเลิกคำสั่งซื้อ", color: " text-red-500 " };
      } else {
        return { text: " ", color: " " };
      }
    }
  };

  const onClickAttachment = async (id) => {
    const noImage = async () => {
      const _image = await FilesService.buffer64UTF8(
        require("assets/img/mbk/no-image.png").default
      );
      setImage(_image);
      setOpen(true);
    };
    await axios
      .post("stock/getImg", {
        id: id,
        relatedTable: "tbOrderHD",
      })
      .then(async (response) => {
        if (response.data.status) {
          if (response.data.data.length > 0) {
            if (response.data.data[0].image == null) {
              noImage();
            } else {
              const _image = await FilesService.buffer64UTF8(
                response.data.data[0].image
              );
              setImage(_image);
              setOpen(true);
            }
          } else {
            noImage();
          }
        } else {
          noImage();
        }
      })
      .catch(() => {
        noImage();
      })
      .finally(() => {});
  };

  //   const ExportFile = async (id, name) => {
  //     dispatch(fetchLoading());
  //     let coupon = await axios.get(`pointCode/exportExcel/${69}`);
  //     const TitleColumns = ["ชื่อแคมเปญ", "จำนวนคะแนน", "วันที่เริ่มต้น", "วันที่สิ้นสุด", "Code", "สถานะใช้งาน", "สถานะหมดอายุ"];
  //     const columns = ["name", "point", "startDate", "endDate", "code", "isUse", "isExpire"];
  //     exportExcel(coupon.data, name, TitleColumns, columns, "Coupon");
  //     dispatch(fetchSuccess());
  //   };

  const _thList = [
    "ลำดับที่",
    "เลขที่ใบสั่งซื้อ",
    "วันที่สั่งซื้อ",
    "ผู้สั่งซื้อ",
    "ยอดสุทธิ",
    "สถานะการชำระ",
    "ไฟล์แนบ",
    "สถานะการจัดส่ง",
    "สาเหตุที่ยกเลิก/คืน",
    "รายละเอียด",
    "หมายเหตุ",
  ];

  return (
    <>
      <div className="block w-full overflow-x-auto  px-4 py-2">
        {/* Projects table */}
        <table className="items-center w-full border ">
          <thead>
            <tr>
              {_thList.map((item, index) => {
                return (
                  <th
                    key={index}
                    className={
                      thClass +
                      (item === "ลำดับที่" ||
                      item === "สถานะการชำระ" ||
                      item === "ไฟล์แนบ" ||
                      item === "สถานะการจัดส่ง" ||
                      item === "สาเหตุที่ยกเลิก/คืน"
                        ? " text-center"
                        : item === "ยอดสุทธิ"
                        ? " text-right"
                        : "")
                    }
                  >
                    {item}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {orderList
              .slice(pagesVisited, pagesVisited + usersPerPage)
              .map(function (value, key) {
                return (
                  <tr key={key}>
                    <td className={tdClass + " text-center"}>
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
                      <span className="text-blue-700">{value.orderNumber}</span>
                    </td>
                    <td className={tdClass}>
                      <span className={tdSpan}>
                        {moment(value.orderDate).format("DD/MM/YYYY HH:mm:ss") +
                          " น."}
                      </span>
                    </td>
                    <td className={tdClass}>
                      <span className={tdSpan}>{value.memberName}</span>
                    </td>
                    <td className={tdClass + " text-right"}>
                      <span className={tdSpan}>
                        {value.netTotal.toLocaleString(undefined, {
                          maximumFractionDigits: 2,
                        }) ?? 0}{" "}
                        ฿
                      </span>
                    </td>
                    <td className={tdClass + " text-center"}>
                      <span
                        className={getStatuspayment(value.paymentStatus).color}
                      >
                        {getStatuspayment(value.paymentStatus).text}
                      </span>
                    </td>
                    <td
                      className={
                        tdClass +
                        (value.isImage ? " cursor-pointer " : "") +
                        " text-center"
                      }
                      onClick={() => {
                        if (value.isImage) {
                          onClickAttachment(value.id);
                        }
                      }}
                    >
                      <span className={value.isImage ? " text-blue-700" : ""}>
                        {value.isImage ? value.imageName ?? "สลิปโอนเงิน" : ""}
                      </span>
                    </td>
                    <td className={tdClass + " text-center"}>
                      <span className={getStatustransportStatus(value).color}>
                        {getStatustransportStatus(value).text}
                      </span>
                    </td>
                    <td className={tdClass}>
                      <span>
                        {value.tbCancelOrder != null
                          ? value.tbCancelOrder.cancelDetail
                          : value.tbReturnOrder != null
                          ? value.tbReturnOrder.returnDetail
                          : ""}
                      </span>
                    </td>
                    <td className={tdClass}>
                      <span>
                        {value.tbCancelOrder != null
                          ? value.tbCancelOrder.description
                          : value.tbReturnOrder != null
                          ? value.tbReturnOrder.description
                          : ""}
                      </span>
                    </td>
                    <td className={tdClass}>
                      <span>
                        {value.tbCancelOrder != null
                          ? value.tbCancelOrder.cancelOtherRemark
                          : value.tbReturnOrder != null
                          ? value.tbReturnOrder.returnOtherRemark
                          : ""}
                      </span>
                    </td>
                    {/* <td
                          onClick={() => {
                            ExportFile(value.id, value.pointCodeName,value.pointCodePoint,value.startDate,value.endDate);
                          }}
                          className="border-t-0 px-2 align-middle border-b border-l-0 border-r-0 text-sm whitespace-nowrap text-center cursor-pointer"
                        >
                          <span className="text-gray-mbk  hover:text-gray-mbk ">
                            <img
                              src={require("assets/img/mbk/excel.png").default}
                              alt="..."
                              className="imgExcel margin-a"
                            ></img>
                          </span>
                        </td> */}
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
      <div className="px-4">
        <div className="w-full mx-autp items-center flex justify-between md:flex-nowrap flex-wrap ">
          <div className="lg:w-6/12 font-bold" style={{ alignSelf: "stretch" }}>
            {pagesVisited + 10 > orderList.length
              ? orderList.length
              : pagesVisited + 10}{" "}
            {"/"}
            {orderList.length} รายการ
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
        <SlipModal
          open={open}
          image={image}
          handleModal={() => setOpen(false)}
        />
      )}
    </>
  );
};

export default OrderTable;
