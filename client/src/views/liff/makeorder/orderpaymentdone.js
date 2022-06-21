import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import Spinner from "components/Loadings/spinner/Spinner";
import { useToasts } from "react-toast-notifications";
import axios from "services/axios";
import { path } from "services/liff.services";
import * as Storage from "@services/Storage.service";
import * as fn from "@services/default.service";
import ImageUC from "components/Image/index";
import { CopyToClipboard } from "react-copy-to-clipboard";
import {
    getMemberAddress,
    gettbPayment,
    gettbLogistic, doSaveOrder,
    getOrderHDById

} from "@services/liff.services";
import { Radio } from "antd";

import api_province from "../../../assets/data/api_province.json";
import api_amphure from "../../../assets/data/api_amphure.json";
import api_tombon from "../../../assets/data/api_tombon.json";
// components

const OrderPaymentDone = () => {
    const { id } = useParams();
    const history = useHistory();
    const { addToast } = useToasts();
    const [isLoading, setIsLoading] = useState(false);


    const [optionaddress, setoptionaddress] = useState([]);
    const [isAddress, setisAddress] = useState(null);

    const [optionLogistic, setoptionLogistic] = useState([]);
    const [isLogistic, setisLogistic] = useState(null);
    const [deliveryCost, setdeliveryCost] = useState(0);

    const [tbPromotionDelivery, settbPromotionDelivery] = useState(null);

    const [optionPayment, setPayment] = useState([]);
    const [paymentID, setpaymentID] = useState(null);
    const [RadioPayment, setRadio] = useState(1);

    const [OrderHD, setOrderHD] = useState(null);

    const [usecoupon, setusecoupon] = useState(null);

    const [sumprice, setsumprice] = useState(0);
    const getProducts = async () => {
        let idlist = [];
        let item;
        if (!fn.IsNullOrEmpty(id)) {
            getOrderHDById({ Id: id }, (res) => {
                if (res.status) {
                    let OrderHD = res.data.OrderHD
                    setOrderHD(OrderHD)
                    setpaymentID(OrderHD.paymentId)
                    setisLogistic(OrderHD.logisticId)


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

                    setsumprice(_sumprice)

                }
            }, () => { }, () => { setIsLoading(false) })
        }



    };



    const getMemberaddress = async () => {
        getMemberAddress(
            (res) => {
                if (res.data.code === 200) {
                    let option = res.data.option
                    option.map((e, i) => {
                        if (e.isDefault) {
                            setisAddress(e.id)
                        }
                    })
                    getAddress(option)

                }
            },
        );
    }

    const getAddress = async (option) => {
        for (var i = 0; i < option.length; i++) {
            let province = await api_province
            province = province.find(e => e.value.toString() === option[i].province)

            let district = await api_amphure
            district = district.find(e => e.value.toString() === option[i].district)

            let subDistrict = await api_tombon
            subDistrict = subDistrict.find(e => e.value.toString() === option[i].subDistrict)

            option[i].address = `${option[i].address} ต.${subDistrict.label} อ.${district.label} จ.${province.label} ${option[i].postcode} ${option[i].email}`
            option[i].name = `คุณ${option[i].firstName} ${option[i].lastName}`
            option[i].value = option[i].id
        }
        setoptionaddress(option)
    }
    const gettbpayment = async (option) => {
        gettbPayment(
            (res) => {
                if (res.data.code === 200) {
                    let option = res.data.tbPayment
                    for (var i = 0; i < option.length; i++) {
                        option[i].value = option[i].id
                    }
                    setPayment(option)
                }
            },
        );
    }

    const getTbLogistic = async (option) => {
        gettbLogistic(
            (res) => {
                if (res.data.status) {
                    let option = res.data.tbLogistic
                    let tbPromotionDelivery = res.data.tbPromotionDelivery

                    for (var i = 0; i < option.length; i++) {
                        option[i].value = option[i].id
                        option[i].name = `${option[i].deliveryName}`
                    }
                    setoptionLogistic(option)

                }
            },
        );
    }

    useEffect(() => {
        getProducts();
        getMemberaddress()
        gettbpayment()
        getTbLogistic()
    }, []);


    return (
        <>
            {isLoading ? <Spinner customText={"Loading"} /> : null}
            <div className="bg-green-mbk">
                <div
                    style={{ height: "40px" }}
                    className=" noselect text-lg text-white font-bold text-center "
                >
                    {"ทำการสั่งซื้อ"}
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
                                    {usecoupon == null ? "฿ " + fn.formatMoney(sumprice) :
                                        "฿ " + fn.formatMoney(sumprice + usecoupon.discount)
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
                                {usecoupon != null ?
                                    <div className="absolute text-gold-mbk" style={{ right: "0" }}>
                                        {"-฿ " + fn.formatMoney(usecoupon.discount)}
                                    </div> : <div className="absolute" style={{ right: "0" }}>
                                        {"฿ " + fn.formatMoney(0)}
                                    </div>}
                            </div>
                            <div className="flex relative mb-2">
                                <div>ยอดรวมสินค้า : </div>
                                <div className="absolute text-green-mbk font-blod " style={{ right: "0", fontSize: "20px" }}>
                                    {"฿ " + fn.formatMoney(
                                        usecoupon == null ?
                                            //ไม่มีสวนลด
                                            sumprice + (
                                                //ไม่โปร
                                                tbPromotionDelivery == null ? deliveryCost :
                                                    //มีโปร
                                                    (sumprice + deliveryCost) > tbPromotionDelivery.buy ?
                                                        (deliveryCost > tbPromotionDelivery.deliveryCost ? deliveryCost - tbPromotionDelivery.deliveryCost : 0)
                                                        : deliveryCost
                                            ) :
                                            //มีส่วนลด   
                                            (sumprice < usecoupon.discount ? 0 :
                                                sumprice - usecoupon.discount) + (
                                                //ไม่โปร
                                                tbPromotionDelivery == null ? deliveryCost :
                                                    //มีโปร
                                                    (sumprice + deliveryCost) > tbPromotionDelivery.buy ?
                                                        (deliveryCost > tbPromotionDelivery.deliveryCost ? deliveryCost - tbPromotionDelivery.deliveryCost : 0)
                                                        : deliveryCost
                                            )
                                    )}

                                </div>
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
