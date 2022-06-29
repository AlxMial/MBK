import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import Spinner from "components/Loadings/spinner/Spinner";
import { useToasts } from "react-toast-notifications";
import axios from "services/axios";
import { path } from "services/liff.services";
import * as Storage from "@services/Storage.service";
import * as fn from "@services/default.service";
import { doSaveUpdateOrder, getOrderHDById } from "@services/liff.services";
import AddressModel from "./addressModel";
import LogisticModel from "./logisticModel";
import DetailModel from "./detailModel";
import PaymentModel from "./paymentModel";
import FooterButton from "./footerButton";
// components

const MakeOrderById = () => {
  const { id } = useParams();
  const history = useHistory();
  const { addToast } = useToasts();
  const [isLoading, setIsLoading] = useState(false);
  const [isAddress, setisAddress] = useState(null);
  const [isLogistic, setisLogistic] = useState(null);
  const [deliveryCost, setdeliveryCost] = useState(0);
  const [tbPromotionDelivery, settbPromotionDelivery] = useState(null);
  const [paymentID, setpaymentID] = useState(null);
  const [RadioPayment, setRadio] = useState(1);
  const [OrderHD, setOrderHD] = useState(null);
  const [usecoupon, setusecoupon] = useState(null);
  const [sumprice, setsumprice] = useState(0);
  const getProducts = async () => {
    let idlist = [];
    if (!fn.IsNullOrEmpty(id)) {
      getOrderHDById(
        { Id: id, type: "update" },
        async (res) => {
          if (res.status) {
            let OrderHD = res.data.OrderHD;
            setOrderHD(OrderHD);
            setpaymentID(OrderHD.paymentId);
            setisLogistic(OrderHD.logisticId);
            setdeliveryCost(OrderHD.deliveryCost);
            settbPromotionDelivery(OrderHD.PromotionDelivery);
            setisAddress(OrderHD.otherAddressId);

            let shop_orders = OrderHD.dt;
            shop_orders.map((e, i) => {
              idlist.push(e.id);
            });

            if (Storage.getusecoupon() == null) {
              if (!fn.IsNullOrEmpty(OrderHD.coupon)) {
                setusecoupon(OrderHD.coupon);
                Storage.setusecoupon(OrderHD.coupon);
              } else {
                setusecoupon(null);
              }
            } else {
              let usecoupon = Storage.getusecoupon();
              // if (usecoupon.id === id) {
              setusecoupon(usecoupon);
              // }
            }
            setIsLoading(true);
            await axios
              .post("stock/getStock", { id: idlist })
              .then((response) => {
                if (response.data.status) {
                  let tbStock = response.data.tbStock;
                  // setCartItem(tbStock);
                  let price = 0;
                  tbStock.map((e, i) => {
                    let quantity = shop_orders.find((o) => o.id == e.id).amount;
                    e.quantity = quantity;
                    if (e.priceDiscount > 0) {
                      price += parseFloat(e.priceDiscount) * parseInt(quantity);
                    } else {
                      price += parseFloat(e.price) * parseInt(quantity);
                    }
                  });

                  price = price;
                  setsumprice(price < 1 ? 0 : price);
                }
              })
              .finally(() => {
                setIsLoading(false);
              });
          }
        },
        () => {},
        () => {
          setIsLoading(false);
        }
      );
    }
  };
  const setDeliveryCost = (e) => {
    let cost = e;
    if (tbPromotionDelivery) {
      if (sumprice + cost > tbPromotionDelivery.buy) {
        cost =
          cost > tbPromotionDelivery.deliveryCost
            ? cost - tbPromotionDelivery.deliveryCost
            : 0;
      }
    }
    setdeliveryCost(cost);
  };
  const Cancelcoupon = () => {
    // if (id == "cart") {
    //     let item = Storage.get_cart()
    //     item.usecoupon = null
    //     Storage.upd_cart(item);
    // } else {
    //     let item = Storage.getbyorder()
    //     item.usecoupon = null
    //     Storage.updbyorder(item)
    // }
    // Storage.getusecoupon(null)
    // getProducts()
  };
  //สั่งสินค้า
  const sendOrder = () => {
    let updatrOrder = {
      id: id,
      paymentId: RadioPayment === 1 ? paymentID : null,
      paymentType: RadioPayment === 1 ? "Money Transfer" : "Credit",
      logisticId: isLogistic,
      isAddress: isAddress,
    };
    console.log({ data: updatrOrder });
    doSaveUpdateOrder({ data: updatrOrder }, (res) => {
      if (res.status) {
        history.push(path.paymentInfo.replace(":id", id));
      } else {
      }
    });
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
          {"ทำการสั่งซื้อ"}
        </div>
      </div>
      <div
        className="overflow-scroll line-scroll"
        style={{ height: "calc(100% - 200px)" }}
      >
        {OrderHD != null ? (
          <DetailModel data={OrderHD.dt} _static={true} />
        ) : null}

        <div
          className="flex relative"
          style={{
            height: "20px",
            alignItems: "center",
            justifyContent: "center",
            marginTop: "0.5rem",
          }}
        >
          <div className="px-2 absolute" style={{ left: "10px" }}>
            <img
              style={{ margin: "auto", width: "22px", height: "22px" }}
              src={require("assets/img/mbk/icon_sale.png").default}
              alt="icon_sale"
              className="w-32 border-2 border-blueGray-50"
            ></img>
          </div>
          <div className="px-2 absolute font-bold" style={{ left: "50px" }}>
            {usecoupon != null ? usecoupon.couponName : "รหัสส่วนลด"}
          </div>
          <div className="absolute" style={{ right: "10px" }}>
            {" "}
            {OrderHD != null ? (
              <div className="flex">
                <div
                  style={{
                    color:
                      usecoupon != null
                        ? "red"
                        : "var(--mq-txt-color, rgb(192, 192, 192))",
                  }}
                  onClick={() => {
                    if (OrderHD.paymentStatus != "Done" && !OrderHD.isCancel) {
                      // history.push(path.usecoupon.replace(":id", id))
                    }
                  }}
                >
                  {usecoupon != null
                    ? "-฿ " + fn.formatMoney(usecoupon.discount)
                    : "ใช้ส่วนลด >"}
                </div>
                <div className="px-2">
                  {usecoupon != null &&
                  OrderHD.paymentStatus != "Done" &&
                  !OrderHD.isCancel
                    ? // <i className="fas fa-times-circle" style={{ color: "red" }}
                      //  onClick={Cancelcoupon}></i>
                      null
                    : null}
                </div>
              </div>
            ) : null}
          </div>
        </div>
        <div className="liff-inline" />
        <AddressModel
          isAddress={isAddress}
          onChange={(e) => {
            setisAddress(e.id);
          }}
          setisAddress={setisAddress}
        />
        <LogisticModel
          isLogistic={isLogistic}
          onChange={(e) => {
            setisLogistic(e.id);
            setDeliveryCost(e.deliveryCost);
          }}
          setisLogistic={setisLogistic}
          setdeliveryCost={setdeliveryCost}
          settbPromotionDelivery={settbPromotionDelivery}
        />
        {OrderHD != null ? (
          <PaymentModel
            sumprice={sumprice}
            setpaymentID={setpaymentID}
            RadioPayment={RadioPayment}
            setRadio={setRadio}
            paymentID={paymentID}
            disabled={OrderHD.paymentStatus == "Done" ? true : false}
          />
        ) : null}

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
                {OrderHD != null ? (
                  <div className="absolute" style={{ right: "0" }}>
                    {"฿ " + fn.formatMoney(OrderHD.sumprice)}
                  </div>
                ) : null}
              </div>
              <div className="flex relative mb-2">
                <div>รวมการจัดส่ง : </div>
                <div className="absolute" style={{ right: "0" }}>
                  {"฿ " + fn.formatMoney(deliveryCost)}
                </div>
              </div>
              <div className="flex relative mb-2">
                <div>ส่วนลด : </div>
                {usecoupon != null ? (
                  <div
                    className="absolute text-gold-mbk"
                    style={{ right: "0" }}
                  >
                    {"-฿ " + fn.formatMoney(usecoupon.discount)}
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
                  {"฿ " +
                    fn.formatMoney(
                      usecoupon == null
                        ? //ไม่มีสวนลด
                          sumprice +
                            //ไม่โปร
                            (tbPromotionDelivery == null
                              ? deliveryCost
                              : //มีโปร
                              sumprice + deliveryCost > tbPromotionDelivery.buy
                              ? deliveryCost > tbPromotionDelivery.deliveryCost
                                ? deliveryCost
                                : 0
                              : deliveryCost)
                        : //มีส่วนลด
                          (sumprice < usecoupon.discount
                            ? 0
                            : sumprice - usecoupon.discount) +
                            //ไม่โปร
                            (tbPromotionDelivery == null
                              ? deliveryCost
                              : //มีโปร
                              sumprice + deliveryCost > tbPromotionDelivery.buy
                              ? deliveryCost > tbPromotionDelivery.deliveryCost
                                ? deliveryCost
                                : 0
                              : deliveryCost)
                    )}
                </div>
              </div>
            </div>
          </div>
        </div>
        <FooterButton sendOrder={sendOrder} />
      </div>
    </>
  );
};
export default MakeOrderById;
