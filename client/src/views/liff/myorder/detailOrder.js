import React, { useState } from "react";
import ImageUC from "components/Image/index";
import * as fn from "@services/default.service";
import ReturnModel from "../components/returnModel"; //popup คืนสินค้า
const DetailOrder = ({
  OrderHD,
  onClick,
  cancelStatus,
  returnStatus,
  succeedOrder,
  GetOrderHD,
}) => {
  const [returnModel, setReturnModel] = useState({ isOpen: false });

  return (
    <>
      <div className="w-full">
        {[...OrderHD].map((e, i) => {
          return (
            <div
              key={i}
              style={{
                opacity:
                  returnStatus == true
                    ? e.returnStatus != null
                      ? "0.7"
                      : "1"
                    : "1",
              }}
            >
              <div
                className="w-full"
                onClick={() => {
                  onClick(e);
                }}
              >
                <div
                  className="liff-inline mb-2"
                  style={{ height: "5px", backgroundColor: "#ebebeb" }}
                />
                <div className="w-full flex mb-2 relative text-xs">
                  <div className="flex" style={{ width: "calc(100% - 120px)" }}>
                    <div className="font-bold" style={{ minWidth: "85px" }}>
                      หมายเลขคำสั่งซื้อ :{" "}
                    </div>
                    <div>{e.orderNumber} </div>
                  </div>
                  {e.isPaySlip ? (
                    <div
                      className="absolute"
                      style={{
                        right: "0",
                        color: "#FFF",
                        border: "1px solid",
                        padding: "0 5px",
                        borderRadius: "10px",
                        background: "red",
                      }}
                    >
                      {"รอการตรวจสอบ"}
                    </div>
                  ) : null}
                  {cancelStatus == true ? (
                    <div
                      className="absolute flex"
                      style={{
                        right: "10px",
                        width: "90px",
                        backgroundColor: "#ebebeb",
                        borderRadius: "10px",
                        justifyContent: "center",
                        color: "var(--mq-txt-color, rgb(20, 100, 246))",
                      }}
                    >
                      {e.cancelStatus == 1
                        ? "รอดำเนินการ"
                        : e.cancelStatus == 2
                          ? "คืนเงิน"
                          : "ไม่คืนเงิน"}
                    </div>
                  ) : null}
                  {returnStatus == true ? (
                    e.returnStatus != null ? (
                      <div
                        className="flex"
                        style={{
                          width: "120px",
                          backgroundColor: "#ebebeb",
                          borderRadius: "10px",
                          textAlign: "center",
                          color: "var(--mq-txt-color, rgb(20, 100, 246))",
                          fontSize: "13px",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        {e.returnStatus == 1
                          ? "รอดำเนินการ"
                          : e.returnStatus == 2
                            ? "คืนสำเร็จ"
                            : "การคืนถูกปฏิเสธ"}
                      </div>
                    ) : null
                  ) : null}
                </div>
                {[...e.dt].length > 0
                  ? [...e.dt].map((dt, j) => {
                    return (
                      <div key={j} className="w-full flex mb-2 text-xs">
                        <div style={{ width: "80px", height: "80px" }}>
                          <ImageUC
                            style={{
                              width: "80px",
                              height: "80px",
                            }}
                            find={1}
                            relatedid={dt.id}
                            relatedtable={["stock1"]}
                            alt="flash_sale"
                            className=" border-2 border-blueGray-50  animated-img"
                          ></ImageUC>
                        </div>
                        <div
                          className=" px-2 relative "
                          style={{ width: "calc(100% - 80px)" }}
                        >
                          <div className="font-bold line-clamp-1">
                            {dt.productName}
                          </div>

                          <div className="flex text-12">
                            <div
                              className="flex absolute"
                              style={{ right: "0" }}
                            >
                              <div
                                style={{
                                  textDecoration:
                                    dt.discount > 0 ? "line-through" : "none",
                                  color: dt.isFree
                                    ? "red"
                                    : dt.discount > 0
                                      ? "#ddd"
                                      : "#047738",
                                }}
                              >
                                {dt.isFree
                                  ? "Free"
                                  : "฿ " + fn.formatMoney(dt.price)}
                              </div>
                              {dt.discount > 0 ? (
                                <div
                                  className="px-2"
                                  style={{ color: "red" }}
                                >
                                  {"฿ " + fn.formatMoney(dt.discount)}
                                </div>
                              ) : null}
                            </div>
                            <div className="text-liff-gray-mbk">
                              {"x" + dt.amount}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                  : null}

                <div
                  className="w-full flex mb-2"
                  style={{
                    fontSize: "12px",
                    justifyContent: "end",
                    color: "#ddd",
                  }}
                >
                  <div className="font-bold">{"ดูรายละเอียดคำสั่งซื้อ >"}</div>
                </div>
              </div>
              {succeedOrder == true ? (
                <div
                  className="w-full flex mb-2"
                  style={{
                    fontSize: "12px",
                    justifyContent: "end",
                    color: "#ddd",
                  }}
                >
                  <div
                    className="flex outline-gold-mbk text-gold-mbk text-center text-lg"
                    style={{
                      margin: "auto",
                      height: "35px",
                      borderRadius: "5px",
                      padding: "5px",
                      alignItems: "center",
                      justifyContent: "center",
                      width: "80%",
                      fontSize: "12px",
                      filter: e.returnStatus != null ? "grayscale(1)" : "",
                    }}
                    onClick={() => {
                      if (e.returnStatus == null) {
                        setReturnModel({
                          isOpen: true,
                          orderId: e.id,
                          Callback: () => {
                            setReturnModel({ isOpen: false });
                            GetOrderHD();
                          },
                          onClose: () => {
                            setReturnModel({ isOpen: false });
                          },
                        });
                      }
                    }}
                  >
                    <i className="fas fa-reply"></i>
                    <div className="px-2">{"คืนสินค้า"}</div>
                  </div>
                </div>
              ) : null}

              <div className="liff-inline mb-2" />
              <div
                className="flex relative"
                onClick={() => {
                  onClick(e);
                }}
              >
                <div className="font-bold text-12">
                  {"ยอดรวมสินค้า ( " + e.amount + " ชิ้น)"}
                </div>
                <div
                  className="font-bold absolute text-12 "
                  style={{ right: "0", color: "#047738" }}
                >
                  {"฿ " + fn.formatMoney(e.price)}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <ReturnModel returnModel={returnModel} />
    </>
  );
};

export default DetailOrder;
