import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import Spinner from "components/Loadings/spinner/Spinner";
import axios from "services/axios";
import { path } from "services/liff.services";
import * as Storage from "@services/Storage.service";
import * as fn from "@services/default.service";
import ImageUC from "components/Image/index";
import ConfirmDialog from "components/ConfirmDialog/ConfirmDialog";
// components

const ShowCart = () => {
  const history = useHistory();
  const [isLoading, setIsLoading] = useState(false);
  const [confirmDelete, setconfirmDelete] = useState(false);
  const [deleteValue, setDeleteValue] = useState(null);
  const [CartItem, setCartItem] = useState([]);
  const [usecoupon, setusecoupon] = useState(null);
  const [sumprice, setsumprice] = useState(0);
  const getProducts = async () => {

    let id = [];
    let cart = Storage.get_cart()
    if (!fn.IsNullOrEmpty(cart)) {
      let shop_orders = cart.shop_orders;
      shop_orders.filter((e) => {
        id.push(e.id);
        return e
      });
      if (id.length > 0) {
        if (!fn.IsNullOrEmpty(cart.usecoupon)) {
          setusecoupon(cart.usecoupon)
        } else {
          setusecoupon(null)
        }
        setIsLoading(true)
        await axios.post("stock/getStock", { id: id }).then((response) => {
          if (response.data.status) {
            let tbStock = response.data.tbStock;
            setCartItem(tbStock);
            let price = 0;
            tbStock.filter((e) => {
              let quantity = shop_orders.find((o) => o.id === e.id).quantity;
              e.quantity = quantity;
              if (e.priceDiscount > 0) {
                price += parseFloat(e.priceDiscount) * parseInt(quantity);
              } else {
                price += parseFloat(e.price) * parseInt(quantity);
              }
              return e
            });
            if (!fn.IsNullOrEmpty(cart.usecoupon)) {
              price = price - cart.usecoupon.discount
            }
            price = price < 1 ? 0 : price
            setsumprice(price);
          } else {
            setCartItem([]);
            // error
          }

        }).finally((e) => {
          setIsLoading(false)
        });
      }
    }
  };

  const Cancelcoupon = () => {
    let cart = Storage.get_cart()
    cart.usecoupon = null
    Storage.upd_cart(cart);
    getProducts()

  }
  //ลบ
  const deleteCart = () => {
    let cart = Storage.get_cart();
    let shop_orders = cart.shop_orders;
    shop_orders = shop_orders.filter((e) => {
      if (e.id !== deleteValue) {
        return e;
      }
    });
    cart.shop_orders = shop_orders;
    Storage.upd_cart(cart);
    getProducts();

    setconfirmDelete(false);
  };

  //upd quantity
  const spinButton = (e, id) => {
    let cart = Storage.get_cart();
    let shop_orders = cart.shop_orders;

    if (e === "plus") {
      shop_orders.filter((e) => {
        if (e.id === id) {
          e.quantity = e.quantity + 1
        }
        return e
      })

    } else {
      shop_orders.filter((e) => {
        if (e.id === id) {
          e.quantity = e.quantity - 1
        }
        return e
      })
    }
    cart.shop_orders = shop_orders;
    Storage.upd_cart(cart);
    getProducts();
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
          {"รถเข็น"}
        </div>
      </div>

      <div className="flex px-5 mt-5" style={{ color: "var(--mq-txt-color, rgb(255, 168, 52))" }}>
        <i className="fas fa-exclamation-circle" style={{ width: "22px", height: "22px" }}></i>
        <div className=" px-2 text-xs ">
          <p style={{ marginBottom: "0" }}>หลังจากกดสั่งสินค้าหากไม่ได้ชำระเงินภายใน 48 ชั่วโมง</p>
          <p>สินค้าจะถูกยกเลิกทันที</p>
        </div>
      </div>
      {CartItem.length > 0 ?
        <div
          className="mt-2 line-scroll"
          style={{
            height: "calc(100% - 420px)",
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
                      <div className="font-bold line-clamp-2" style={{ width: "80%", fontSize: "11px" }}>{e.productName}</div>
                      <div
                        className="relative"
                        style={{ width: "20%" }}
                        onClick={() => {
                          setconfirmDelete(true);
                          setDeleteValue(e.id);
                        }}
                      >
                        <i
                          className="absolute fas fa-trash opacity-50"
                          style={{
                            right: "10px",
                            fontSize: "22px",
                            color: "var(--mq-txt-color, rgb(170, 170, 170))",
                          }}
                        ></i>
                      </div>

                    </div>


                    <div
                      className="w-full flex absolute"
                      style={{
                        height: "35px",
                        alignItems: "center",
                        bottom: "0"
                      }}
                    >

                      <div style={{ width: "calc(100% - 100px)", height: "15px" }}>
                        <div className="flex " style={{ fontSize: "11px" }} >
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


                      <div
                        className="flex"
                        style={{
                          color: "var(--mq-txt-color, rgb(170, 170, 170))",
                          alignItems: "center",
                          right: "0px",
                        }}
                      >
                        <button
                          name="minus"
                          className="bt-quantity broder-minus"
                          style={{
                            color: "#000"
                          }}
                          onClick={() => {
                            if (e.quantity !== 1) {
                              spinButton("minus", e.id)
                            } else {
                              setconfirmDelete(true);
                              setDeleteValue(e.id);
                            }
                          }}
                        >
                          <i className="flex fas fa-minus" style={{ justifyContent: "center" }}></i>
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

                          }}
                        />
                        <button
                          name="plus"
                          disabled={e.quantity >= CartItem.find(f => f.id === e.id).productCount ? true : false}
                          className="bt-quantity broder-plus"
                          style={{
                            color: e.quantity >= CartItem.find(f => f.id === e.id).productCount ? "var(--mq-txt-color, rgb(170, 170, 170))" : "#000",
                          }}
                          onClick={() => {
                            let Item = CartItem.find(f => f.id === e.id)
                            if (e.quantity < Item.productCount) {
                              spinButton("plus", e.id)
                            }
                          }}
                        >
                          <i className="flex fas fa-plus" style={{ justifyContent: "center" }}></i>
                        </button>
                      </div>


                    </div>
                  </div>
                </div>
                <div className="liff-inline" />
              </div>
            );
          })}
        </div> :
        <div className="flex mb-2" style={{
          height: "50px",
          justifyContent: "center",
          alignItems: "center",
          color: "#ddd"

        }}>
          <div>
            <i className="flex fas fa-box-open mb-2" style={{
              alignItems: "center", justifyContent: "center",
              fontSize: "28px"
            }}></i>
            <div> ยังไม่มีรายการสินค้า </div>
          </div>
        </div>
      }


      <div
        className="flex relative"
        style={{
          height: "40px",
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
        <div className="px-2 absolute text-bold" style={{ left: "50px" }}>
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
                  history.push(path.usecoupon.replace(":id", "cart"))
                }
              }}>
              {usecoupon != null ? ("-฿ " + fn.formatMoney(usecoupon.discount)) : "ใช้ส่วนลด >"}
            </div>
            <div className="px-2">
              {usecoupon != null ? <i className="fas fa-times-circle" style={{ color: "red" }} onClick={Cancelcoupon}></i> : null}
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
          style={{ width: "60%", left: "0px", color: "var(--mq-txt-color, rgb(170, 170, 170))" }}
        >
          <div className="text-lg ">รวมทั้งหมด</div>
          <div className="text-xl mt-2 text-green-mbk">{"฿" + fn.formatMoney(sumprice)}</div>
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
                fontSize: "16px"
              }}
              onClick={() => {
                if (CartItem.length > 0) {
                  history.push(path.makeorder.replace(":id", "cart"))
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
            {"กลับไปที่ร้านค้า"}
          </div>
        </div>
      </div>
      {
        confirmDelete && (
          <ConfirmDialog
            className={" liff-Dialog "}
            showModal={confirmDelete}
            message={"สินค้า"}
            hideModal={() => {
              setconfirmDelete(false);
            }}
            confirmModal={() => {
              deleteCart(deleteValue);
            }}
          />
        )
      }
    </>
  );
};
export default ShowCart;
