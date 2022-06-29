import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import Spinner from "components/Loadings/spinner/Spinner";
import { useToasts } from "react-toast-notifications";
import * as fn from "@services/default.service";
import ImageUC from "components/Image/index";
import { CopyToClipboard } from "react-copy-to-clipboard";
import moment from "moment";
import { getOrderHDById, cancelOrder } from "@services/liff.services";
import CancelModel from "./cancelModel";
import CancelDetail from "./cancelDetail";
import ReturnDetail from "./returnDetail";

// components

const OrderPaymentDone = () => {
  const { id } = useParams();
  const history = useHistory();
  const { addToast } = useToasts();
  const [isLoading, setIsLoading] = useState(false);
  const [OrderHD, setOrderHD] = useState(null);
  const [discount, setdiscount] = useState(null);
  const [remark, setremark] = useState("");
  const [isOpenmodel, setisOpenmodel] = useState(false);
  const [Cancelvalue, setCancelvalue] = useState(
    "ต้องการเปลี่ยนแปลงที่อยู่ในการจัดส่งสินค้า"
  );
  const getProducts = async () => {
    if (!fn.IsNullOrEmpty(id)) {
      getOrderHDById(
        { Id: id },
        (res) => {
          if (res.status) {
            let OrderHD = res.data.OrderHD;
            setOrderHD(OrderHD);
            if (!fn.IsNullOrEmpty(OrderHD.couponCodeId)) {
              setdiscount(OrderHD.RedemptionCoupon.tbRedemptionCoupon.discount);
            }
          }
        },
        () => {},
        () => {
          setIsLoading(false);
        }
      );
    }
  };

  const Cancelorder = () => {
    setIsLoading(true);
    cancelOrder(
      { orderId: id, cancelDetail: Cancelvalue, description: remark },
      (res) => {
        setisOpenmodel(false);
        getProducts();
      },
      () => {},
      () => {
        setIsLoading(false);
      }
    );
  };
  useEffect(() => {
    getProducts();
  }, []);

  return (
    <>
      {isLoading ? <Spinner customText={"Loading"} /> : null}
      <div className="bg-green-mbk">
        <div
          style={{ height: "40px" }}
          className=" noselect text-lg text-white font-bold text-center "
        >
          {"คำสั่งซื้อของฉัน"}
        </div>
      </div>
      <div
        className="overflow-scroll line-scroll"
        style={{ height: "calc(100% - 200px)" }}
      >
        {OrderHD != null ? (
          <>
            {/* ยกเลิก */}
            {OrderHD.tbCancelOrder != null ? (
              <CancelDetail OrderHD={OrderHD} />
            ) : null}
            {/* คืนสินค้า */}
            {OrderHD.tbReturnOrder != null ? (
              <ReturnDetail OrderHD={OrderHD} />
            ) : null}
            {OrderHD.paymentStatus == "Wating" ? (
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
                    className="flex"
                    style={{ width: "calc(100% - 90px)", color: "red" }}
                  >
                    <i
                      className="flex fas fa-receipt"
                      style={{ alignItems: "center" }}
                    ></i>
                    <div className="px-2">รอตรวจสอบ</div>
                  </div>
                </div>
              </>
            ) : null}

            <div
              className="flex mt-2 "
              style={{
                width: "95%",
                marginLeft: "auto",
                marginRight: "auto",
              }}
            >
              <div className="font-bold" style={{ width: "110px" }}>
                หมายเลขคำสั่งซื้อ :{" "}
              </div>
              <div style={{ width: "calc(100% - 160px)" }}>
                {OrderHD.orderNumber}
              </div>
              <CopyToClipboard
                text={OrderHD.orderNumber}
                onCopy={() => {
                  addToast("คัดลอกเรียบร้อยแล้ว", {
                    appearance: "success",
                    autoDismiss: true,
                  });
                }}
              >
                <div
                  className="text-liff-gray-mbk text-sm"
                  style={{
                    width: "50px",
                    textAlign: "end",
                  }}
                >
                  คัดลอก
                </div>
              </CopyToClipboard>
            </div>

            {(OrderHD.paymentStatus === "Done" &&
              OrderHD.transportStatus === "Prepare") ||
            OrderHD.transportStatus === "In Transit" ? (
              <div>
                <div
                  className="flex mt-2 "
                  style={{
                    width: "95%",
                    marginLeft: "auto",
                    marginRight: "auto",
                    color: "#ddd",
                  }}
                >
                  <div className="" style={{ width: "100px" }}>
                    เวลาสั่งซื้อ{" "}
                  </div>
                  <div
                    style={{
                      width: "calc(100% - 100px)",
                      textAlign: "end",
                      fontSize: "13px",
                    }}
                  >
                    {moment(OrderHD.orderDate)
                      .add(543, "years")
                      .format("DD MMM yyyy")}
                  </div>
                </div>
                <div
                  className="flex mt-2 "
                  style={{
                    width: "95%",
                    marginLeft: "auto",
                    marginRight: "auto",
                    color: "#ddd",
                  }}
                >
                  <div className="" style={{ width: "100px" }}>
                    เวลาชำระเงิน{" "}
                  </div>
                  <div
                    style={{
                      width: "calc(100% - 100px)",
                      textAlign: "end",
                      fontSize: "13px",
                    }}
                  >
                    {moment(OrderHD.paymentDate)
                      .add(543, "years")
                      .format("DD MMM yyyy")}
                  </div>
                </div>
              </div>
            ) : null}

            <div
              className="mt-2 line-scroll"
              style={{
                width: "95%",
                marginLeft: "auto",
                marginRight: "auto",
              }}
            >
              {[...OrderHD.dt].map((e, i) => {
                return (
                  <div key={i}>
                    <div className="flex mt-2" style={{ height: "90px " }}>
                      <div style={{ width: "30%" }}>
                        <ImageUC
                          style={{ margin: "auto", height: "90px" }}
                          find={1}
                          relatedid={e.id}
                          relatedtable={["stock1"]}
                          alt="flash_sale"
                          className="w-32 border-2 border-blueGray-50  animated-img"
                        ></ImageUC>
                      </div>
                      <div className="px-2" style={{ width: "70%" }}>
                        <div className="flex" style={{ height: "60%" }}>
                          <div
                            className="font-bold"
                            style={{ width: "80%", fontSize: "11px" }}
                          >
                            {e.productName}
                          </div>
                        </div>
                        <div style={{ height: "15%" }}>
                          <div
                            className="font-bold"
                            style={{ width: "80%", fontSize: "11px" }}
                          >
                            {"จำนวน : " + e.amount}
                          </div>
                        </div>
                        <div style={{ height: "15%" }}>
                          <div
                            className="flex relative font-bold"
                            style={{ fontSize: "11px" }}
                          >
                            <div
                              style={{
                                color: e.discount > 0 ? "rgba(0,0,0,.54)" : "",
                                textDecoration:
                                  e.discount > 0 ? "line-through" : "none",
                              }}
                            >
                              {"฿ " + fn.formatMoney(e.price)}
                            </div>
                            {e.discount > 0 ? (
                              <div
                                style={{ color: "red", paddingLeft: "10px" }}
                              >
                                {"฿ " + fn.formatMoney(e.discount)}
                              </div>
                            ) : null}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="liff-inline" />
                  </div>
                );
              })}
            </div>
          </>
        ) : null}

        {OrderHD != null ? (
          <>
            <div
              className="w-full  relative mt-2"
              style={{
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div style={{ width: "90%", margin: "auto" }}>
                <div>
                  <div className="flex relative mb-2">
                    <div>ยอดรวมสิ้นค้า : </div>
                    <div className="absolute" style={{ right: "0" }}>
                      {"฿ " + fn.formatMoney(OrderHD.sumprice)}
                    </div>
                  </div>
                  <div className="flex relative mb-2">
                    <div>รวมการจัดส่ง : </div>
                    <div className="absolute" style={{ right: "0" }}>
                      {"฿ " + fn.formatMoney(OrderHD.deliveryCost)}
                    </div>
                  </div>
                  <div className="flex relative mb-2">
                    <div>ส่วนลด : </div>
                    {discount != null ? (
                      <div
                        className="absolute text-gold-mbk"
                        style={{ right: "0" }}
                      >
                        {"-฿ " + fn.formatMoney(OrderHD.discount)}
                      </div>
                    ) : (
                      <div className="absolute" style={{ right: "0" }}>
                        {"฿ " + fn.formatMoney(0)}
                      </div>
                    )}
                  </div>
                  <div className="flex relative mb-2">
                    <div>ยอดรวมสินค้า : </div>
                    <div
                      className="absolute text-green-mbk font-blod "
                      style={{ right: "0", fontSize: "20px" }}
                    >
                      {"฿ " + fn.formatMoney(OrderHD.total)}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div
              className="w-full  relative mt-2"
              style={{ alignItems: "center", justifyContent: "center" }}
            >
              {OrderHD != null ? (
                OrderHD.paymentStatus != "Wating" &&
                (OrderHD.transportStatus == "Prepare" ||
                  OrderHD.transportStatus == "In Transit") ? (
                  <>
                    <div style={{ width: "90%", margin: "auto" }}>
                      <div>
                        <div className="flex relative mb-2 text-gold-mbk ">
                          <div>
                            {OrderHD.transportStatus == "Prepare" ? (
                              <i className="fas fa-shopping-bag"></i>
                            ) : (
                              <i className="fas fa-truck"></i>
                            )}
                          </div>
                          <div className=" px-2 ">
                            {OrderHD.transportStatus == "Prepare"
                              ? "เตรียมสินค้า"
                              : OrderHD.transportStatus == "In Transit"
                              ? "อยู่ระหว่างการจัดส่ง"
                              : ""}{" "}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="liff-inline" />
                  </>
                ) : null
              ) : null}
            </div>
            <div
              className="w-full  relative mt-2"
              style={{ alignItems: "center", justifyContent: "center" }}
            >
              <div className="flex">
                <div style={{ width: "100%", padding: "10px" }}>
                  <div
                    className="flex  text-center text-lg  font-bold bt-line"
                    style={{
                      backgroundColor:
                        OrderHD != null
                          ? OrderHD.transportStatus == "Prepare"
                            ? OrderHD.tbCancelOrder == null
                              ? "red"
                              : ""
                            : ""
                          : "",
                      border:
                        "1px solid " +
                        (OrderHD != null
                          ? OrderHD.transportStatus == "Prepare"
                            ? OrderHD.tbCancelOrder == null
                              ? "red"
                              : "#ddd"
                            : "#ddd"
                          : "#ddd"),
                      color:
                        OrderHD != null
                          ? OrderHD.transportStatus == "Prepare"
                            ? OrderHD.tbCancelOrder == null
                              ? "#FFFFFF"
                              : "#ddd"
                            : "#ddd"
                          : "#ddd",
                    }}
                    onClick={() => {
                      if (
                        OrderHD.transportStatus == "Prepare" &&
                        OrderHD.tbCancelOrder == null
                      ) {
                        setisOpenmodel(true);
                      }
                    }}
                  >
                    <i className="fas fa-backspace"></i>
                    <div className="px-2">ยกเลิกคำสั่งซื้อ</div>
                  </div>
                </div>
              </div>
            </div>
            {OrderHD.paymentType == "Money Transfer" ? (
              <div style={{ width: "90%", margin: "auto" }}>
                <ImageUC
                  find={1}
                  relatedid={OrderHD.id}
                  relatedtable={["tbOrderHD"]}
                  alt=""
                  className=" animated-img "
                ></ImageUC>
              </div>
            ) : null}
          </>
        ) : null}

        <div className="absolute w-full flex" style={{ bottom: "0" }}>
          <div className="w-full" style={{ padding: "10px" }}>
            <div
              className="flex bg-green-mbk text-white text-center text-base  font-bold bt-line"
              onClick={() => {
                history.goBack();
              }}
            >
              {"กลับไปที่ร้านค้า"}
            </div>
          </div>
        </div>
      </div>
      <CancelModel
        isOpenmodel={isOpenmodel}
        setisOpenmodel={setisOpenmodel}
        onChange={(e) => {
          setCancelvalue(e.value);
          setremark("");
        }}
        Cancelvalue={Cancelvalue}
        setremark={setremark}
        Cancelorder={Cancelorder}
      />
    </>
  );
};

export default OrderPaymentDone;
