import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import Spinner from "components/Loadings/spinner/Spinner";
import axios from "services/axios";
import { path } from "services/liff.services";
import * as Storage from "@services/Storage.service";
import * as Session from "@services/Session.service";
import * as fn from "@services/default.service";
import {
    gettbPayment,
    doSaveOrder,
    get_shopcart,
    getPromotionstores
} from "@services/liff.services";
import AddressModel from "./addressModel"
import LogisticModel from "./logisticModel"
import DetailModel from "./detailModel"
import PaymentModel from "./paymentModel"

// components

const MakeOrder = () => {
    const history = useHistory();
    const [isLoading, setIsLoading] = useState(false);
    const [isAddress, setisAddress] = useState(null);
    const [isLogistic, setisLogistic] = useState(null);
    const [deliveryCost, setdeliveryCost] = useState(0);
    const [tbPromotionDelivery, settbPromotionDelivery] = useState(null);
    const [promotionstores, setpromotionstores] = useState([])
    const [paymentID, setpaymentID] = useState(null);
    const [RadioPayment, setRadio] = useState(1);
    const [CartItem, setCartItem] = useState([]);
    const [usecoupon, setusecoupon] = useState(null);
    const [pageID, setpageID] = useState("");
    const [sumprice, setsumprice] = useState(0);
    let { id } = useParams();
    const getProducts = async () => {
        let idlist = [];
        let item = {};
        console.log(id)
        setpageID(id)
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
                setIsLoading(true)
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

                        price = price
                        setsumprice(price < 1 ? 0 : price);
                    } else {
                        setCartItem([]);

                    }
                }).finally(() => {
                    setIsLoading(false)
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
                        usecouponid: usecoupon == null ? null : usecoupon.id
                    },
                    orderdt: dt
                }
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
            console.log("_id " + pageID)
            if (pageID == "cart") {
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
    //โปรร้าน
    const GetPromotionstores = () => {
        getPromotionstores(
            (res) => {
                if (res.data.status) {
                    let Promotionstores = res.data.promotionstores
                    setpromotionstores(Promotionstores)
                }
            },
        );
    }

    const calctotel = () => {
        return usecoupon == null ?
            //ไม่มีสวนลด
            sumprice + (
                //ไม่โปร
                tbPromotionDelivery == null ? deliveryCost :
                    //มีโปร
                    (sumprice + deliveryCost) > tbPromotionDelivery.buy && deliveryCost > 0 ?
                        tbPromotionDelivery.deliveryCost
                        : deliveryCost
            ) :
            //มีส่วนลด   
            (sumprice < usecoupon.discount ? 0 :
                sumprice - usecoupon.discount) + (
                //ไม่โปร
                tbPromotionDelivery == null ? deliveryCost :
                    //มีโปร
                    ((sumprice - usecoupon.discount)) > tbPromotionDelivery.buy && deliveryCost > 0 ?
                        tbPromotionDelivery.deliveryCost
                        : deliveryCost
            )
    }
    const calcdeliveryCost = () => {
        return usecoupon == null ?
            //ไม่มีสวนลด
            (
                //ไม่โปร
                tbPromotionDelivery == null ? deliveryCost :
                    //มีโปร
                    (sumprice + deliveryCost) > tbPromotionDelivery.buy && deliveryCost > 0 ?
                        tbPromotionDelivery.deliveryCost
                        : deliveryCost
            ) :
            //มีส่วนลด   
            (
                //ไม่โปร
                tbPromotionDelivery == null ? deliveryCost :
                    //มีโปร
                    ((sumprice - usecoupon.discount)) > tbPromotionDelivery.buy && deliveryCost > 0 ?
                        tbPromotionDelivery.deliveryCost
                        : deliveryCost
            )
    }
    useEffect(() => {
        getProducts();
        GetPromotionstores()
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
                <DetailModel data={CartItem} />
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

                <AddressModel isAddress={isAddress} onChange={(e) => {
                    setisAddress(e.id)
                }} setisAddress={setisAddress} />

                <LogisticModel isLogistic={isLogistic} onChange={(e) => {
                    setisLogistic(e.id)
                    setDeliveryCost(e.deliveryCost)
                }}
                    setisLogistic={setisLogistic} setdeliveryCost={setdeliveryCost}
                    settbPromotionDelivery={settbPromotionDelivery} />
                <PaymentModel sumprice={sumprice} setpaymentID={setpaymentID}
                    RadioPayment={RadioPayment} setRadio={setRadio} paymentID={paymentID}
                    disabled={false} />

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
                                    {"฿ " + fn.formatMoney(calcdeliveryCost())}
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
                                    {"฿ " + fn.formatMoney(calctotel())}

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
