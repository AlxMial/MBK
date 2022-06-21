import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import Spinner from "components/Loadings/spinner/Spinner";
import { useToasts } from "react-toast-notifications";
import { path } from "services/liff.services";
import * as Storage from "@services/Storage.service";
import * as fn from "@services/default.service";
import ImageUC from "components/Image/index";
import { CopyToClipboard } from "react-copy-to-clipboard";
import {

    getOrderHDById

} from "@services/liff.services";


// components

const OrderPaymentDone = () => {
    const { id } = useParams();
    const history = useHistory();
    const { addToast } = useToasts();
    const [isLoading, setIsLoading] = useState(false);

    const [deliveryCost, setdeliveryCost] = useState(0);

    const [OrderHD, setOrderHD] = useState(null);

    const [discount, setdiscount] = useState(null);

    const [sumprice, setsumprice] = useState(0);
    const getProducts = async () => {
        let idlist = [];
        let item;
        if (!fn.IsNullOrEmpty(id)) {
            getOrderHDById({ Id: id }, (res) => {
                if (res.status) {
                    let OrderHD = res.data.OrderHD
                    setOrderHD(OrderHD)
                    let _sumprice = 0
                    OrderHD.dt.map((e, i) => {
                        if (e.discount > 0) {
                            if (e.discountType == "THB") {
                                _sumprice += (e.price - e.discount) * e.amount
                            } else {
                                _sumprice += (e.price - ((e.discount / 100) * e.price)) * e.amount
                            }
                        } else {
                            _sumprice += e.price * e.amount
                        }
                    })
                    if (_sumprice > OrderHD.PromotionDelivery.buy) {
                        if (OrderHD.deliveryCost < OrderHD.PromotionDelivery.deliveryCost) {
                            setdeliveryCost(0)
                        } else {
                            setdeliveryCost(OrderHD.deliveryCost - OrderHD.PromotionDelivery.deliveryCost)
                        }

                    } else {
                        setdeliveryCost(OrderHD.deliveryCost)
                    }

                    if (!fn.IsNullOrEmpty(OrderHD.couponCodeId)) {
                        setdiscount(OrderHD.RedemptionCoupon.tbRedemptionCoupon.discount)
                    }


                    setsumprice(_sumprice)

                }
            }, () => { }, () => { setIsLoading(false) })
        }



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
            <div className="overflow-scroll line-scroll" style={{ height: "calc(100% - 200px)" }}>

                {OrderHD != null ?
                    <>
                        <div className="flex mt-2 " style={{
                            width: "95%",
                            marginLeft: "auto",
                            marginRight: "auto",
                        }}>
                            <div className="font-bold" style={{ width: "110px" }}>หมายเลขคำสั่งซื้อ : </div>
                            <div style={{ width: "calc(100% - 160px)" }}>{OrderHD.orderNumber}</div>
                            <CopyToClipboard text={OrderHD.orderNumber}>
                                <div style={{ width: "50px", textAlign: "end", color: "var(--mq-txt-color, rgb(170, 170, 170))", fontSize: "13px" }}>
                                    คัดลอก
                                </div>
                            </CopyToClipboard>
                        </div>

                        {(OrderHD.paymentStatus === "Done" && OrderHD.transportStatus === "Prepare" || OrderHD.transportStatus === "In Transit") ?
                            <div>
                                <div className="flex mt-2 " style={{
                                    width: "95%",
                                    marginLeft: "auto",
                                    marginRight: "auto",
                                }}>
                                    <div className="" style={{ width: "100px", color: "#ddd" }}>เวลาสั่งซื้อ  </div>
                                    <div style={{ width: "calc(100% - 100px)", textAlign: "end", color: "var(--mq-txt-color, rgb(170, 170, 170))", fontSize: "13px" }}>
                                        {OrderHD.orderDate}
                                    </div>
                                </div>
                                <div className="flex mt-2 " style={{
                                    width: "95%",
                                    marginLeft: "auto",
                                    marginRight: "auto",
                                }}>
                                    <div className="" style={{ width: "100px", color: "#ddd" }}>เวลาชำระเงิน  </div>
                                    <div style={{ width: "calc(100% - 100px)", textAlign: "end", color: "var(--mq-txt-color, rgb(170, 170, 170))", fontSize: "13px" }}>
                                        {OrderHD.paymentDate}
                                    </div>
                                </div>
                            </div>

                            : null}
                        <div
                            className="mt-2 line-scroll"
                            style={{
                                maxHeight: "calc(100% - 420px)",
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
                                                    relatedid={e.stock.id}
                                                    relatedtable={["stock1"]}
                                                    alt="flash_sale"
                                                    className="w-32 border-2 border-blueGray-50"
                                                ></ImageUC>
                                            </div>
                                            <div className="px-2" style={{ width: "70%" }}>
                                                <div className="flex" style={{ height: "60%" }}>
                                                    <div className="font-bold" style={{ width: "80%", fontSize: "11px" }}>{e.stock.productName}</div>
                                                </div>
                                                <div style={{ height: "15%" }}>
                                                    <div className="font-bold" style={{ width: "80%", fontSize: "11px" }}>{"จำนวน : " + e.amount}</div>
                                                </div>
                                                <div style={{ height: "15%" }}>
                                                    <div className="flex relative font-bold" style={{ fontSize: "11px" }} >
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
                                                            <div style={{ color: "red", paddingLeft: "10px" }}>
                                                                {"฿ " + fn.formatMoney(e.discountType === "THB" ? e.discount : e.price - ((e.discount / 100) * e.price))}
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
                    </> : null
                }


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
                                    {discount == null ? "฿ " + fn.formatMoney(sumprice) :
                                        "฿ " + fn.formatMoney(sumprice)
                                    }
                                </div>
                            </div>
                            <div className="flex relative mb-2">
                                <div>รวมการจัดส่ง : </div>
                                <div className="absolute" style={{ right: "0" }}>
                                    {"฿ " + fn.formatMoney(deliveryCost)}

                                </div>
                            </div>
                            <div className="flex relative mb-2">
                                <div>ส่วนลด : </div>
                                {discount != null ?
                                    <div className="absolute text-gold-mbk" style={{ right: "0" }}>
                                        {"-฿ " + fn.formatMoney(discount)}
                                    </div> : <div className="absolute" style={{ right: "0" }}>
                                        {"฿ " + fn.formatMoney(0)}
                                    </div>}
                            </div>
                            <div className="flex relative mb-2">
                                <div>ยอดรวมสินค้า : </div>
                                <div className="absolute text-green-mbk font-blod " style={{ right: "0", fontSize: "20px" }}>
                                    {"฿ " + fn.formatMoney(
                                        (sumprice - discount + deliveryCost)
                                    )}

                                </div>
                            </div>
                        </div>
                    </div>


                </div>

                <div className="w-full  relative mt-2" style={{ alignItems: "center", justifyContent: "center", }} >
                    {OrderHD != null ?
                        OrderHD.transportStatus == "Prepare" || OrderHD.transportStatus == "In Transit" ?
                            <><div style={{ width: "90%", margin: "auto" }}>
                                <div>
                                    <div className="flex relative mb-2 text-gold-mbk ">
                                        <div><i class="fas fa-truck"></i> </div>
                                        <div className=" px-2 ">{OrderHD.transportStatus == "Prepare" ? "เตรียมสินค้า" : OrderHD.transportStatus == "In Transit" ? "อยู่ระหว่างการจัดส่ง" : ""} </div>
                                    </div>

                                </div>
                            </div>
                                <div className="liff-inline" />
                            </>
                            : null
                        :
                        null}
                </div>


                <div className="w-full  relative mt-2" style={{ alignItems: "center", justifyContent: "center", }} >
                    <div className="flex">
                        <div style={{ width: "50%", padding: "10px" }}>
                            <div
                                className="flex  text-center text-lg  font-bold "
                                style={{
                                    margin: "auto",
                                    height: "45px",
                                    borderRadius: "10px",
                                    padding: "5px",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    backgroundColor: (OrderHD != null ? (OrderHD.transportStatus == "Prepare" ? "red" : "") : ""),
                                    border: ("1px solid " + (OrderHD != null ? (OrderHD.transportStatus == "Prepare" ? "red" : "#ddd") : "#ddd")),
                                    color: (OrderHD != null ? (OrderHD.transportStatus == "Prepare" ? "#FFFFFF" : "#ddd") : "#ddd"),
                                }}
                                onClick={() => {
                                    if (OrderHD.transportStatus == "Prepare") {
                                        // history.goBack()
                                        console.log("ยกเลิกคำสั่งซื้อ")
                                    }
                                }}
                            >
                                {"ยกเลิกคำสั่งซื้อ"}
                            </div>
                        </div>
                        <div style={{ width: "50%", padding: "10px" }}>
                            <div
                                className="flex  text-gold-mbk outline-gold-mbk text-center text-lg  font-bold "
                                style={{
                                    margin: "auto",
                                    height: "45px",
                                    borderRadius: "10px",
                                    padding: "5px",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                                onClick={() => {
                                    history.goBack()
                                }}
                            >
                                {"แนบสลิปโอนเงิน"}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="absolute w-full flex" style={{ bottom: "0" }}>
                    <div style={{ width: "100%", padding: "10px" }}>
                        <div
                            className="flex bg-green-mbk text-white text-center text-lg  font-bold "
                            style={{
                                margin: "auto",
                                height: "45px",
                                borderRadius: "10px",
                                padding: "5px",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                            onClick={() => {
                                history.goBack()
                            }}
                        >
                            {"กลับไปที่ร้านค้า"}
                        </div>
                    </div>

                </div>
            </div>
        </>
    );
};


export default OrderPaymentDone;
