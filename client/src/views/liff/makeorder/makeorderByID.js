import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import Spinner from "components/Loadings/spinner/Spinner";
import { useToasts } from "react-toast-notifications";
import axios from "services/axios";
import { path } from "services/liff.services";
import * as Storage from "@services/Storage.service";
import * as fn from "@services/default.service";
import {
  doSaveUpdateOrder,
  getOrderHDById,
  getPromotionstores, cancelOrder
} from "@services/liff.services";
import moment from "moment";
import AddressModel from "./addressModel";
import LogisticModel from "./logisticModel";
import DetailModel from "./detailModel";
import PaymentModel from "./paymentModel";
import FooterButton from "./footerButton";
import CouponModel from "./couponModel";
import CancelModel from "./ordeDone/cancelModel";
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
  const [promotionstores, setpromotionstores] = useState([]);
  const [paymentID, setpaymentID] = useState(null);
  const [RadioPayment, setRadio] = useState(1);
  const [usecoupon, setusecoupon] = useState(null);
  const [openCoupon, setopenCoupon] = useState(false); //เปิดCoupon
  const [sumprice, setsumprice] = useState(0);
  const [OrderHD, setOrderHD] = useState(null);
  const [freebies, setfreebies] = useState([]); //ของแถม
  const [amount, setamount] = useState(0);

  const [remark, setremark] = useState("");
  const [isOpenmodel, setisOpenmodel] = useState(false);
  const [Cancelvalue, setCancelvalue] = useState(
    "ต้องการเปลี่ยนแปลงที่อยู่ในการจัดส่งสินค้า"
  );
  const getProducts = async () => {
    let idlist = [];
    if (!fn.IsNullOrEmpty(id)) {
      getOrderHDById(
        { Id: id, type: "update" },
        async (res) => {
          if (res.status) {
            let OrderHD = res.data.OrderHD;
            if (OrderHD.tbCancelOrder == null) {
              setOrderHD(OrderHD);
              setpaymentID(OrderHD.paymentId);
              setisLogistic(OrderHD.logisticId);
              setdeliveryCost(OrderHD.olddeliveryCost);
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
                    let price = 0;
                    let amount = 0;
                    tbStock.map((e, i) => {
                      let item = shop_orders.find((o) => o.id == e.id);
                      if (!item.isFree) {
                        let quantity = item.amount;
                        amount += quantity
                        e.quantity = quantity;
                        if (e.priceDiscount > 0) {
                          price += parseFloat(e.priceDiscount) * parseInt(quantity);
                        } else {
                          price += parseFloat(e.price) * parseInt(quantity);
                        }
                      }
                    });

                    price = price;
                    setsumprice(price < 1 ? 0 : price);
                    setamount(amount)
                  }
                })
                .finally(() => {
                  setIsLoading(false);
                });
            } else {
              history.push(path.orderpaymentdone.replace(":id", OrderHD.id));
            }
          } else {
            history.push(path.shopList);
          }
        },
        () => { },
        () => {
          setIsLoading(false);
        }
      );
    }
  };
  const setDeliveryCost = (e) => {
    setdeliveryCost(e);
  };
  const Cancelcoupon = () => {
    setusecoupon(null);
    addToast("ยกเลิกคูปองเสร็จสิ้น", {
      appearance: "success",
      autoDismiss: true,
    });
  };
  //สั่งสินค้า
  const sendOrder = () => {
    let updatrOrder = {
      id: id,
      // "Money Transfer" : "Credit" 1,2
      paymentType: RadioPayment === 1 ? 1 : 2,
      logisticId: isLogistic,
      isAddress: isAddress,
      usecouponid: usecoupon == null ? null : usecoupon.id,
      orderdt: OrderHD.dt.filter(e => {
        if (e.isFree == false) {
          return e
        }
      }),
    };
    if (RadioPayment === 1) {
      updatrOrder.paymentId = paymentID
    }

    doSaveUpdateOrder({ data: updatrOrder }, (res) => {
      if (res.status) {
        if (RadioPayment === 1) {
          history.push(path.paymentInfo.replace(":id", id));
        } else {

          window.location.href = res.data.url.webPaymentUrl
        }
      } else {
      }
    });
  };
  //โปรร้าน
  const GetPromotionstores = (getProducts) => {
    getPromotionstores((res) => {
      if (res.data.status) {
        let Promotionstores = res.data.promotionStore;
        setpromotionstores(Promotionstores);
      }
      getProducts();
    });
  };
  const calctotel = () => {
    // มีโปรร้าน
    let total = sumprice;

    let _prodiscstro = calcprodiscount(sumprice);
    let _prodiscount = 0;
    if (_prodiscstro.type === "discount") {
      _prodiscount = _prodiscstro.data;
    }

    if (usecoupon != null) {
      total = (usecoupon.discountType === "1") ? total - usecoupon.discount : total - (usecoupon.discount / 100) * total;
    }

    total = total - _prodiscount;
    //มีโปรส่ง
    let _deliveryCost = deliveryCost;
    if (tbPromotionDelivery != null) {
      if (total >= tbPromotionDelivery.buy && deliveryCost > 0) {
        _deliveryCost = tbPromotionDelivery.deliveryCost;
      }
    }
    total = total + _deliveryCost;

    return total;
  };
  const calcprodiscount = (totel) => {
    let _prodiscount = 0;
    let valueType = '';
    let data = { data: 0 };
    if (promotionstores.length > 0 && totel > 0) {
      let prodiscountList = promotionstores.find(
        (e) =>
          (e.condition == 1 || e.condition == 2) &&
          e.buy <= totel
      );
      if (prodiscountList != null) {
        valueType = 'coupon';
        let pro = promotionstores.filter((e) => {
          if (
            (e.condition == 1 || e.condition == 2) &&
            e.buy <= totel
          ) {
            return e;
          }
        });

        pro.map((e, i) => {
          let discount = 0;
          if (e.condition == 1) {
            discount = e.discount;
          } else {
            discount = (e.percentDiscount / 100) * totel;
            if (discount > e.percentDiscountAmount) {
              discount = e.percentDiscountAmount;
            }
          }
          if (discount > _prodiscount) {
            _prodiscount = discount;
          }
        });
        data = { type: "discount", data: _prodiscount };
      } else {
        //สินค้า
        valueType = 'product';
        let productList = promotionstores.find((e) => e.condition == 3 && e.buy <= totel);
        if (productList != null) {
          data = { type: "product", data: productList.stockId };
          // if (freebies.length < 1) {
          //   getfreebies(productList);
          // }
        }
      }
    }
    if (valueType === "product") {
      return 0
    } else return data.data
  };

  // const getfreebies = async (productList) => {
  //   await axios
  //     .post("stock/getStock", { id: [productList.stockId] })
  //     .then((response) => {
  //       if (response.data.status) {
  //         let tbStock = response.data.tbStock;
  //         tbStock[0].campaignName = productList.campaignName;
  //         setfreebies(tbStock);
  //       } else {
  //         setfreebies([]);
  //       }
  //     })
  //     .finally(() => {
  //       setIsLoading(false);
  //     });
  // };
  const calcdeliveryCost = () => {
    // มีโปรร้าน
    let total = sumprice;
    let _prodiscstro = calcprodiscount(sumprice);
    let _prodiscount = 0;
    if (_prodiscstro.type == "discount") {
      _prodiscount = _prodiscstro.data;
    }
    total = total - _prodiscount;

    let _promotionDelivery = 0;
    if (tbPromotionDelivery != null && deliveryCost > 0) {
      if (total >= tbPromotionDelivery.buy) {
        _promotionDelivery = tbPromotionDelivery.deliveryCost;
      }
    }
    return _promotionDelivery;
  };
  const calcusecoupon = () => {
    if (usecoupon.discountType === "1") {
      return usecoupon.discount
    } else {
      let total = sumprice;
      let _prodiscstro = calcprodiscount(sumprice);
      let _prodiscount = 0;
      if (_prodiscstro.type == "discount") {
        _prodiscount = _prodiscstro.data;
      }
      total = total - _prodiscount;

      return (usecoupon.discount / 100) * total
    }
  }
  useEffect(() => {
    GetPromotionstores(getProducts);
  }, []);
  const Cancelorder = () => {
    setIsLoading(true);
    cancelOrder(
      { orderId: id, cancelDetail: Cancelvalue, description: remark },
      (res) => {
        setisOpenmodel(false);
        // getProducts();
        history.push(path.orderpaymentdone.replace(":id", id))
      },
      () => { },
      () => {
        setIsLoading(false);
      }
    );
  };
  return (
    <>
      {isLoading ? <Spinner customText={"Loading"} /> : null}
      {!openCoupon ? (
        <>
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
              <DetailModel
                data={OrderHD.dt}
                freebies={freebies}
                _static={true}
              />
            ) : null}

            <div
              className="flex relative"
              style={{
                height: "20px",
                // alignItems: "center",
                // justifyContent: "center",
                marginTop: "0.5rem",
              }}
            >
              <div className="px-2 " style={{ left: "10px", width: "50px" }}>
                <img
                  style={{ margin: "auto", width: "22px", height: "22px" }}
                  src={require("assets/img/mbk/icon_sale.png").default}
                  alt="icon_sale"
                  className="w-32 border-2 border-blueGray-50"
                ></img>
              </div>
              <div className="px-2 font-bold line-clamp-1" style={{ left: "50px", width: "calc(100% - 180px)" }}>
                {usecoupon != null ? usecoupon.couponName : "รหัสส่วนลด"}
              </div>
              <div className="flex" style={{ right: "10px", width: "130px", justifyContent: "end" }}>
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
                        if (
                          OrderHD.paymentStatus != 3 &&
                          !OrderHD.isCancel
                        ) {
                          setopenCoupon(true);
                        }
                      }}
                    >
                      {usecoupon != null
                        ? "-฿ " +
                        fn.formatMoney(
                          usecoupon.discountType === "2"
                            ? (usecoupon.discount / 100) * sumprice
                            : usecoupon.discount
                        )
                        : "ใช้ส่วนลด >"}
                    </div>
                    <div className="px-2">
                      {usecoupon != null &&
                        OrderHD.paymentStatus != 3 &&
                        !OrderHD.isCancel ? (
                        <i
                          className="fas fa-times-circle"
                          style={{ color: "red" }}
                          onClick={Cancelcoupon}
                        ></i>
                      ) : null}
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
            <div className="liff-inline" />
            <AddressModel
              isAddress={isAddress}
              onChange={(e) => {
                // addToast("เปลียนที่อยู่จัดส่ง", {
                //   appearance: "success",
                //   autoDismiss: true,
                // });
                setisAddress(e.id);
              }}
              setisAddress={setisAddress}
            />
            <LogisticModel
              isLogistic={isLogistic}
              onChange={(e) => {
                // addToast("เปลียนช่องทางการขนส่ง", {
                //   appearance: "success",
                //   autoDismiss: true,
                // });
                setisLogistic(e.id);
                setDeliveryCost(e.deliveryCost);
              }}
              settbPromotionDelivery={settbPromotionDelivery}
            />
            {OrderHD != null ? (
              <PaymentModel
                sumprice={sumprice}
                setpaymentID={setpaymentID}
                RadioPayment={RadioPayment}
                setRadio={setRadio}
                paymentID={paymentID}
                disabled={OrderHD.paymentStatus == 3 ? true : false}
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
                    <div>{"ยอดรวมสินค้า (" + amount + " ชิ้น)"} : </div>
                    {OrderHD != null ? (
                      <div className="absolute" style={{ right: "0" }}>
                        {"฿ " + fn.formatMoney(OrderHD.sumprice)}
                      </div>
                    ) : null}
                  </div>

                  <div className="flex relative mb-2">
                    <div>ส่วนลดร้านค้า : </div>
                    <div className={"absolute" + (calcprodiscount(sumprice).data > 0 ? " text-gold-mbk" : "")} style={{ right: "0" }}>
                      {(calcprodiscount(sumprice).data > 0 ? "-฿ " : "฿ ") + fn.formatMoney(calcprodiscount(sumprice))}
                    </div>
                  </div>
                  <div className="flex relative mb-2">
                    <div>ค่าจัดส่ง : </div>
                    <div className={"absolute" + (deliveryCost > 0 ? " " : "")} style={{ right: "0" }}>
                      {(deliveryCost > 0 ? "฿ " : "฿ ") + fn.formatMoney(deliveryCost)}
                    </div>
                  </div>
                  <div className="flex relative mb-2">
                    <div>ส่วนลดค่าจัดส่ง : </div>
                    <div className={"absolute" + (calcdeliveryCost(sumprice) > 0 ? " text-gold-mbk" : "")} style={{ right: "0" }}>
                      {(calcdeliveryCost(sumprice) > 0 ? "-฿ " : "฿ ") + fn.formatMoney(calcdeliveryCost(sumprice))}
                    </div>
                  </div>
                  <div className="flex relative mb-2">
                    <div>ส่วนลดคูปอง : </div>
                    {usecoupon != null ? (
                      <div
                        className="absolute text-gold-mbk"
                        style={{ right: "0" }}
                      >
                        {"-฿ " + fn.formatMoney(calcusecoupon())}
                      </div>
                    ) : (
                      <div className="absolute" style={{ right: "0" }}>
                        {"฿ " + fn.formatMoney(0)}
                      </div>
                    )}
                  </div>
                  <div className="flex relative mb-2">
                    <div>ยอดสุทธิ : </div>
                    <div
                      className="absolute text-green-mbk font-blod "
                      style={{ right: "0", fontSize: "20px" }}
                    >
                      {"฿ " + fn.formatMoney(calctotel())}
                    </div>
                  </div>
                </div>
              </div>
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
                      backgroundColor: "red",
                      border: "red",
                      color: "#FFFFFF"
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
            <FooterButton sendOrder={sendOrder} text={"ชำระเงิน"} />
          </div>
        </>
      ) : (
        <CouponModel
          setopenCoupon={setopenCoupon}
          setusecoupon={setusecoupon}
          id={id}
        />
      )}


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
export default MakeOrderById;
