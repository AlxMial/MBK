import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import Spinner from "components/Loadings/spinner/Spinner";
import { useToasts } from "react-toast-notifications";
import axios from "services/axios";
import { path } from "services/liff.services";
import * as Storage from "@services/Storage.service";
import * as Session from "@services/Session.service";
import * as fn from "@services/default.service";
import {
  doSaveOrder,
  get_shopcart,
  getPromotionstores,
} from "@services/liff.services";
import AddressModel from "./addressModel";
import LogisticModel from "./logisticModel";
import DetailModel from "./detailModel";
import PaymentModel from "./paymentModel";
import FooterButton from "./footerButton";

import CouponModel from "./couponModel";
// components

const MakeOrder = () => {
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
  const [pageID, setpageID] = useState("");
  const [sumprice, setsumprice] = useState(0);
  const [couponUse, setCouponUse] = useState(null);

  const [CartItem, setCartItem] = useState([]); //สินค้าในตระกร้า
  const [freebies, setfreebies] = useState([]); //ของแถม

  let { id } = useParams();
  const getProducts = async () => {
    let idlist = [];
    let item = {};
    setpageID(id);
    const setData = async () => {
      if (!fn.IsNullOrEmpty(item)) {
        let shop_orders = item.shop_orders;
        shop_orders.map((e, i) => {
          idlist.push(e.id);
        });

        if (id === "cart") {
          setusecoupon(Storage.getconpon_cart());
        } else {
          let item = Storage.getbyorder();
          setusecoupon(item.usecoupon);
        }
        setIsLoading(true);
        await axios
          .post("stock/getStock", { id: idlist })
          .then((response) => {
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

              price = price;
              setsumprice(price < 1 ? 0 : price);
            } else {
              setCartItem([]);
            }
          })
          .finally(() => {
            setIsLoading(false);
          });
      }
    };
    if (id === "cart") {
      get_shopcart({ uid: Session.getLiff().uid }, async (res) => {
        if (res.data.status) {
          if (res.data.shop_orders.length > 0) {
            item.shop_orders = [];
            item.shop_orders = res.data.shop_orders;
          } else {
            history.push(path.shopList);
          }
        }
        if (fn.IsNullOrEmpty(item)) {
          history.push(path.shopList);
        } else {
          setData();
        }
      });
    } else if (id === "byorder") {
      item = Storage.getbyorder();
      if (fn.IsNullOrEmpty(item)) {
        history.push(path.shopList);
      } else {
        setData();
      }
    }
  };
  const setDeliveryCost = (e) => {
    setdeliveryCost(e);
    // setTimeout(() => {
    //   getProducts();
    // }, 1000);
  };
  const Cancelcoupon = () => {
    if (id === "cart") {
      Storage.removeconpon_cart();
    } else {
      let item = Storage.getbyorder();
      item.usecoupon = null;
      Storage.updbyorder(item);
    }
    getProducts();
  };
  //สั่งสินค้า
  const sendOrder = () => {
    if (!fn.IsNullOrEmpty(CartItem)) {
      let item = {};
      const setData = () => {
        let shop_orders = item.shop_orders;
        let dt = [];
        //สินค้าในตระกร้า
        CartItem.filter((e) => {
          dt.push({
            stockId: e.id,
            amount: e.quantity,
            price: e.price,
            discount: e.discount,
            discountType: e.discountType,
          });
        });
        let order = {
          orderhd: {
            paymentType: RadioPayment === 1 ? 1 : 2,
            logisticId: isLogistic,
            stockNumber: shop_orders.length,
            paymentStatus: 1,
            transportStatus: 1,
            isAddress: isAddress,
            usecouponid: usecoupon == null ? null : usecoupon.id,
          },
          orderdt: dt,
          cart: id == "cart" ? true : false,
        };

        if (RadioPayment === 1) {
          order.orderhd.paymentId = paymentID;
        }

        doSaveOrder(order, async (res) => {
          if (res.status) {
            // ลบข้อมูล
            if (id == "cart") {
              item = Storage.remove_cart();
            } else {
              item = Storage.remove_byorder();
            }
            if (RadioPayment === 1) {

              history.push(path.paymentInfo.replace(":id", res.data.orderId));
            } else {
              window.location.href = res.data.url.webPaymentUrl;
            }
          } else {
          }
        });
      };
      if (pageID === "cart") {
        get_shopcart({ uid: Session.getLiff().uid }, async (res) => {
          if (res.data.status) {
            if (res.data.shop_orders.length > 0) {
              item.shop_orders = [];
              item.shop_orders = res.data.shop_orders;
            }
          }
          setData();
        });
      } else {
        item = Storage.getbyorder();
        setData();
      }
    }
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
    if (_prodiscstro.type == "discount") {
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
    let typeValue = ""
    let data = { data: 0 };
    if (promotionstores.length > 0 && totel > 0) {
      let prodiscountList = promotionstores.find(
        (e) =>
          (e.condition == 1 || e.condition == 2) &&
          e.buy <= totel
      );
      if (prodiscountList != null) {
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
        typeValue = "product";
        let productList = promotionstores.find(
          (e) => e.condition == 3 && e.buy <= totel
        );
        if (productList != null) {
          data = { type: "product", data: productList.stockId };
          if (freebies.length < 1) {
            getfreebies(productList);
          }
        }
      }
    }
    try {
      if (typeValue === "product") {
        return 0;
      } else {
        return data.data
      }

    } catch {
      return 0;
    }
  };

  const getfreebies = async (productList) => {
    await axios
      .post("stock/getStock", { id: [productList.stockId] })
      .then((response) => {
        if (response.data.status) {
          let tbStock = response.data.tbStock;
          tbStock[0].campaignName = productList.campaignName;
          setfreebies(tbStock);
        } else {
          setfreebies([]);
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };
  const calcdeliveryCost = () => {
    // มีโปรร้าน
    let _promotionDelivery = 0;
    if (sumprice > 0) {
      let total = sumprice;
      let _prodiscstro = calcprodiscount(sumprice);
      let _prodiscount = 0;
      if (_prodiscstro.type == "discount") {
        _prodiscount = _prodiscstro.data;
      }
      total = total - _prodiscount;


      if (tbPromotionDelivery != null && deliveryCost > 0) {
        if (total >= tbPromotionDelivery.buy) {
          _promotionDelivery = deliveryCost - tbPromotionDelivery.deliveryCost;
        }
      }
    }
    return _promotionDelivery;
  };
  useEffect(() => {
    GetPromotionstores(getProducts);
  }, []);

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
            <DetailModel data={CartItem} freebies={freebies} />
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
                <div className="flex">
                  <div
                    style={{
                      color:
                        usecoupon != null
                          ? "red"
                          : "var(--mq-txt-color, rgb(192, 192, 192))",
                    }}
                    onClick={() => {
                      if (CartItem.length > 0) {
                        // history.push(path.usecoupon.replace(":id", id));
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
                    {usecoupon != null ? (
                      <i
                        className="fas fa-times-circle"
                        style={{ color: "red" }}
                        onClick={Cancelcoupon}
                      ></i>
                    ) : null}
                  </div>
                </div>
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
              setisLogistic={setisLogistic}
              setdeliveryCost={setdeliveryCost}
              settbPromotionDelivery={settbPromotionDelivery}
              isdefault={true}
            />
            <PaymentModel
              sumprice={sumprice}
              setpaymentID={setpaymentID}
              RadioPayment={RadioPayment}
              setRadio={setRadio}
              paymentID={paymentID}
              disabled={false}
            />

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
                    <div>ยอดรวมสินค้า : </div>
                    <div className="absolute" style={{ right: "0" }}>
                      {"฿ " + fn.formatMoney(sumprice)}
                    </div>
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
                        {"-฿ " +
                          fn.formatMoney(
                            usecoupon.discountType === "2"
                              ? (usecoupon.discount / 100) * sumprice
                              : usecoupon.discount
                          )}
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
                      {"฿ " + fn.formatMoney(calctotel())}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              className="w-full  relative mt-2"
              style={{ alignItems: "center", justifyContent: "center", height: "30px" }}
            ></div>
            <FooterButton sendOrder={sendOrder} text={"สั่งสินค้า"} />
          </div>
        </>
      ) : (
        <CouponModel
          setopenCoupon={setopenCoupon}
          setusecoupon={setusecoupon}
          id={id}
        />
      )}
    </>
  );
};
export default MakeOrder;
