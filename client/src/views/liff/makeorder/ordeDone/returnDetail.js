import React, { useState } from "react";
import moment from "moment";
import ImageUC from "components/Image/index";
import Modal from "react-modal";
import ModalHeader from "views/admin/ModalHeader";
const ReturnDetail = ({ OrderHD }) => {
  const [isOpenmodelimg, setisOpenmodelimg] = useState(false);
  return (
    <>
      <div
        className="flex mt-2 text-sm relative"
        style={{
          width: "95%",
          marginLeft: "auto",
          marginRight: "auto",
        }}
      >
        <div
          className="flex"
          style={{ width: "calc(100% - 125px)", color: "red" }}
        >
          <i
            className="flex fas fa-long-arrow-alt-left"
            style={{ alignItems: "center" }}
          ></i>
          <div className="px-2">คืนสินค้า</div>
        </div>

        <div
          className="flex absolute"
          style={{
            width: "auto",
            backgroundColor: "#ebebeb",
            borderRadius: "10px",
            textAlign: "center",
            color: "var(--mq-txt-color, rgb(20, 100, 246))",
            justifyContent: "center",
            alignItems: "center",
            padding: "0 10px",
            right: "10px"
          }}
        >
          {OrderHD.tbReturnOrder.returnStatus == 1
            ? "รอดำเนินการ"
            : OrderHD.tbReturnOrder.returnStatus == 2
              ? "คืนสำเร็จ"
              : "การคืนถูกปฏิเสธ"}
        </div>
      </div>

      <div
        className="w-full mt-2 py-2 px-2 text-liff-gray-mbk"
        style={{
          backgroundColor: "#ffe9e2",
        }}
      >
        <div className="w-full flex mb-2">
          <i className="flex fas fa-clock" style={{ alignItems: "center" }}></i>
          <div className="px-2">
            {"วันที่คืนสินค้า : " +
              moment(OrderHD.tbReturnOrder.createdAt).format("DD-MM-YYYY")}
          </div>
        </div>
        <div className="w-full flex mb-2">
          <i
            className="flex fas fa-paperclip"
            style={{ alignItems: "center" }}
          ></i>
          <div className="px-2 flex">
            {"รูปภาพ  : "}
            <div
              className="px-2 text-underline"
              style={{
                color: "blue",
              }}
              onClick={() => {
                setisOpenmodelimg(true);
              }}
            >
              ดูรูปภาพ
            </div>
          </div>
        </div>
        {/* <div className="liff-inline" /> */}
        <div className="w-full flex mb-2">
          <i
            className="flex fas fa-clipboard"
            style={{ alignItems: "center" }}
          ></i>
          <div className="px-2">
            {"สาเหตุ : " + OrderHD.tbReturnOrder.returnDetail}
          </div>
        </div>
        <div className="w-full flex mb-2">
          <i
            className="flex fas fa-question-circle"
            style={{ alignItems: "center" }}
          ></i>
          <div className="px-2">
            {"รายละเอียด : " + (OrderHD.tbReturnOrder.returnOtherRemark ?? '')}
          </div>
        </div>
      </div>

      <Modal
        isOpen={isOpenmodelimg}
        className="Modal-line"
        style={{ borderRadius: "10px" }}
      >
        <div className="w-full flex flex-wrap h-full">
          <div className="w-full flex-auto  h-full">
            <ModalHeader
              title="รูปภาพ"
              handleModal={() => {
                setisOpenmodelimg(false);
              }}
            />

            <div className="w-full" style={{ maxHeight: "calc(100% - 70px)" }}>
              <ImageUC
                style={{ margin: "auto", height: "100%", width: "100%", minHeight: "300px", maxHeight: "400px" }}
                find={1}
                relatedid={OrderHD.tbReturnOrder.id}
                relatedtable={["tbReturnOrder"]}
                alt="flash_sale"
                className="w-32 border-2 border-blueGray-50 animated-img"
              ></ImageUC>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ReturnDetail;
