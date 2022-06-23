import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
// import Spinner from "components/Loadings/spinner/Spinner";
import { useToasts } from "react-toast-notifications";
import { path } from "services/liff.services";
import axios from "services/axios";
import { IsNullOrEmpty } from "services/default.service";
import * as Storage from "@services/Storage.service";
import * as fn from "@services/default.service";
import FilesService from "../../../services/files";
import SlideShow from "./SlideShow";
// components

const ShowProducts = () => {
  const history = useHistory();
  const { id } = useParams();
  const { addToast } = useToasts();
  // const [isLoading, setIsLoading] = useState(false);
  const [Img, setImg] = useState([]);
  // const [ImgLoading, setImgLoading] = useState(true);
  const [cartNumberBadge, setcartNumberBadge] = useState(
    fn.getCartNumberBadge()
  );
  const [spin, setspin] = useState(1);
  const [tbStock, settbStock] = useState(null);
  const spinButton = (e) => {
    if (e === "plus") {
      setspin(spin + 1);
    } else {
      setspin(spin - 1);
    }
  };

  const NumberBadge = () => {
    setcartNumberBadge(fn.getCartNumberBadge());
  };
  const add_to_cart = () => {
    if (spin > 0) {
      let cart = Storage.get_cart();

      if (fn.IsNullOrEmpty(cart.shop_orders)) {
        Storage.set_add_to_cart({ id: id, quantity: spin });
        NumberBadge();

        addToast("คุณได้เพิ่มสินค้าลงในรถเข็นเรียบร้อยแล้ว", {
          appearance: "success",
          autoDismiss: true,
        });
      } else {
        let item;
        cart.shop_orders.map((e, i) => {
          if (e.id === id) {
            item = e;
          }
        });
        if (fn.IsNullOrEmpty(item)) {
          Storage.set_add_to_cart({ id: id, quantity: spin });
          NumberBadge();

          addToast("คุณได้เพิ่มสินค้าลงในรถเข็นเรียบร้อยแล้ว", {
            appearance: "success",
            autoDismiss: true,
          });
        } else {
          if (item.quantity + spin > tbStock.productCount) {
            addToast(
              "ไม่สามารถเพิ่มจำนวนสินค้านี้ได้ เนื่องจากคุณเพิ่มสินค้านี้ไว้ในรถเข็นแล้ว " +
              item.quantity +
              " ชิ้น",
              {
                appearance: "warning",
                autoDismiss: true,
              }
            );
          } else {
            Storage.set_add_to_cart({ id: id, quantity: spin });
            NumberBadge();

            addToast("คุณได้เพิ่มสินค้าลงในรถเข็นเรียบร้อยแล้ว", {
              appearance: "success",
              autoDismiss: true,
            });
          }
        }
      }
    }
  };

  const btbuy = () => {
    Storage.setbyorder({ id: id, quantity: spin })
    history.push(path.makeorder.replace(":id", "byorder"))
  };
  const fetchDatatbStock = async () => {
    await axios.post("stock/getStock", { id: [id] }).then((response) => {
      if (response.data.status) {
        let tbStock = response.data.tbStock;
        settbStock(tbStock[0]);
      } else {
        settbStock([]);
        // error
      }
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
  }, []);

  return (

    <>
      {/* {console.log(Imglength)} */}
      {/* {isLoading ? <Spinner customText={"Loading"} /> : null} */}
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

          <div
            className="flex relative mt-2 "
            style={{ height: "35px", alignItems: "center" }}
          >
            <div
              className="px-2 absolute flex"
              style={{
                right: "0",
                alignItems: "center",
              }}
              onClick={() => {
                history.push(path.showCart);
              }}
            >
              <i className="fas fa-shopping-cart relative icon-cart" style={{ color: "#ddd" }}></i>
              {!IsNullOrEmpty(cartNumberBadge) ? (
                <div className="cart-number-badge" style={{ fontSize: "11px" }}>
                  {cartNumberBadge}{" "}
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


          <div className="font-bold mt-2 text-base " style={{ width: "95%", margin: "auto", fontSize: "14px" }}> {tbStock.productName} </div>

          <div className="font-bold mt-3 text-xs" style={{ width: "95%", margin: "auto", fontSize: "12px" }}> ราคาสินค้า </div>
          <div
            className="flex mt-2"
            style={{
              width: "95%", margin: "auto",
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
              <div
                className="absolute text-white text-xs"
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




          <div className="liff-inline" />
          <div style={{ width: "95%", margin: "auto" }}>
            <div className="font-bold text-ิฟหำ"> รายละเอียดสินค้า </div>
            <div className="mt-2 px-4"> {tbStock.description} </div>
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
                      color: spin === 1 ? "#ddd" : "#000",
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
                      // console.log(e.target.value);
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
                    {"มีสินค้าทั้งหมด " + tbStock.productCount + " ชิ้น"}
                  </div>
                </div>
              </div>
            </div>
            <div className="liff-inline" />
            <div className=" w-full flex">
              <div style={{ width: "50%", padding: "10px" }}>
                <div
                  className="bg-green-mbk text-white text-center text-lg  font-bold "
                  style={{
                    margin: "auto",
                    height: "45px",
                    borderRadius: "10px",
                    padding: "5px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  onClick={add_to_cart}
                >
                  {"เพิ่มไปยังรถเข็น"}
                </div>
              </div>
              <div style={{ width: "50%", padding: "10px" }}>
                <div
                  className="bg-gold-mbk flex text-white text-center text-lg  font-bold "
                  style={{
                    margin: "auto",
                    height: "45px",
                    borderRadius: "10px",
                    padding: "5px",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  onClick={btbuy}
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
