import React from "react";
import moment from "moment";
const CancelDetail = ({ OrderHD }) => {
  return (
    <>
      <div
        className="flex mt-2 "
        style={{
          width: "95%",
          marginLeft: "auto",
          marginRight: "auto",
        }}
      >
        <div
          className="flex text-sm"
          style={{ width: "calc(100% - 90px)", color: "red" }}
        >
          <i
            className="flex fas fa-backspace"
            style={{ alignItems: "center" }}
          ></i>
          <div className="px-2">ยกเลิกคำสั่งซื้อ</div>
        </div>

        <div
          className="flex text-sm "
          style={{
            width: "90px",
            backgroundColor: "#ebebeb",
            borderRadius: "10px",
            textAlign: "center",
            justifyContent: "center",
            alignItems: "center",
            color: "var(--mq-txt-color, rgb(20, 100, 246))",
          }}
        >
          {OrderHD.tbCancelOrder.cancelStatus === "Wait"
            ? "รอดำเนินการ"
            : OrderHD.tbCancelOrder.cancelStatus === "Refund"
            ? "คืนเงิน"
            : "ไม่คืนเงิน"}
        </div>
      </div>

      <div
        className="w-full mt-2 py-2 px-2"
        style={{
          backgroundColor: "#ffe9e2",
        }}
      >
        <div className="w-full flex mb-2 text-liff-gray-mbk">
          <i className="flex fas fa-times" style={{ alignItems: "center" }}></i>
          <div className="px-2">
            {"ประเภทการยกเลิก : " +
              (OrderHD.tbCancelOrder.cancelType === "User"
                ? "ยกเลิกโดยผู้ใช้"
                : OrderHD.tbCancelOrder.cancelType === "Admin"
                ? "ผู้ดูแลระบบ"
                : "ยกเลิกอัตโนมัติ")}
          </div>
        </div>
        <div className="w-full flex mb-2 text-liff-gray-mbk">
          <i className="flex fas fa-clock" style={{ alignItems: "center" }}></i>
          <div className="px-2">
            {"วันที่ยกเลิก : " +
              moment(OrderHD.tbCancelOrder.createdAt)
                .locale("th")
                .add(543, "years")
                .format("DD MMM YYYY")}
          </div>
        </div>
        <div className="liff-inline" />
        <div className="w-full flex mb-2 text-liff-gray-mbk">
          <i
            className="flex fas fa-clipboard"
            style={{ alignItems: "center" }}
          ></i>
          <div className="px-2">
            {"สาเหตุ : " + OrderHD.tbCancelOrder.cancelDetail}
          </div>
        </div>
        <div className="w-full flex mb-2 text-liff-gray-mbk">
          <i
            className="flex fas fa-question-circle"
            style={{ alignItems: "center" }}
          ></i>
          <div className="px-2">
            {"รายละเอียด : " + OrderHD.tbCancelOrder.description}
          </div>
        </div>
      </div>
    </>
  );
};

export default CancelDetail;
