import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import { useToasts } from "react-toast-notifications";
import { path } from "services/liff.services";
import axios from "services/axios";
import { IsNullOrEmpty } from "services/default.service";
import * as Storage from "@services/Storage.service";
import * as Session from "@services/Session.service";
import * as fn from "@services/default.service";
import FilesService from "../../../services/files";
import SlideShow from "./SlideShow";
import Spinner from "components/Loadings/spinner/Spinner";
import {
  upd_shopcart,
  get_shopcart
} from "@services/liff.services";
// components

const ShowProducts = () => {
  const history = useHistory();
  const { id } = useParams();
  const { addToast } = useToasts();
  const [isLoading, setIsLoading] = useState(false);
  const [Img, setImg] = useState([]);
  const [cartNumberBadge, setcartNumberBadge] = useState(null);
  const [spin, setspin] = useState(1);
  const [tbStock, settbStock] = useState(null);

  const [productCount, setproductCount] = useState(0);

  const spinButton = (e) => {
    if (e === "plus") {
      setspin(spin + 1);
    } else {
      if (spin != 0) {
        setspin(spin - 1);
      }
    }
  };

  const add_to_cart = () => {
    if (spin > 0) {
      console.log(id)
      upd_shopcart({ id: id, quantity: spin, type: "add", uid: Session.getLiff().uid }, (res) => {
        if (res.data.status) {
          if (res.data.shop_orders) {
            console.log(res.data.shop_orders)
            setcartNumberBadge(res.data.shop_orders.length)
            addToast("คุณได้เพิ่มสินค้าลงในรถเข็นเรียบร้อยแล้ว", {
              appearance: "success",
              autoDismiss: true,
            });
          } else {

          }
        } else {
          addToast(res.data.msg,
            {
              appearance: "warning",
              autoDismiss: true,
            }
          );
        }
      })
    }



  };
  const Get_shopcart = () => {
    get_shopcart({ uid: Session.getLiff().uid }, (res) => {
      if (res.data.status) {
        if (res.data.shop_orders) {
          setcartNumberBadge(res.data.shop_orders.length)
        }
      }
    })
  }
  const btbuy = () => {
    Storage.setbyorder({ id: id, quantity: spin })
    history.push(path.makeorder.replace(":id", "byorder"))
  };
  const fetchDatatbStock = async () => {
    setIsLoading(true)
    await axios.post("stock/getStock", { id: [id] }).then((response) => {
      if (response.data.status) {
        let tbStock = response.data.tbStock;
        setproductCount(tbStock[0].productCount)
        if (tbStock[0].productCount < 1) {
          setspin(0)
        }
        settbStock(tbStock[0]);
      }
    }).finally(e => {
      setIsLoading(false)
    });
  };

  const fetchImg = async () => {
    await axios
      .post("stock/getImg", {
        id: id,
        relatedTable: ["stock1", "stock2", "stock3", "stock4", "stock5"],
      })
      .then((response) => {
        if (response.data.status) {
          let data = response.data.data;
          if (data.length > 0) {
            // setImglength(data.length)
            tobase64(data)
          } else {
            tobase64(require("assets/img/mbk/no-image.png").default);
          }
        } else {
          tobase64(require("assets/img/mbk/no-image.png").default);
        }
      });
  };
  const tobase64 = async (data) => {
    let _Img = [];
    for (var i = 0; i < data.length; i++) {
      const base64 = await FilesService.buffer64UTF8(data[i].image.data);
      _Img.push({ url: base64 });
    }
    setImg(_Img);
  };

  useEffect(() => {
    fetchDatatbStock();
    fetchImg();
    Get_shopcart();// ดึงจำนวนในตระกร้า
  }, []);

  return (

    <>
      {isLoading ? <Spinner customText={"Loading"} /> : null}
      {tbStock != null ? (
        <>
          <div className="bg-green-mbk">
            <div
              style={{ height: "40px" }}
              className=" noselect text-lg text-white font-bold text-center "
            >
              {"ร้านค้าออนไลน์"}
            </div>
          </div>

          <div className="line-scroll" style={{ height: "calc(100% - 245px)" }}>
            <div className="flex relative mt-2 " style={{ height: "35px", alignItems: "center" }}>
              <div className="px-2 absolute flex"
                style={{
                  right: "0",
                  alignItems: "center",
                }}
                onClick={() => {
                  Storage.removeconpon_cart()
                  history.push(path.showCart);
                }}
              >
                <i className="fas fa-shopping-cart relative icon-cart" style={{ color: "#ddd" }}></i>
                {!IsNullOrEmpty(cartNumberBadge) && cartNumberBadge > 0 ? (
                  <div className="cart-number-badge" style={{ fontSize: "11px" }}>
                    {cartNumberBadge}
                  </div>
                ) : null}
              </div>
            </div>
            {/* products */}
            <div className="mt-2" style={{ width: "95%", margin: "auto", height: "200px", }}>
              <div style={{
                maxWidth: "200px",
                height: "200px",
                margin: "auto"
              }}>
                {Img.length > 0 ?
                  <SlideShow img={Img} duration={60000} />
                  : null}

              </div>

            </div>

            <div className="text-base" style={{ width: "95%", margin: "auto" }}>
              <div className="font-bold mt-2 " >
                {tbStock.productName}
              </div>

              <div className="font-bold mt-2 " >
                ราคาสินค้า
              </div>
              <div className="flex mt-2 relative"
                style={{
                  color: tbStock.discount > 0 ? "rgba(0,0,0,.54)" : "#000",
                }}
              >
                <div
                  style={{
                    color: tbStock.discount > 0 ? "#ddd" : "#047738",
                    textDecoration:
                      tbStock.discount > 0 ? "line-through" : "none",
                  }}
                >
                  {"฿ " + fn.formatMoney(tbStock.price)}
                </div>
                {tbStock.discount > 0 ? (
                  <div style={{ color: "red", paddingLeft: "10px" }}>
                    {"฿ " + fn.formatMoney(tbStock.priceDiscount)}
                  </div>
                ) : null}
                {tbStock.discount > 0 ? (
                  <div className="absolute text-white text-xs"
                    style={{
                      borderRadius: "5px",
                      padding: "0 10px",
                      right: "10px",
                      background: "red",
                    }}
                  >
                    {"SALE -" + fn.formatMoney(tbStock.percent) + "%"}
                  </div>
                ) : null}
              </div>
            </div>

            <div className="liff-inline" />
            <div style={{ width: "95%", margin: "auto" }}>
              <div className="mt-2 font-bold text-base"> รายละเอียดสินค้า </div>
              <div className="mt-2 ">&emsp;&emsp;{tbStock.description} </div>
            </div>
          </div>

          <div className="absolute w-full" style={{ bottom: "0" }}>
            <div className="liff-inline" />
            <div style={{ width: "95%", margin: "auto" }}>
              <div className="mt-2">
                <div
                  className="flex "
                  style={{ color: "gray", alignItems: "center" }}
                >
                  <div className=" text-xs px-2" style={{ color: "#ddd" }}>จำนวน</div>
                  <button
                    name="minus"
                    disabled={spin === 1 ? true : false}
                    className="bt-quantity broder-minus"
                    style={{
                      color: spin <= 1 ? "#ddd" : "#000",
                    }}
                    onClick={() => {
                      if (spin !== 1) {
                        spinButton("minus");
                      }
                    }}
                  >
                    <i className=" flex fas fa-minus" style={{ justifyContent: "center" }}></i>
                  </button>
                  <input
                    className="input-products-quantity"
                    type="tel"
                    value={spin}
                    onChange={(e) => {
                      let value = e.target.value;
                      if (!fn.IsNullOrEmpty(value)) {
                        value = parseInt(e.target.value);
                      }
                      setspin(value);
                    }}
                    onBlur={(e) => {
                      let value = e.target.value;
                      if (fn.IsNullOrEmpty(value)) {
                        value = 0;
                        setspin(value);
                      }
                      if (parseInt(value) > tbStock.productCount) {
                        value = tbStock.productCount;
                        setspin(value);
                      }
                    }}

                  />
                  <button
                    name="plus"
                    disabled={spin === tbStock.productCount ? true : false}
                    className="bt-quantity broder-plus"
                    style={{
                      color: spin === tbStock.productCount ? "#ddd" : "#000",
                    }}
                    onClick={() => {
                      if (spin !== tbStock.productCount) {
                        spinButton("plus");
                      }
                    }}
                  >
                    <i className="fas fa-plus"></i>
                  </button>

                  <div className=" px-2 absolute" style={{ right: "10px", color: "#ddd" }}>
                    {productCount > 0 ? "มีสินค้าทั้งหมด " + tbStock.productCount + " ชิ้น" : "สินค้าหมด"}
                  </div>
                </div>
              </div>
            </div>
            <div className="liff-inline" />
            <div className=" w-full flex" style={{ filter: productCount > 0 ? "" : "grayscale(1)" }} >
              <div style={{ width: "50%", padding: "10px" }}>
                <div
                  className="bg-green-mbk flex text-white text-center text-base font-bold bt-line"
                  onClick={() => {
                    if (productCount > 0) {
                      add_to_cart()
                    }
                  }
                  }
                >
                  {"เพิ่มไปยังรถเข็น"}
                </div>
              </div>
              <div style={{ width: "50%", padding: "10px" }}>
                <div
                  className="bg-gold-mbk flex text-white text-center text-base  font-bold bt-line"
                  onClick={
                    () => {
                      if (productCount > 0) {
                        if (sessionStorage.getItem("accessToken") == null) {
                          history.push(path.register);
                        } else {
                          btbuy()
                        }
                      }
                    }

                  }
                >
                  {"ซื้อสินค้า"}
                </div>
              </div>
            </div>
          </div>
        </>
      ) : null
      }
    </>
  );
};
export default ShowProducts;
