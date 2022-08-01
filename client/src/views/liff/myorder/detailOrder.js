import React, { useState } from "react";
import ImageUC from "components/Image/index";
import * as fn from "@services/default.service";
import ReturnModel from "../components/returnModel"; //popup คืนสินค้า
import { CopyToClipboard } from "react-copy-to-clipboard";
import { useToasts } from "react-toast-notifications";

const DetailOrder = ({
  OrderHD,
  onClick,
  cancelStatus,
  returnStatus,
  succeedOrder,
  GetOrderHD,
}) => {
  const { addToast } = useToasts();
  const [returnModel, setReturnModel] = useState({ isOpen: false });
  console.log('OrderHD', OrderHD);
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
              >
                <div
                  className="liff-inline mb-2"
                  style={{ height: "5px", backgroundColor: "#ebebeb" }}
                />
                <div className="w-full flex mb-2 relative text-xs justify-between"
                  onClick={() => {
                    onClick(e);
                  }}
                >
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
                      className=" flex"
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
                      <div key={j} className="w-full flex mb-2 text-xs"
                        onClick={() => {
                          onClick(e);
                        }}>
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
                          className=" pl-2 relative "
                          style={{ width: "calc(100% - 80px)" }}
                        >
                          <div className="font-bold line-clamp-1">
                            {dt.productName}
                          </div>

                          <div className="flex text-12 justify-between">
                            <div className="text-liff-gray-mbk sec-left">
                              {"x" + dt.amount}
                            </div>
                            <div className="sec-right">
                              <div
                                className="flex"
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
                                    className="pl-2"
                                    style={{ color: "red" }}
                                  >
                                    {"฿ " + fn.formatMoney(dt.discount)}
                                  </div>
                                ) : null}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                  : null}

                <div
                  className="w-full flex mb-2 justify-between"
                  onClick={() => {
                    onClick(e);
                  }}
                  style={{
                    fontSize: "12px",
                    color: "#ddd",
                  }}
                >
                  <div className="left"></div>
                  <div className="font-bold">{"ดูรายละเอียดคำสั่งซื้อ >"}</div>
                </div>
              </div>
              {succeedOrder == true ? (
                <div
                  onClick={() => {
                    onClick(e);
                  }}
                  className="w-full flex mb-2"
                  style={{
                    fontSize: "12px",
                    justifyContent: "end",
                    color: "#ddd",
                  }}
                >
                  <div
                    className="flex border-gold-mbk text-gold-mbk text-center text-lg"
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
                className="flex relative justify-between"
                onClick={() => {
                  onClick(e);
                }}
              >
                <div className="font-bold text-12">
                  {"ยอดรวมสินค้า ( " + e.amount + " ชิ้น)"}
                </div>
                <div
                  className="font-bold text-12 "
                  style={{ color: "#047738" }}
                >
                  {"฿ " + fn.formatMoney(e.price)}
                </div>
              </div>

              {e.isToReceive && (
                <>
                  <div className="liff-inline mb-2" />
                  <div
                    className="flex relative"
                  >
                    <div className="text-12 text-gold-mbk">
                      <span>
                        <i className="fas fa-box-open mr-2"></i>
                      </span>
                      <span className="font-bold">หมายเลขพัสดุ : </span>{e.trackNo ? e.trackNo : "-"}
                    </div>
                    <CopyToClipboard
                      text={e.trackNo}
                      onCopy={() => {
                        addToast("คัดลอกเรียบร้อยแล้ว", {
                          appearance: "success",
                          autoDismiss: true,
                        });
                      }}
                    >
                      <div
                        className="absolute text-12 text-green-mbk right-0"
                      >
                        คัดลอก
                      </div>
                    </CopyToClipboard>
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
      <ReturnModel returnModel={returnModel} />
    </>
  );
};

export default DetailOrder;
