import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import Spinner from "components/Loadings/spinner/Spinner";
import axios from "services/axios";
import { path } from "services/liff.services";
import * as Storage from "@services/Storage.service";
import * as Session from "@services/Session.service";
import * as fn from "@services/default.service";
import ImageUC from "components/Image/index";
import ConfirmDialog from "components/ConfirmDialog/ConfirmDialog";
import AlertModel from "components/ConfirmDialog/alertModel";

import { get_shopcart, upd_shopcart } from "@services/liff.services";
import EmptyOrder from "../emptyOrder";
// components

const ShowCart = () => {
  const history = useHistory();
  const [isLoading, setIsLoading] = useState(false);
  const [confirmDelete, setconfirmDelete] = useState(false);
  const [deleteValue, setDeleteValue] = useState(null);
  const [CartItem, setCartItem] = useState([]);
  const [usecoupon, setusecoupon] = useState(null);
  const [sumprice, setsumprice] = useState(0);

  const [productCountError, setproductCountError] = useState({ open: false });

  const getProducts = async () => {
    let id = [];
    setIsLoading(true);
    get_shopcart({ uid: Session.getLiff().uid }, async (res) => {
      if (res.data.status) {
        if (res.data.shop_orders.length > 0) {
          let cart = res.data.shop_orders;
          if (!fn.IsNullOrEmpty(cart)) {
            cart.filter((e) => {
              id.push(e.id);
              return e;
            });
            if (id.length > 0) {
              setusecoupon(Storage.getconpon_cart());

              await axios
                .post("stock/getStock", { id: id })
                .then((response) => {
                  let _productCountError = false;
                  let productAction = [];
                  if (response.data.status) {
                    let tbStock = response.data.tbStock;
                    setCartItem(tbStock);
                    let price = 0;
                    tbStock.filter((e) => {
                      let quantity = cart.find((o) => o.id === e.id).quantity;
                      e.quantity = quantity;
                      if (e.priceDiscount > 0) {
                        price +=
                          parseFloat(e.priceDiscount) * parseInt(quantity);
                      } else {
                        price += parseFloat(e.price) * parseInt(quantity);
                      }

                      if (e.productCount < quantity) {
                        _productCountError = true;
                        productAction.push({
                          id: e.id,
                          quantity: e.productCount,
                          type: "quantity",
                          uid: Session.getLiff().uid,
                        });
                      }

                      return e;
                    });
                    if (!fn.IsNullOrEmpty(cart.usecoupon)) {
                      price = price - cart.usecoupon.discount;
                    }
                    price = price < 1 ? 0 : price;
                    setsumprice(price);

                    if (_productCountError) {
                      setproductCountError({
                        open: _productCountError,
                        action: productAction,
                      });
                    }
                  } else {
                    setCartItem([]);
                    setsumprice(0);
                  }
                })
                .finally((e) => {
                  setIsLoading(false);
                });
            }
          }
        } else {
          setCartItem([]);
          setsumprice(0);
          setIsLoading(false);
        }
      } else {
        setCartItem([]);
        setsumprice(0);
        setIsLoading(false);
      }
    });
  };

  const Cancelcoupon = () => {
    let cart = Storage.getconpon_cart();
    cart.usecoupon = null;
    Storage.removeconpon_cart();
    Storage.upd_cart(cart);
    getProducts();

  };
  //ลบ
  const deleteCart = () => {
    upd_shopcart(
      {
        id: deleteValue,
        quantity: null,
        type: "del",
        uid: Session.getLiff().uid,
      },
      (res) => {
        if (res.data.status) {
          getProducts();
          setconfirmDelete(false);
        } else {
        }
      }
    );
  };

  //upd quantity
  const spinButton = (e, id) => {
    get_shopcart({ uid: Session.getLiff().uid }, async (res) => {
      if (res.data.status) {
        if (e === "plus") {
          upd_shopcart(
            { id: id, quantity: 1, type: "plus", uid: Session.getLiff().uid },
            (res) => {
              getProducts();
            }
          );
        } else {
          upd_shopcart(
            { id: id, quantity: 1, type: "minus", uid: Session.getLiff().uid },
            (res) => {
              getProducts();
            }
          );
        }
      }
    });
  };

  const setquantity = (e, id) => {
    let quantity = e;
    if (e == "") {
      quantity = 0;
    }
    get_shopcart({ uid: Session.getLiff().uid }, async (res) => {
      if (res.data.status) {
        upd_shopcart(
          { id: id, quantity: e, type: "quantity", uid: Session.getLiff().uid },
          (res) => {
            getProducts();
          }
        );
      }
    });
    // }
  };

  useEffect(() => {
    getProducts();
  }, []);

  // console.log('Cart Item', CartItem)
  const sumQuantity = CartItem.reduce((sum, item) => {
    return parseFloat(sum) + parseFloat(item.quantity);
  }, 0);

  return (
    <>
      {isLoading ? <Spinner customText={"Loading"} /> : null}
      <div className="bg-green-mbk">
        <div
          style={{ height: "40px" }}
          className=" noselect text-lg text-white font-bold text-center "
        >
          {"รถเข็น"}
        </div>
      </div>

      <div
        className="flex px-5 mt-5"
        style={{ color: "var(--mq-txt-color, rgb(255, 168, 52))" }}
      >
        <i
          className="fas fa-exclamation-circle"
          style={{ width: "22px", height: "22px" }}
        ></i>
        <div className=" px-2 text-xs ">
          <p style={{ marginBottom: "0" }}>
            หลังจากกดสั่งสินค้าหากไม่ได้ชำระเงินภายใน 48 ชั่วโมง
          </p>
          <p>สินค้าจะถูกยกเลิกทันที</p>
        </div>
      </div>
      {CartItem.length > 0 ? (
        <div
          className="mt-2 line-scroll"
          style={{
            height: "calc(100% - 470px)",
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
                  <div className="px-2 relative" style={{ width: "70%" }}>
                    <div className="flex" style={{ height: "35px" }}>
                      <div
                        className="font-bold line-clamp-2 text-sm"
                        style={{ width: "calc(100% - 20px)" }}
                      >
                        {e.productName}
                      </div>
                      <div
                        className="relative flex justify-center"
                        style={{ width: "20px" }}
                        onClick={() => {
                          setconfirmDelete(true);
                          setDeleteValue(e.id);
                        }}
                      >
                        <i className="absolute fas fa-trash text-liff-gray-mbk text-base"></i>
                      </div>
                    </div>

                    <div
                      className="w-full flex "
                      style={{
                        height: "35px",
                        alignItems: "center",
                        bottom: "0",
                      }}
                    >
                      <div
                        style={{
                          /*width: "calc(100% - 100px)",*/ height: "15px",
                        }}
                      >
                        <div className="flex text-xs">
                          <div
                            style={{
                              color:
                                e.discount > 0 ? "rgba(0,0,0,.54)" : "#000",
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
                    </div>
                    <div
                      className="w-full flex "
                      style={{
                        alignItems: "center",
                        bottom: "0",
                      }}
                    >
                      <div
                        className="text-liff-gray-mbk text-xs"
                        style={{ width: "calc(100% - 90px)" }}
                      >
                        {"สินค้าคงเหลือ " + e.productCount + " ชิ้น"}
                      </div>
                      <div
                        className="flex"
                        style={{
                          width: "90px",
                          alignItems: "center",
                          right: "0px",
                        }}
                      >
                        <button
                          name="minus"
                          className="bt-quantity broder-minus"
                          style={{
                            color: "#000",
                          }}
                          onClick={() => {
                            if (e.quantity !== 1) {
                              spinButton("minus", e.id);
                            } else {
                              setconfirmDelete(true);
                              setDeleteValue(e.id);
                            }
                          }}
                        >
                          <i
                            className="flex fas fa-minus"
                            style={{ justifyContent: "center" }}
                          ></i>
                        </button>
                        <input
                          className="input-products-quantity"
                          type="tel"
                          value={e.quantity}
                          onBlur={(even) => {
                            let value = even.target.value;
                            if (fn.IsNullOrEmpty(value)) {
                              value = 0;
                            }
                            if (value == 0) {
                              setconfirmDelete(true);
                              setDeleteValue(e.id);
                            }
                          }}
                          onChange={(even) => {
                            setquantity(even.target.value, e.id);
                          }}
                        />
                        <button
                          name="plus"
                          disabled={
                            e.quantity >=
                            CartItem.find((f) => f.id === e.id).productCount
                              ? true
                              : false
                          }
                          className="bt-quantity broder-plus"
                          style={{
                            color:
                              e.quantity >=
                              CartItem.find((f) => f.id === e.id).productCount
                                ? "var(--mq-txt-color, rgb(170, 170, 170))"
                                : "#000",
                          }}
                          onClick={() => {
                            let Item = CartItem.find((f) => f.id === e.id);
                            if (e.quantity < Item.productCount) {
                              spinButton("plus", e.id);
                            }
                          }}
                        >
                          <i
                            className="flex fas fa-plus"
                            style={{ justifyContent: "center" }}
                          ></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="liff-inline" />
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex justify-center items-center h-full">
          <div style={{ height: "50px" }}>
            <EmptyOrder text={"ยังไม่มีรายการสินค้า"} />
          </div>
        </div>
      )}
      <div className="liff-inline mb-2" />
      <div className="flex px-2 items-center" style={{ height: "30px" }}>
        <div className="text-xs font-bold" style={{ width: "50%" }}>
          {"ยอดรวมสินค้า (" + sumQuantity + " ชิ้น)"}
        </div>
        <div
          className="font-bold text-xs"
          style={{ width: "50%", textAlign: "end" }}
        >
          {"฿ " + fn.formatMoney(sumprice)}{" "}
        </div>
      </div>
      <div className="liff-inline mb-2" />
      <div
        className="flex relative"
        style={{
          height: "30px",
          alignItems: "center",
          justifyContent: "center",
          // marginTop: "0.5rem"
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
        <div
          className="px-2 absolute text-bold text-xs"
          style={{ left: "50px" }}
        >
          {usecoupon != null ? usecoupon.couponName : "รหัสส่วนลด"}
        </div>
        <div className="absolute" style={{ right: "10px" }}>
          <div className="flex">
            <div
              style={{
                color:
                  usecoupon != null
                    ? "red"
                    : "var(--mq-txt-color, rgb(192, 192, 192))",
              }}
              className="text-xs"
              onClick={() => {
                if (CartItem.length > 0) {
                  history.push(path.usecoupon.replace(":id", "cart"));
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
      <div></div>
      <div
        className="flex relative mt-5"
        style={{
          height: "40px",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          className="px-2 "
          style={{
            width: "60%",
            left: "0px",
            color: "var(--mq-txt-color, rgb(170, 170, 170))",
          }}
        >
          <div className="text-lg ">รวมทั้งหมด</div>
          <div className="text-xl mt-2 text-green-mbk">
            {"฿" +
              fn.formatMoney(
                usecoupon == null
                  ? sumprice
                  : usecoupon.discount > sumprice
                  ? 0
                  : sumprice -
                    (usecoupon.discountType === "2"
                      ? (usecoupon.discount / 100) * sumprice
                      : usecoupon.discount)
              )}
          </div>
        </div>
        <div className="px-2 " style={{ width: "40%" }}>
          <div className="w-full" style={{ padding: "10px" }}>
            <div
              className="flex bg-lemon-mbk text-white text-center text-base  font-bold "
              style={{
                margin: "auto",
                height: "40px",
                borderRadius: "20px",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "16px",
              }}
              onClick={() => {
                if (CartItem.length > 0) {
                  if (sessionStorage.getItem("accessToken") == null) {
                    history.push(path.register);
                  } else {
                    history.push(path.makeorder.replace(":id", "cart"));
                  }
                }
              }}
            >
              {"ชำระเงิน"}
            </div>
          </div>
        </div>
      </div>

      <div className="absolute w-full flex" style={{ bottom: "0" }}>
        <div style={{ width: "100%", padding: "10px" }}>
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
              history.push(path.shopList);
            }}
          >
            {"ไปหน้าร้านค้า"}
          </div>
        </div>
      </div>
      {confirmDelete && (
        <ConfirmDialog
          className={" liff-Dialog "}
          showModal={confirmDelete}
          message={"สินค้า"}
          hideModal={() => {
            setconfirmDelete(false);
            setquantity(1, deleteValue);
          }}
          confirmModal={() => {
            deleteCart(deleteValue);
          }}
        />
      )}

      {productCountError.open && (
        <AlertModel
          className={" liff-Dialog "}
          showModal={productCountError.open}
          message={"จำนวนสินค้ามีการเปลียนแปลง"}
          confirmModal={() => {
            productCountError.action.map((e, i) => {
              upd_shopcart(e);
            });
            setproductCountError({ open: false });
            getProducts();
          }}
        />
      )}
    </>
  );
};
export default ShowCart;
