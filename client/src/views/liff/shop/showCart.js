import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import Spinner from "components/Loadings/spinner/Spinner";
import { useToasts } from "react-toast-notifications";
import axios from "services/axios";
import { path } from "services/liff.services";
import { IsNullOrEmpty } from "services/default.service";
import * as Storage from "@services/Storage.service";
import * as fn from "@services/default.service";
import ImageUC from "components/Image/index";
import ConfirmDialog from "components/ConfirmDialog/ConfirmDialog";
// components

const ShowCart = () => {
  const history = useHistory();
  const { addToast } = useToasts();
  const [isLoading, setIsLoading] = useState(false);
  const [confirmDelete, setconfirmDelete] = useState(false);
  const [deleteValue, setDeleteValue] = useState(null);

  const [CartItem, setCartItem] = useState([]);
  const [usecoupon, setusecoupon] = useState(null);

  const [sumprice, setsumprice] = useState(0);

  const getProducts = async () => {
    let id = [];
    let cart = Storage.get_cart()
    let shop_orders = cart.shop_orders;
    shop_orders.map((e, i) => {
      id.push(e.id);
    });
    if (!fn.IsNullOrEmpty(cart.usecoupon)) {
      setusecoupon(cart.usecoupon)
    } else {
      setusecoupon(null)
    }

    await axios.post("stock/getStock", { id: id }).then((response) => {
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
        if (!fn.IsNullOrEmpty(cart.usecoupon)) {
          price = price - cart.usecoupon.discount
        }
        price = price < 1 ? 0 : price
        setsumprice(price);
      } else {
        setCartItem([]);
        // error
      }
    });
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
      if (e.id != deleteValue) {
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
        if (e.id == id) {
          e.quantity = e.quantity + 1
        }
      })

    } else {
      shop_orders.filter((e) => {
        if (e.id == id) {
          e.quantity = e.quantity - 1
        }
      })
    }
    cart.shop_orders = shop_orders;
    Storage.upd_cart(cart);
    getProducts();
  };

  const setspin = (e, id) => {
    let cart = Storage.get_cart();
    let shop_orders = cart.shop_orders;
    shop_orders.filter((e) => {
      if (e.id == id) {
        e.quantity = e
      }
    })

    cart.shop_orders = shop_orders;
    Storage.upd_cart(cart);
    getProducts();

  }
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

      <div
        className="mt-2 line-scroll"
        style={{
          height: "calc(100% - 420px)",
          // overflow: "scroll",
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
                    className="w-32 border-2 border-blueGray-50"
                  ></ImageUC>
                </div>
                <div className="px-2" style={{ width: "70%" }}>
                  <div className="flex" style={{ height: "40px" }}>
                    <div className="font-bold" style={{ width: "80%", fontSize: "11px" }}>{e.productName}</div>
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

                  <div style={{ height: "15px" }}>
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

                  <div
                    className="flex relative"
                    style={{
                      height: "35px",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >


                    <div
                      className="flex absolute"
                      style={{
                        color: "var(--mq-txt-color, rgb(170, 170, 170))",
                        alignItems: "center",
                        right: "0px",
                      }}
                    >
                      <button
                        name="minus"
                        style={{
                          width: "30px",
                          border: "1px solid #ddd",
                          height: "30px",
                          outline: "none",
                          color: "#000",
                          borderRadius: " 5px 0 0 5px "
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
                        <i className="fas fa-minus"></i>
                      </button>
                      <input
                        style={{
                          width: "50px",
                          border: "1px solid #ddd",
                          height: "30px",
                          color: "#000",
                          fontSize: "12px"
                        }}
                        type="tel"
                        value={e.quantity}
                        onBlur={(even) => {
                          let value = even.target.value;
                          if (fn.IsNullOrEmpty(value)) {
                            value = 0;
                            // setspin(value, e.id);
                          }
                          // if (parseInt(value) > tbStock.productCount) {
                          //   value = tbStock.productCount;
                          //   setspin(value, e.id);
                          // }
                        }}
                      />
                      <button
                        name="plus"
                        disabled={e.quantity >= CartItem.find(f => f.id == e.id).productCount ? true : false}
                        style={{
                          width: "30px",
                          border: "1px solid #ddd",
                          height: "30px",
                          outline: "none",
                          color: e.quantity >= CartItem.find(f => f.id == e.id).productCount ? "var(--mq-txt-color, rgb(170, 170, 170))" : "#000",
                          borderRadius: "0 5px 5px 0"
                        }}
                        onClick={() => {
                          let Item = CartItem.find(f => f.id == e.id)
                          if (e.quantity < Item.productCount) {
                            spinButton("plus", e.id)
                          }
                        }}
                      >
                        <i className="fas fa-plus"></i>
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
          onClick={() => {
            history.push(path.usecoupon.replace(":id", "cart"))
          }}
        >
          <div className="flex">
            <div style={{ color: usecoupon != null ? "red" : "var(--mq-txt-color, rgb(192, 192, 192))" }}>
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
          <div className="text-lg">รวมทั้งหมด</div>
          <div className="text-xl mt-2">{"฿" + fn.formatMoney(sumprice)}</div>
        </div>
        <div className="px-2 " style={{ width: "40%" }}>
          <div className="w-full" style={{ padding: "10px" }}>
            <div
              className="flex bg-lemon-mbk text-white text-center text-lg  font-bold "
              style={{
                margin: "auto",
                height: "45px",
                borderRadius: "20px",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "16px"
              }}
              onClick={() => {
                history.push(path.makeorder.replace(":id", "cart"))
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
