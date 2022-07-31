import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import Spinner from "components/Loadings/spinner/Spinner";
import { useToasts } from "react-toast-notifications";
import * as fn from "@services/default.service";
import ImageUC from "components/Image/index";
import { CopyToClipboard } from "react-copy-to-clipboard";
import moment from "moment";
import { getOrderHDById, cancelOrder } from "@services/liff.services";
import CancelModel from "../../components/cancelModel"; //popup ยกเลิก
import ReturnModel from "../../components/returnModel"; //popup คืนสินค้า
import CancelDetail from "./cancelDetail";
import ReturnDetail from "./returnDetail";
import { path } from "@services/liff.services";
import { useDispatch } from "react-redux";
import { backPage } from "redux/actions/common";

// components

const OrderPaymentDone = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const history = useHistory();
  const { addToast } = useToasts();
  const [isLoading, setIsLoading] = useState(false);
  const [OrderHD, setOrderHD] = useState(null);
  const [remark, setremark] = useState("");
  const [isOpenmodel, setisOpenmodel] = useState(false);
  const [Cancelvalue, setCancelvalue] = useState(
    "ต้องการเปลี่ยนแปลงที่อยู่ในการจัดส่งสินค้า"
  );
  const [returnModel, setReturnModel] = useState({ isOpen: false });
  const getProducts = async () => {
    if (!fn.IsNullOrEmpty(id)) {
      getOrderHDById(
        { Id: id },
        (res) => {
          if (res.status) {
            let OrderHD = res.data.OrderHD;
            console.log(OrderHD);
            setOrderHD(OrderHD);
            // console.log('OrderHD', OrderHD);
            // if (!fn.IsNullOrEmpty(OrderHD.couponCodeId)) {
            //   setdiscount(OrderHD.RedemptionCoupon.tbRedemptionCoupon.discount);
            // }
          }
        },
        () => { },
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
      () => { },
      () => {
        setIsLoading(false);
      }
    );
  };
  useEffect(() => {
    // dispatch(backPage(true));
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
        style={{ height: "calc(100% - 215px)" }}
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
            {OrderHD.tbCancelOrder == null &&
              OrderHD.tbReturnOrder == null &&
              OrderHD.paymentStatus == 2 ? (
              <>
                <div
                  className="flex mt-2 text-sm "
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
            {OrderHD != null && OrderHD.paymentStatus == 3 && OrderHD.transportStatus == 2 && (
              <div className="text-sm mt-4 mx-auto text-gold-mbk font-bold w-full"
                style={{
                  width: "95%",
                }}>
                <span>
                  <i
                    className="fas fa-truck mr-2"
                  ></i>
                </span>
                ที่ต้องได้รับ
              </div>
            )}
            <div
              className="flex mt-2 text-sm "
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
                  className="text-green-mbk text-sm"
                  style={{
                    width: "50px",
                    textAlign: "end",
                  }}
                >
                  คัดลอก
                </div>
              </CopyToClipboard>
            </div>

            {(OrderHD.paymentStatus === 3 && OrderHD.transportStatus === 1) ||
              OrderHD.transportStatus === 2 ? (
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
                    <div className="flex mt-2 sm" style={{ height: "90px " }}>
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
                        <div className="w-full flex" style={{ height: "60%" }}>
                          {e.productName}
                        </div>

                        <div className="flex relative font-bold">
                          <div
                            style={{
                              color: e.isFree
                                ? "red"
                                : e.discount > 0
                                  ? "rgba(0,0,0,.54)"
                                  : "",
                              textDecoration:
                                e.discount > 0 ? "line-through" : "none",
                            }}
                          >
                            {e.isFree ? "Free" : "฿ " + fn.formatMoney(e.price)}
                          </div>
                          {e.discount > 0 ? (
                            <div style={{ color: "red", paddingLeft: "10px" }}>
                              {"฿ " + fn.formatMoney(e.discount)}
                            </div>
                          ) : null}
                        </div>
                        <div>
                          <div style={{ width: "80%" }}>
                            {"จำนวน : " + e.amount}
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
              className="w-full  relative mt-2 text-sm"
              style={{
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div style={{ width: "95%", margin: "auto" }}>
                <div className="flex relative mb-2 font-bold text-12">
                  <div>{"ยอดรวมสินค้า (" + OrderHD.stockNumber + " ชิ้น)"}</div>
                  <div className="absolute" style={{ right: "0" }}>
                    {"฿ " + fn.formatMoney(OrderHD.sumprice)}
                  </div>
                </div>
                <div className="liff-inline" />
              </div>
              <div style={{ width: "95%", margin: "auto" }}>
                <div className="flex relative mb-2 mt-4 text-sm">
                  <div>ส่วนลดร้านค้า : </div>
                  <div
                    className={
                      "absolute " +
                      (OrderHD.hddiscountStorePromotion > 0
                        ? " text-gold-mbk"
                        : "")
                    }
                    style={{ right: "0" }}
                  >
                    {(fn.formatMoney(OrderHD.hddiscountStorePromotion) > 0
                      ? "-฿ "
                      : "฿ ") +
                      fn.formatMoney(OrderHD.hddiscountStorePromotion)}
                  </div>
                </div>
                <div className="flex relative mb-2 text-sm">
                  <div>ค่าจัดส่ง : </div>

                  <div className={"absolute "} style={{ right: "0" }}>
                    {"฿ " + fn.formatMoney(OrderHD.hddeliveryCost)}
                  </div>
                </div>
                <div className="flex relative mb-2 text-sm">
                  <div>ส่วนลดค่าจัดส่ง : </div>
                  <div
                    className={
                      "absolute " +
                      (OrderHD.hddiscountDelivery > 0 &&
                        fn.formatMoney(
                          OrderHD.hddeliveryCost - OrderHD.hddiscountDelivery
                        ) > 0
                        ? " text-gold-mbk"
                        : "")
                    }
                    style={{ right: "0" }}
                  >
                    {(OrderHD.hddiscountDelivery > 0 &&
                      fn.formatMoney(
                        OrderHD.hddeliveryCost - OrderHD.hddiscountDelivery
                      ) > 0
                      ? "-"
                      : "") +
                      "฿ " +
                      (OrderHD.hddiscountDelivery > 0
                        ? fn.formatMoney(
                          OrderHD.hddeliveryCost - OrderHD.hddiscountDelivery
                        )
                        : '0.00')}
                  </div>
                </div>
                <div className="flex relative mb-2 text-sm">
                  <div>ส่วนลดคูปอง : </div>
                  <div
                    className={
                      "absolute " +
                      (OrderHD.hddiscountCoupon > 0 ? "text-gold-mbk" : "")
                    }
                    style={{ right: "0" }}
                  >
                    {(OrderHD.hddiscountCoupon > 0 ? "-" : "") +
                      "฿ " +
                      fn.formatMoney(OrderHD.hddiscountCoupon)}
                  </div>
                </div>
                <div className="flex relative  mt-4 justify-between">
                  <div
                    className=" text-sm"
                  >
                    ยอดสุทธิ :
                  </div>
                  <div
                    style={{ fontSize: "20px" }}
                    className=" text-green-mbk font-blod "
                  >
                    {"฿ " + fn.formatMoney(OrderHD.netTotal)}
                  </div>
                </div>
                <div
                  className="mb-2 w-full text-gold-mbk text-right"
                >
                  {"+ " + OrderHD.points + " points"}
                </div>
              </div>
            </div>

            <div
              className="w-full  relative mt-2"
              style={{ alignItems: "center", justifyContent: "center" }}
            >
              {OrderHD != null ? (
                OrderHD.paymentStatus == 3 &&
                  (OrderHD.transportStatus == 1 ||
                    OrderHD.transportStatus == 2) ? (
                  <>
                    <div style={{ width: "95%", margin: "auto" }}>
                      <div className="liff-inline mb-2" />
                      <div>
                        <div className="flex relative mb-2 text-gold-mbk ">
                          {
                            OrderHD.transportStatus == 1 ? (
                              <>
                                <div>
                                  <i className="fas fa-shopping-bag"></i>
                                </div>
                                <div className=" px-2 ">
                                  เตรียมสินค้า
                                </div>
                              </>
                            ) : (
                              <>
                                <div
                                  className="flex relative justify-between w-full"
                                >
                                  <div className="text-12 text-gold-mbk">
                                    <span>
                                      <i className="fas fa-box-open mr-2"></i>
                                    </span>
                                    <span className="font-bold">หมายเลขพัสดุ : </span>{OrderHD.trackNo ? OrderHD.trackNo : "-"}
                                  </div>
                                  <div>
                                    <CopyToClipboard
                                      text={OrderHD.trackNo}
                                      onCopy={() => {
                                        addToast("คัดลอกเรียบร้อยแล้ว", {
                                          appearance: "success",
                                          autoDismiss: true,
                                        });
                                      }}
                                    >
                                      <div
                                        className=" text-12 text-green-mbk "
                                      >
                                        คัดลอก
                                      </div>
                                    </CopyToClipboard>
                                  </div>
                                </div>
                              </>
                            )
                          }

                        </div>
                      </div>
                    </div>
                    <div className="liff-inline" />
                  </>
                ) : null
              ) : null}
            </div>
            {/* จ่ายเงินสำเร็จ  */}
            {OrderHD.paymentStatus == 3 && OrderHD.transportStatus == 3 ? (
              <div
                className="w-full  relative mt-2"
                style={{ alignItems: "center", justifyContent: "center" }}
              >
                <div className="w-full" style={{ padding: "10px" }}>
                  <div
                    className="flex outline-gold-mbk text-gold-mbk text-center text-sm justify-center"
                    style={{
                      margin: "auto",
                      height: "35px",
                      borderRadius: "5px",
                      padding: "5px",
                      alignItems: "center",
                      filter:
                        OrderHD.tbReturnOrder != null ? "grayscale(1)" : "",
                    }}
                    onClick={() => {
                      if (OrderHD.tbReturnOrder == null) {
                        setReturnModel({
                          isOpen: true,
                          orderId: OrderHD.id,
                          Callback: () => {
                            setReturnModel({ isOpen: false });
                            getProducts();
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
              </div>
            ) : (
              <div
                className="w-full  relative mt-2"
                style={{ alignItems: "center", justifyContent: "center" }}
              >
                <div className="flex">
                  <div className="w-full" style={{ padding: "10px" }}>
                    <div
                      className="flex  text-center text-lg  font-bold bt-line"
                      style={{
                        backgroundColor:
                          OrderHD != null
                            ? OrderHD.transportStatus == 1
                              ? OrderHD.tbCancelOrder == null
                                ? "red"
                                : ""
                              : ""
                            : "",
                        border:
                          "1px solid " +
                          (OrderHD != null
                            ? OrderHD.transportStatus == 1
                              ? OrderHD.tbCancelOrder == null
                                ? "red"
                                : "#ddd"
                              : "#ddd"
                            : "#ddd"),
                        color:
                          OrderHD != null
                            ? OrderHD.transportStatus == 1
                              ? OrderHD.tbCancelOrder == null
                                ? "#FFFFFF"
                                : "#ddd"
                              : "#ddd"
                            : "#ddd",
                      }}
                      onClick={() => {
                        if (
                          OrderHD.transportStatus == 1 &&
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
            )}
            {/* // "Money Transfer" : "Credit" 1,2 */}
            {OrderHD.paymentType == 1 && OrderHD.paymentStatus > 1 ? (
              <div style={{ width: "90%", margin: "auto" }}>
                <ImageUC
                  style={{ margin: "auto" }}
                  find={1}
                  relatedid={OrderHD.id}
                  relatedtable={["tbOrderHD"]}
                  alt=""
                  className="animated-img "
                ></ImageUC>
              </div>
            ) : null}
          </>
        ) : null}

        <div className="absolute w-full flex" style={{ bottom: "0" }}>
          <div className="w-full flex py-2"
          // style={{ padding: "10px" }}
          >
            <div className="px-2" style={{ width: "50%" }}>
              <div
                className="flex bg-green-mbk text-white text-center text-base bt-line "
                onClick={() => {
                  history.push(path.shopMain);
                }}
              >
                {"ไปหน้าร้านค้า"}
              </div>
            </div>
            <div className="px-2" style={{ width: "50%" }}>
              <div
                className="flex bg-gold-mbk  text-white text-center text-base  bt-line  "
                onClick={() => {
                  history.push(path.myorder.replace(":id", "1"));
                }}
              >
                {"ไปหน้าคำสั่งซื้อของฉัน"}
              </div>
            </div>
            {/* <div
              className="flex bg-green-mbk text-white text-center text-base  font-bold bt-line"
              onClick={() => {
                history.push(path.shopMain);
              }}
            >
              {"กลับไปที่ร้านค้า"}
            </div> */}
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
      <ReturnModel returnModel={returnModel} />
    </>
  );
};

export default OrderPaymentDone;
