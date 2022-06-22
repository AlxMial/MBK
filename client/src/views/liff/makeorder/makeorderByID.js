import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import Spinner from "components/Loadings/spinner/Spinner";
import { useToasts } from "react-toast-notifications";
import axios from "services/axios";
import { path } from "services/liff.services";
import * as Storage from "@services/Storage.service";
import * as fn from "@services/default.service";
import ImageUC from "components/Image/index";
import Select from "react-select";
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

const MakeOrderById = () => {
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
            getOrderHDById({ Id: id }, async (res) => {
                if (res.status) {
                    let OrderHD = res.data.OrderHD
                    setOrderHD(OrderHD)
                    setpaymentID(OrderHD.paymentId)
                    setisLogistic(OrderHD.logisticId)
                    setdeliveryCost(OrderHD.deliveryCost)
                    settbPromotionDelivery(OrderHD.PromotionDelivery)


                    let shop_orders = OrderHD.dt;
                    shop_orders.map((e, i) => {
                        idlist.push(e.stockId);
                    });

                    if (Storage.getusecoupon() == null) {
                        if (!fn.IsNullOrEmpty(OrderHD.couponCodeId)) {
                            setusecoupon(OrderHD.couponCodeId)
                        } else {
                            setusecoupon(null)
                        }
                    } else {
                        let usecoupon = Storage.getusecoupon()
                        if (usecoupon.id === id) {
                            setusecoupon(usecoupon.usecoupon)
                        }
                    }
                    await axios.post("stock/getStock", { id: idlist }).then((response) => {
                        if (response.data.status) {
                            let tbStock = response.data.tbStock;
                            // setCartItem(tbStock);
                            let price = 0;
                            tbStock.map((e, i) => {
                                let quantity = shop_orders.find((o) => o.stockId == e.id).amount;
                                e.quantity = quantity;
                                if (e.priceDiscount > 0) {
                                    price += parseFloat(e.priceDiscount) * parseInt(quantity);
                                } else {
                                    price += parseFloat(e.price) * parseInt(quantity);
                                }
                            });

                            price = price
                            setsumprice(price < 1 ? 0 : price);
                        }
                    });


                }
            }, () => { }, () => { setIsLoading(false) })
        }



    };
    const setDeliveryCost = (e) => {

        setdeliveryCost(e)
        setTimeout(() => {
            // getProducts()
        }, 1000);


    }
    const Cancelcoupon = () => {
        if (id == "cart") {
            let item = Storage.get_cart()
            item.usecoupon = null
            Storage.upd_cart(item);
        } else {
            let item = Storage.getbyorder()
            item.usecoupon = null
            Storage.updbyorder(item)
        }
        getProducts()
    }

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
                    settbPromotionDelivery(tbPromotionDelivery)
                }
            },
        );
    }
    //สั่งสินค้า 
    const sendOrder = () => {
        if (OrderHD.paymentStatus == "Wating") {
            console.log("update")
        }
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
                    </div> : null}

                <div
                    className="flex relative"
                    style={{
                        height: "20px",
                        alignItems: "center",
                        justifyContent: "center",
                        marginTop: "0.5rem"
                    }}
                >
                    <div className="px-2 absolute" style={{ left: "10px" }}>
                        <img
                            style={{ margin: "auto", width: "22px", height: "22px" }}
                            src={require("assets/img/mbk/icon_sale.png").default
                            }
                            alt="icon_sale"
                            className="w-32 border-2 border-blueGray-50"
                        ></img>
                    </div>
                    <div className="px-2 absolute font-bold" style={{ left: "50px" }}>
                        {usecoupon != null ? usecoupon.couponName : "รหัสส่วนลด"}
                    </div>
                    <div
                        className="absolute"
                        style={{ right: "10px" }}

                    > {OrderHD != null ?
                        <div className="flex">
                            <div style={{ color: usecoupon != null ? "red" : "var(--mq-txt-color, rgb(192, 192, 192))" }}
                                onClick={() => {
                                    if (OrderHD.paymentStatus != "Done" && !OrderHD.isCancel) {
                                        history.push(path.usecoupon.replace(":id", id))
                                    }
                                }}
                            >
                                {usecoupon != null ? ("-฿ " + fn.formatMoney(usecoupon.discount)) : "ใช้ส่วนลด >"}
                            </div>
                            <div className="px-2">
                                {usecoupon != null && OrderHD.paymentStatus != "Done" && !OrderHD.isCancel ? <i className="fas fa-times-circle" style={{ color: "red" }} onClick={Cancelcoupon}></i> : null}
                            </div>
                        </div> : null}

                    </div>


                </div>
                <div className="liff-inline" />

                <div
                    className="w-full  relative mt-2"
                    style={{

                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <div className="w-full mb-2">
                        <div style={{ width: "90%", margin: "auto" }}>
                            <div className="w-full font-bold">ที่อยู่จัดส่ง</div>
                        </div>
                    </div>
                    <div className="px-5 py-5" style={{
                        width: "90%", margin: "auto",
                        border: "1px solid var(--mq-txt-color, rgb(170, 170, 170))",
                        borderRadius: "10px"
                    }}>
                        <div className="mb-2">

                            {optionaddress.length > 0 && OrderHD != null ?
                                <Select
                                    isDisabled={OrderHD.transportStatus == "In Transit" || OrderHD.transportStatus == "Done" || OrderHD.isCancel ? true : false}
                                    className="text-gray-mbk mt-1 text-sm w-full border-none select-address "
                                    isSearchable={false}
                                    id={"category"}
                                    name={"category"}

                                    value={optionaddress.filter(o => o.value === isAddress)}
                                    options={optionaddress}

                                    formatOptionLabel={({ value, label, address, name, customAbbreviation }) => (
                                        <div >
                                            <div className="font-bold">{name}</div>
                                            <div style={{
                                                width: "100%",
                                                whiteSpace: "break-spaces",
                                                color: "var(--mq-txt-color, rgb(170, 170, 170))"
                                            }}>{address}</div>
                                        </div>
                                    )}
                                    onChange={(e) => {
                                        setisAddress(e.id)
                                    }}

                                />
                                : null}

                        </div>
                        {OrderHD != null ?
                            <div className="flex">
                                {OrderHD.transportStatus != "In Transit" || OrderHD.transportStatus == "Done" || OrderHD.isCancel ?
                                    <>
                                        <i className="fas fa-plus-circle flex " style={{ alignItems: "center" }}></i>
                                        <div className="px-2">เพิ่มที่อยู่</div>
                                    </> : null}
                            </div> : null}
                    </div>
                </div>


                <div
                    className="w-full  relative mt-2"
                    style={{

                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <div className="w-full mb-2">
                        <div style={{ width: "90%", margin: "auto" }}>
                            <div className="w-full font-bold">ช่องทางการขนส่ง</div>
                        </div>
                    </div>
                    <div className="px-5 py-5" style={{
                        width: "90%", margin: "auto",
                        border: "1px solid var(--mq-txt-color, rgb(170, 170, 170))",
                        borderRadius: "10px"
                    }}>
                        <div className="mb-2">

                            {optionLogistic.length > 0 && OrderHD != null ?
                                <Select
                                    isDisabled={OrderHD.transportStatus == "In Transit" || OrderHD.transportStatus == "Done" || OrderHD.isCancel ? true : false}
                                    className="text-gray-mbk mt-1 text-sm w-full border-none select-address "
                                    isSearchable={false}
                                    value={optionLogistic.filter(o => o.value === isLogistic)}
                                    options={optionLogistic}

                                    formatOptionLabel={({ name, description, deliveryCost }) => (
                                        <div >
                                            <div className="font-bold">{name}</div>
                                            <div style={{
                                                width: "100%",
                                                whiteSpace: "break-spaces",
                                                color: "var(--mq-txt-color, rgb(170, 170, 170))"
                                            }}>{fn.IsNullOrEmpty(description) ? "-" : description}</div>
                                            <div style={{
                                                width: "100%",
                                                whiteSpace: "break-spaces",
                                                color: "var(--mq-txt-color, rgb(170, 170, 170))"
                                            }}>{deliveryCost == 0 ? "ส่งฟรี" : ("฿ " + fn.formatMoney(deliveryCost))}</div>

                                        </div>
                                    )}
                                    onChange={(e) => {
                                        setisLogistic(e.id)
                                        setDeliveryCost(e.deliveryCost)
                                    }}

                                />
                                : null}

                        </div>

                    </div>
                </div>

                <div
                    className="w-full  relative mt-2"
                    style={{

                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <div className="w-full mb-2">
                        <div style={{ width: "90%", margin: "auto" }}>
                            <div className="w-full font-bold">ช่องทางการชำระเงิน</div>
                        </div>
                    </div>
                    <div className="px-5 py-5" style={{
                        width: "90%", margin: "auto",
                        border: "1px solid var(--mq-txt-color, rgb(170, 170, 170))",
                        borderRadius: "10px"
                    }}>
                        {OrderHD != null ?
                            <Radio.Group
                                className="w-full radio-lbl-full"
                                disabled={OrderHD.paymentStatus == "Done" ? true : false}
                                onChange={(e) => {
                                    setRadio(e.target.value)
                                }}
                                value={RadioPayment}
                            >
                                <Radio value={1} className="w-full Radio-Payment " >
                                    <div >
                                        <div className="flex mb-2">
                                            <i className="fas fa-landmark flex " style={{ alignItems: "center", color: "rgb(208 175 44)" }}></i>
                                            <div className="font-bold px-2">โอนผ่านธนาคาร</div>
                                        </div>

                                        <div className="mb-2" style={{ display: RadioPayment == 2 ? "none" : "" }}>
                                            {optionPayment.length > 0 ?
                                                <Select
                                                    isDisabled={OrderHD.paymentStatus == "Done" || OrderHD.isCancel ? true : false}
                                                    className="text-gray-mbk mt-1 text-sm w-full border-none select-address "

                                                    isSearchable={false}
                                                    // id={"category"}
                                                    // name={"category"}

                                                    value={optionPayment.filter(o =>
                                                        o.value
                                                        === paymentID)}

                                                    options={optionPayment}

                                                    formatOptionLabel={({ bankName, accountNumber, bankBranchName }) => (
                                                        <div >
                                                            <div className="font-bold">{bankName}</div>
                                                            <div style={{ fontWeight: "100", color: "var(--mq-txt-color, rgb(170, 170, 170))" }}>{"เลขบัญชี : " + accountNumber}</div>
                                                            <div style={{ fontWeight: "100", color: "var(--mq-txt-color, rgb(170, 170, 170))" }}>{"สาขา : " + bankBranchName}</div>

                                                        </div>
                                                    )}

                                                    onChange={(e) => {
                                                        setpaymentID(e.id)
                                                    }}

                                                />
                                                : null}

                                        </div>
                                    </div>
                                </Radio>


                                <Radio value={2} className="w-full Radio-Payment ">
                                    <div>
                                        <div className="flex  ">
                                            <i className="fas fa-credit-card flex " style={{ alignItems: "center", color: "rgb(208 175 44)" }}></i>
                                            <div className="font-bold px-2">ผ่านบัตรเครดิต</div>
                                        </div>
                                        <div className="flex mt-2" style={{
                                            width: "100%",
                                            border: "1px solid var(--mq-txt-color, rgb(170, 170, 170))",
                                            borderRadius: "10px",
                                            height: "50px",
                                            justifyContent: "center",
                                            alignItems: "center",
                                            display: RadioPayment == 1 ? "none" : ""
                                        }}>
                                            <div className="mb-2 flex">
                                                <i className="fas fa-plus-circle flex " style={{ alignItems: "center" }}></i>
                                                <div className="px-2 w-full font-bold">เพิ่มบัตรเครดิต/เดบิต</div>
                                            </div>
                                        </div>
                                    </div>
                                </Radio>

                            </Radio.Group>
                            : null}

                    </div>
                </div>

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
                                    {/* {usecoupon == null ? "฿ " + fn.formatMoney(sumprice + deliveryCost) :
                                        "฿ " + fn.formatMoney(sumprice - usecoupon.discount + deliveryCost)
                                    } */}

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
                                            (sumprice < usecoupon.discount ? 0 : sumprice-usecoupon.discount)
                                            + (
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
                    <div style={{ width: "50%", padding: "10px" }}>
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
                    <div style={{ width: "50%", padding: "10px" }}>
                        <div
                            className="flex bg-gold-mbk text-white text-center text-lg  font-bold "
                            style={{
                                margin: "auto",
                                height: "45px",
                                borderRadius: "10px",
                                padding: "5px",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                            onClick={() => {

                                sendOrder()
                            }}
                        >
                            {"สั่งสินค้า"}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};


export default MakeOrderById;
