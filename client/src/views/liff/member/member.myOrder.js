import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { path } from "services/liff.services";
import * as fn from "@services/default.service";
import { getMyOrder } from "@services/liff.services";
import Spinner from "components/Loadings/spinner/Spinner";
import ImageUC from "components/Image/index";
import EmptyOrder from "../emptyOrder";
// components

const MyOrder = () => {
  const history = useHistory();
  const [isLoading, setIsLoading] = useState(false);
  const [OrderHD, setOrderHD] = useState([]);
  const GetMyOrder = () => {
    setIsLoading(true);
    getMyOrder(
      (res) => {
        // console.log('res.data.OrderHD', res.data.OrderHD)
        if (res.status) {
          setOrderHD(res.data.OrderHD);
        }
      },
      () => {},
      () => {
        setIsLoading(false);
      }
    );
  };
  useEffect(() => {
    GetMyOrder();
  }, []);
  return (
    <>
      {isLoading ? <Spinner customText={"Loading"} /> : null}
      <div
        className="mt-2  liff-footer line-scroll"
        style={{ padding: "10px" }}
      >
        <div
          className="flex relative "
          style={{ height: "40px", fontSize: "14px" }}
        >
          <div
            className="text-green-mbk font-bold text-12"
            style={{ width: "50%" }}
          >
            คำสั่งชื้อของฉัน
          </div>
          <div
            className="text-liff-gray-mbk text-xs"
            style={{ width: "50%", textAlign: "end" }}
            onClick={() => {
              history.push(path.myorder.replace(":id", "1"));
            }}
          >
            {"ทั้งหมด >"}
          </div>
        </div>
        {OrderHD && OrderHD.length > 0 ? (
          <div className="line-scroll">
            {OrderHD.filter((e) => {
              return e;
              // return (
              //   e.tbCancelOrders.length === 0 && e.tbReturnOrders.length === 0
              // );
            }).map((hd, index) => {
              return (
                <div
                  key={index}
                  onClick={() => {
                    history.push(
                      hd.paymentStatus == 1
                        ? path.makeorderbyid.replace(":id", hd.id)
                        : path.orderpaymentdone.replace(":id", hd.id)
                    );
                  }}
                >
                  {index > 0 && (
                    <div
                      className="liff-inline mb-2"
                      style={{ height: "5px", backgroundColor: "#ebebeb" }}
                    />
                  )}
                  <div className="flex relative" style={{ height: "30px" }}>
                    <div
                      className="font-bold  text-12"
                      style={{ minWidth: "85px" }}
                    >
                      หมายเลขคำสั่งซื้อ :{" "}
                    </div>
                    <div className="px-2 line-clamp-1  text-12">
                      {hd.orderNumber}{" "}
                    </div>
                    {hd.paymentStatus < 3 && (
                      <div
                        className="absolute px-2 text-white border right-0"
                        style={{
                          borderRadius: "10px",
                          background: "red",
                          border: "none",
                        }}
                      >
                        {hd.paymentStatus == 1 ? "รอชําระเงิน" : "รอการตรวจสอบ"}
                      </div>
                    )}
                    {hd.paymentStatus == 3 && (
                      <div
                        className="absolute px-2 text-white border right-0"
                        style={{
                          borderRadius: "10px",
                          border: "none",
                          background:
                            hd.transportStatus == 1
                              ? "rgb(255, 168, 52)"
                              : hd.transportStatus == 1
                              ? "rgb(255, 168, 52)"
                              : "#047738",
                        }}
                      >
                        {hd.transportStatus == 1
                          ? "เตรียมส่ง"
                          : hd.transportStatus == 2
                          ? "กำลังส่ง"
                          : "ส่งแล้ว"}
                      </div>
                    )}
                  </div>
                  {hd.dt.map((e, i) => {
                    return (
                      <div key={i} className="flex" style={{ height: "auto" }}>
                        <div
                          className="flex"
                          style={{ width: "26%", justifyContent: "center" }}
                        >
                          <div style={{ width: "80px", height: "80px" }}>
                            <ImageUC
                              find={1}
                              relatedid={e.id}
                              relatedtable={["stock1"]}
                              alt="flash_sale"
                              className=" border-2 border-blueGray-50 animated-img"
                            ></ImageUC>
                          </div>
                        </div>
                        <div style={{ width: "70%" }}>
                          <div className="font-bold line-clamp-1  text-12">
                            {e.productName}
                          </div>
                          <div className="flex">
                            <div
                              className="text-liff-gray-mbk"
                              style={{ width: "26%" }}
                            >
                              {"x" + e.amount}
                            </div>
                            <div
                              style={{ width: "70%", justifyContent: "end" }}
                              className="flex"
                            >
                              <div
                                className=" text-12"
                                style={{
                                  textDecoration:
                                    e.discount > 0 ? "line-through" : "none",
                                  color: e.isFree
                                    ? "red"
                                    : e.discount > 0
                                    ? "#ddd"
                                    : "#047738",
                                }}
                              >
                                {e.isFree
                                  ? "Free"
                                  : "฿ " + fn.formatMoney(e.price)}
                              </div>
                              {e.discount > 0 ? (
                                <div
                                  className=" text-12"
                                  style={{ color: "red", marginLeft: "5px" }}
                                >
                                  {"฿ " + fn.formatMoney(e.discount)}
                                </div>
                              ) : null}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  <div
                    className="w-full flex mb-2 text-liff-gray-mbk"
                    style={{ fontSize: "12px", justifyContent: "end" }}
                  >
                    <div className="font-bold  text-12">
                      {"ดูรายละเอียดคำสั่งซื้อ >"}
                    </div>
                  </div>

                  <div className="flex">
                    <div className="text-sm font-bold" style={{ width: "50%" }}>
                      {"ยอดรวมสินค้า (" + hd.stockNumber + " ชิ้น)"}
                    </div>
                    <div
                      className="font-bold text-sm"
                      style={{
                        width: "50%",
                        textAlign: "end",
                        color: "#047738",
                      }}
                    >
                      {"฿ " + fn.formatMoney(hd.netTotal) + " บาท"}{" "}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex justify-center items-center h-full">
            <div style={{ height: "50px" }}>
              <EmptyOrder text={"ยังไม่คำสั่งชื้อ"} />
            </div>
          </div>
        )}
      </div>
    </>
  );
};
export default MyOrder;
