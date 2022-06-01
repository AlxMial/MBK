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
  const [sumprice, setsumprice] = useState(0);

  const getProducts = async () => {
    let id = [];
    let shop_orders = Storage.get_cart().shop_orders;
    shop_orders.map((e, i) => {
      id.push(e.id);
    });
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

        setsumprice(price);
      } else {
        setCartItem([]);
        // error
      }
    });
  };
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
      <div
        className="mt-2 line-scroll"
        style={{
          maxHeight: "530px",
          overflow: "scroll",
          width: "95%",
          marginLeft: "auto",
          marginRight: "auto",
        }}
      >
        {[...CartItem].map((e, i) => {
          return (
            <div key={i}>
              <div className="flex mt-2" style={{ height: "130px " }}>
                <div style={{ width: "30%" }}>
                  <ImageUC
                    style={{ margin: "auto", minHeight: "120px" }}
                    find={1}
                    relatedId={e.id}
                    relatedTable={["stock1"]}
                    alt="flash_sale"
                    className="w-32 border-2 border-blueGray-50"
                  ></ImageUC>
                </div>
                <div style={{ width: "70%" }}>
                  <div className="flex" style={{ height: "70%" }}>
                    <div style={{ width: "80%" }}>{e.description}</div>
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
                          color: "gray",
                        }}
                      ></i>
                    </div>
                  </div>
                  <div
                    className="flex relative"
                    style={{
                      height: "30%",

                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {/* {e.quantity} */}
                    <div className="flex  absolute" style={{ left: "10px" }}>
                      <div
                        style={{
                          color: e.discount > 0 ? "rgba(0,0,0,.54)" : "#000",
                          textDecoration:
                            e.discount > 0 ? "line-through" : "none",
                        }}
                      >
                        {"฿" + fn.formatMoney(e.price)}
                      </div>
                      {e.discount > 0 ? (
                        <div style={{ color: "red", paddingLeft: "10px" }}>
                          {"฿" + fn.formatMoney(e.priceDiscount)}
                        </div>
                      ) : null}
                    </div>
                    <div
                      className="flex absolute"
                      style={{
                        color: "gray",
                        alignItems: "center",
                        right: "10px",
                      }}
                    >
                      {/* <div className=" px-2">จำนวน</div> */}
                      <button
                        name="minus"
                        // disabled={spin === 0 ? true : false}
                        style={{
                          width: "35px",
                          border: "1px solid #ddd",
                          height: "35px",
                          outline: "none",
                          color: e.quantity === 0 ? "gray" : "#000",
                        }}
                        onClick={() => {
                          if (e.quantity !== 0) {
                            spinButton("minus", e.id)
                          }
                        }}
                      >
                        <i className="fas fa-minus"></i>
                      </button>
                      <input
                        style={{
                          width: "50px",
                          border: "1px solid #ddd",
                          height: "35px",
                          color: "#000",
                        }}
                        type="tel"
                        value={e.quantity}
                      />
                      <button
                        name="plus"
                        style={{
                          width: "35px",
                          border: "1px solid #ddd",
                          height: "35px",
                          outline: "none",
                          color: "#000",
                        }}
                        onClick={() => {
                          spinButton("plus", e.id)
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
        }}
      >
        <div className="px-2 absolute" style={{ left: "10px" }}>
          icon{" "}
        </div>
        <div className="px-2 absolute" style={{ left: "50px" }}>
          {"รหัสส่วนลด"}
        </div>
        <div
          className="absolute"
          style={{ right: "10px", color: "gray" }}
          onClick={() => {
            history.push(path.usecoupon);
          }}
        >
          {"ใช้ส่วนลด >"}
        </div>
      </div>
      <div className="liff-inline" />
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
          style={{ width: "60%", left: "0px", color: "gray" }}
        >
          <div className="text-lg">รวมทั้งหมด</div>
          <div className="text-xl mt-2">{"฿" + fn.formatMoney(sumprice)}</div>
        </div>
        <div className="px-2 " style={{ width: "40%" }}>
          <div style={{ width: "100%", padding: "10px" }}>
            <div
              className="flex bg-lemon-mbk text-white text-center text-lg  font-bold "
              style={{
                margin: "auto",
                height: "45px",
                borderRadius: "10px",
                padding: "5px",
                alignItems: "center",
                justifyContent: "center",
              }}
            // onClick={add_to_cart}
            >
              {"ซื้อสินค้า (" + CartItem.length + ")"}
            </div>
          </div>
        </div>
      </div>
      <div className="absolute w-full flex" style={{ bottom: "40px" }}>
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
      {confirmDelete && (
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
      )}
    </>
  );
};
export default ShowCart;
