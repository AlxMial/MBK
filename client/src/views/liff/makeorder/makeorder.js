import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import Spinner from "components/Loadings/spinner/Spinner";
import { useToasts } from "react-toast-notifications";
import axios from "services/axios";
import { path } from "services/liff.services";
import * as Storage from "@services/Storage.service";
import * as Session from "@services/Session.service";
import * as fn from "@services/default.service";
import ImageUC from "components/Image/index";
import Select from "react-select";
import {
    getMemberAddress,
    gettbPayment,
    gettbLogistic,
    doSaveOrder,
    get_shopcart

} from "@services/liff.services";
import { Radio } from "antd";
import api_province from "../../../assets/data/api_province.json";
import api_amphure from "../../../assets/data/api_amphure.json";
import api_tombon from "../../../assets/data/api_tombon.json";
// components

const MakeOrder = () => {
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

    const [CartItem, setCartItem] = useState([]);
    const [usecoupon, setusecoupon] = useState(null);

    const [sumprice, setsumprice] = useState(0);
    let { id } = useParams();
    const getProducts = async () => {
        let idlist = [];
        let item = {};
        const setData = async () => {
            if (!fn.IsNullOrEmpty(item)) {
                let shop_orders = item.shop_orders;
                shop_orders.map((e, i) => {
                    idlist.push(e.id);
                });

                if (id == "cart") {
                    setusecoupon(Storage.getconpon_cart())
                } else {
                    let item = Storage.getbyorder()
                    setusecoupon(item.usecoupon)
                }

                await axios.post("stock/getStock", { id: idlist }).then((response) => {
                    if (response.data.status) {
                        let tbStock = response.data.tbStock;
                        setCartItem(tbStock);
                        let price = 0;
                        tbStock.map((e, i) => {
                            let quantity = shop_orders.find((o) => o.id == e.id).quantity;
                            e.quantity = quantity;
                            if (e.priceDiscount > 0) {
                                price += parseFloat(e.priceDiscount) * parseInt(quantity);
                            } else {
                                price += parseFloat(e.price) * parseInt(quantity);
                            }
                        });
                        // if (!fn.IsNullOrEmpty(item.usecoupon)) {
                        //     price = price - item.usecoupon.discount
                        // }
                        price = price
                        setsumprice(price < 1 ? 0 : price);
                    } else {
                        setCartItem([]);
                        // error
                    }
                });
            }
        }
        if (id === "cart") {
            get_shopcart({ uid: Session.getLiff().uid }, async (res) => {
                if (res.data.status) {
                    if (res.data.shop_orders.length > 0) {
                        item.shop_orders = []
                        item.shop_orders = res.data.shop_orders
                    }
                }
                setData()
            })
        }
        else if (id === "byorder") {
            item = Storage.getbyorder()
            setData()
        }


    };
    const setDeliveryCost = (e) => {
        setdeliveryCost(e)
        // console.log(tbPromotionDelivery)
        setTimeout(() => {
            getProducts()
        }, 1000);
    }
    const Cancelcoupon = () => {
        if (id == "cart") {
            Storage.removeconpon_cart()
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
                    setpaymentID(option[0].id)
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
                    setisLogistic(option[0].value)
                    setdeliveryCost(option[0].deliveryCost)
                    settbPromotionDelivery(tbPromotionDelivery)
                }
            },
        );
    }
    //สั่งสินค้า 
    const sendOrder = () => {
        if (!fn.IsNullOrEmpty(CartItem)) {
            let item = {}
            const setData = () => {
                let shop_orders = item.shop_orders;
                let dt = []
                CartItem.filter(e => {
                    dt.push({
                        stockId: e.id,
                        amount: e.quantity,
                        price: e.price,
                        discount: e.discount,
                        discountType: e.discountType
                    })
                })
                let order = {
                    orderhd: {
                        paymentId: RadioPayment === 1 ? paymentID : null,
                        paymentType: RadioPayment === 1 ? "Money Transfer" : "Credit",
                        logisticId: isLogistic,
                        stockNumber: shop_orders.length,
                        paymentStatus: "Wating",
                        transportStatus: "Prepare",
                        isAddress: isAddress,
                        usecouponid: usecoupon.id
                    },
                    orderdt: dt
                }
                console.log(order)

                doSaveOrder(order, (res) => {
                    if (res.status) {
                        // ลบข้อมูล
                        if (id == "cart") {
                            item = Storage.remove_cart()
                        }
                        else {
                            item = Storage.remove_byorder()
                        }

                        history.push(path.paymentInfo.replace(":id", res.data.orderId))
                    } else {

                    }
                })
            }
            if (id == "cart") {
                // item = Storage.get_cart()
                get_shopcart({ uid: Session.getLiff().uid }, async (res) => {
                    if (res.data.status) {
                        if (res.data.shop_orders.length > 0) {
                            item.shop_orders = []
                            item.shop_orders = res.data.shop_orders
                        }
                    }
                    setData()
                })
            }
            else {
                item = Storage.getbyorder()
                setData()
            }

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
                <div
                    className="mt-2 line-scroll"
                    style={{
                        maxHeight: "calc(100% - 420px)",
                        width: "95%",
                        marginLeft: "auto",
                        marginRight: "auto",
                    }}
                >
                    {[...CartItem].map((e, i) => {
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
                                            className="w-32 border-2 border-blueGray-50 animated-img"
                                        ></ImageUC>
                                    </div>
                                    <div className="px-2" style={{ width: "70%" }}>
                                        <div className="flex" style={{ height: "60%" }}>
                                            <div className="font-bold" style={{ width: "80%", fontSize: "11px" }}>{e.productName}</div>
                                        </div>
                                        <div className="font-bold" style={{ height: "15%" }}>
                                            <div className="flex  relative" style={{ fontSize: "11px" }} >
                                                <div
                                                    style={{
                                                        color: e.discount > 0 ? "rgba(0,0,0,.54)" : "#000",
                                                        textDecoration:
                                                            e.discount > 0 ? "line-through" : "none",
                                                    }}
                                                >
                                                    {"฿ " + fn.formatMoney(e.price)}
                                                </div>
                                                {e.discount > 0 ? (
                                                    <div style={{ color: "red", paddingLeft: "10px" }}>
                                                        {"฿ " + fn.formatMoney(e.priceDiscount)}
                                                    </div>
                                                ) : null}
                                            </div>
                                        </div>
                                        <div style={{ height: "15%" }}>
                                            <div style={{ width: "80%", fontSize: "11px" }}>{"จำนวน : " + e.quantity}</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="liff-inline" />
                            </div>
                        );
                    })}
                </div>
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

                    >
                        <div className="flex">
                            <div style={{ color: usecoupon != null ? "red" : "var(--mq-txt-color, rgb(192, 192, 192))" }}
                                onClick={() => {
                                    if (CartItem.length > 0) {
                                        history.push(path.usecoupon.replace(":id", id))
                                    }
                                }}
                            >
                                {usecoupon != null ? ("-฿ " + fn.formatMoney(usecoupon.discount)) : "ใช้ส่วนลด >"}
                            </div>
                            <div className="px-2">
                                {usecoupon != null ? <i className="fas fa-times-circle" style={{ color: "red" }} onClick={Cancelcoupon}></i> : null}
                            </div>
                        </div>

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

                            {optionaddress.length > 0 ?
                                <Select
                                    className="text-gray-mbk mt-1 text-sm w-full border-none select-address "
                                    styles={{ height: "100px" }}
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
                                :
                                <div className="animated-img" style={{
                                    height: "100px",
                                    borderRadius: "20px"
                                }}></div>

                            }

                        </div>
                        <div className="flex" onClick={() => {
                            history.push(path.addAddress)
                        }}>
                            <i className="fas fa-plus-circle flex " style={{ alignItems: "center" }}></i>
                            <div className="px-2">เพิ่มที่อยู่</div>
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
                            <div className="w-full font-bold">ช่องทางการขนส่ง</div>
                        </div>
                    </div>
                    <div className="px-5 py-5" style={{
                        width: "90%", margin: "auto",
                        border: "1px solid var(--mq-txt-color, rgb(170, 170, 170))",
                        borderRadius: "10px"
                    }}>
                        <div className="mb-2">

                            {optionLogistic.length > 0 ?
                                <Select
                                    className="text-gray-mbk mt-1 text-sm w-full border-none select-Logistic "
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
                                : <div className="animated-img" style={{
                                    height: "90px",
                                    borderRadius: "20px"
                                }}></div>}

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
                        <Radio.Group
                            className="w-full radio-lbl-full"

                            onChange={(e) => {
                                if (e.target.value == 2) {
                                    if (sumprice >= 500) {
                                        setRadio(e.target.value)
                                    } else {
                                        addToast("ยอดรวมสิ้นค้าต้องมากกว่า 500 บาท",
                                            {
                                                appearance: "warning",
                                                autoDismiss: true,
                                            }
                                        );
                                    }
                                } else {
                                    setRadio(e.target.value)
                                }
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
                                                className="text-gray-mbk mt-1 text-sm w-full border-none select-address "
                                                isSearchable={false}
                                                value={optionPayment.filter(o => o.value === paymentID)}
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
                                            (sumprice < usecoupon.discount ? 0 :
                                                sumprice - usecoupon.discount) + (
                                                //ไม่โปร
                                                tbPromotionDelivery == null ? deliveryCost :
                                                    //มีโปร
                                                    ((sumprice - usecoupon.discount)) > tbPromotionDelivery.buy ?
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
                            className="flex bg-green-mbk text-white text-center text-base  font-bold "
                            style={{
                                margin: "auto",
                                height: "40px",
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
                            className="flex bg-gold-mbk text-white text-center text-base  font-bold "
                            style={{
                                margin: "auto",
                                height: "40px",
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


export default MakeOrder;
