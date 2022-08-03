import React, { useState, useEffect, useRef } from "react";
import { useHistory, useParams } from "react-router-dom";
import { useToasts } from "react-toast-notifications";
import { path } from "services/liff.services";
import axios from "services/axios";
import { useDispatch } from "react-redux";
import { backPage } from "redux/actions/common";
import { IsNullOrEmpty } from "services/default.service";
import * as Storage from "@services/Storage.service";
import * as Session from "@services/Session.service";
import * as fn from "@services/default.service";
import FilesService from "../../../services/files";
import SlideShow from "./SlideShow";
import Spinner from "components/Loadings/spinner/Spinner";
import { upd_shopcart, get_shopcart } from "@services/liff.services";

// components

const ShowProducts = () => {
  const dispatch = useDispatch();
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
      upd_shopcart(
        { id: id, quantity: spin, type: "add", uid: Session.getLiff().uid },
        (res) => {
          if (res.data.status) {
            if (res.data.shop_orders) {
              // console.log(res.data.shop_orders);
              setcartNumberBadge(res.data.shop_orders.length);
              addToast("คุณได้เพิ่มสินค้าลงในรถเข็นเรียบร้อยแล้ว", {
                appearance: "success",
                autoDismiss: true,
              });
            } else {
            }
          } else {
            addToast(res.data.msg, {
              appearance: "warning",
              autoDismiss: true,
            });
          }
        }
      );
    }
  };
  const Get_shopcart = () => {
    get_shopcart({ uid: Session.getLiff().uid }, (res) => {
      if (res.data.status) {
        if (res.data.shop_orders) {
          setcartNumberBadge(res.data.shop_orders.length);
        }
      }
    });
  };
  const btbuy = () => {
    Storage.setbyorder({ id: id, quantity: spin });
    history.push(path.makeorder.replace(":id", "byorder"));
  };
  const fetchDatatbStock = async () => {
    setIsLoading(true);
    await axios
      .post("stock/getStock", { id: [id] })
      .then((response) => {
        if (response.data.status) {
          let tbStock = response.data.tbStock;
          setproductCount(tbStock[0].productCount);
          if (tbStock[0].productCount < 1) {
            setspin(0);
          }
          let stock = tbStock[0];
          if (stock.isFlashSale) {
            if (fn.isFlashSale(stock)) {
              stock.priceDiscount = stock.price - stock.saleDiscount;
              stock.discount = stock.saleDiscount;
              stock.percent = stock.salePercent;
              settbStock(stock);
            } else {
              settbStock(stock);
            }
          } else {
            settbStock(stock);
          }
        }
      })
      .finally((e) => {
        setIsLoading(false);
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
            tobase64(data);
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

  const pad = (n) => {
    return (n < 10 ? "0" : "") + n;
  };
  const Counter = ({ startTimeCampaign, endTimeCampaign }) => {
    const [count, setCount] = useState("");

    useInterval(() => {
      const current_date = new Date().getTime();
      let _endTimeCampaign = new Date(
        new Date().toISOString().split("T")[0].replace(/-/g, "/") +
        " " +
        endTimeCampaign
      );

      let seconds_left =
        (new Date(_endTimeCampaign).getTime() - current_date) / 1000;
      seconds_left = seconds_left < 0 ? 0 : seconds_left;

      let hours = pad(parseInt(seconds_left / 3600));
      seconds_left = seconds_left % 3600;

      let minutes = pad(parseInt(seconds_left / 60));
      let seconds = pad(parseInt(seconds_left % 60));

      setCount(hours + ":" + minutes + ":" + seconds);
    }, 1000);

    return <span>{count}</span>;
  };
  const useInterval = (callback, delay) => {
    const savedCallback = useRef();

    // Remember the latest function.
    useEffect(() => {
      savedCallback.current = callback;
    }, [callback]);

    // Set up the interval.
    useEffect(() => {
      function tick() {
        savedCallback.current();
      }
      if (delay !== null) {
        let id = setInterval(tick, delay);
        return () => clearInterval(id);
      }
    }, [delay]);
  };
  useEffect(() => {
    dispatch(backPage(true));
    fetchDatatbStock();
    fetchImg();
    Get_shopcart(); // ดึงจำนวนในตระกร้า
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

          <div
            className="line-scroll"
            style={{ height: "calc(100% - 245px)", overflowY: "auto" }}
          >
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
                  Storage.removeconpon_cart();
                  history.push(path.showCart);
                }}
              >
                <i
                  className="fas fa-shopping-cart relative icon-cart"
                  style={{ color: "#d0b027" }}
                ></i>
                {!IsNullOrEmpty(cartNumberBadge) && cartNumberBadge > 0 ? (
                  <div
                    className="cart-number-badge"
                  // style={{ fontSize: "11px" }}
                  >
                    <div className="absolute" style={{ paddingTop: "2px" }}>{cartNumberBadge}</div>
                  </div>
                ) : null}
              </div>
            </div>
            {/* products */}
            <div
              className="mt-2"
              style={{
                width: "95%", margin: "auto"
                // , height: "200px" 
              }}
            >
              <div
                style={{
                  maxWidth: "200px",
                  // height: "200px",
                  margin: "auto",
                }}
                className="relative"
              >
                {Img.length > 0 ? (
                  <SlideShow img={Img} duration={60000} />
                ) : null}
                {tbStock.isFlashSale && fn.isFlashSale(tbStock) ? (
                  <div
                    className="absolute text-white flex items-center justify-center bg-gold-mbk"
                    style={{
                      // backgroundColor: "rgb(213 183 65 / 90%)",
                      // backgroundColor: "#d0af21",
                      width: "100%",
                      top: "-35px",
                      height: "30px",
                      borderRadius: "5px 15px",
                      // padding: "5px",
                      fontSize: "18px",
                      textAlign: "center",
                      zIndex: "1",
                      lineHeight: "17px",
                      paddingTop: "2px"
                    }}
                  >
                    <Counter
                      startTimeCampaign={tbStock.startTimeCampaign}
                      endTimeCampaign={tbStock.endTimeCampaign}
                    />
                  </div>
                ) : null}
              </div>
            </div>

            <div className="text-base" style={{ width: "95%", margin: "auto" }}>
              <div className="font-bold mt-2 ">{tbStock.productName}</div>

              <div className="font-bold mt-2 ">ราคาสินค้า</div>
              <div
                className="w-full flex mt-2 relative justify-between items-center"
                style={{
                  color: tbStock.discount > 0 ? "rgba(0,0,0,.54)" : "#000",
                }}
              >
                {tbStock.discount > 0 ? (
                  <div
                    className=" text-white text-xs flex"
                    style={{
                      borderRadius: "5px",
                      padding: "5px 10px",
                      fontSize: "10px",
                      background: "red",
                      justifyContent: "center",
                      // fontWeight: "bold",
                      lineHeight: "9px",
                      paddingTop: "6px"
                    }}
                  >
                    {"SALE -" + parseInt(fn.formatMoney(tbStock.percent)) + "%"}
                  </div>
                ) : null}
                <div
                  className="flex items-center"
                // style={{
                //   width:
                //     "calc(100% - " +
                //     (tbStock.discount > 0 ? "100px" : "0px") +
                //     ")",
                //   justifyContent: "end",
                // }}
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
                </div>
              </div>
            </div>

            <div className="liff-inline" />
            <div style={{ width: "95%", margin: "auto", overflowY: "auto" }}>
              <div className="mt-2 font-bold text-base"> รายละเอียดสินค้า </div>
              <div className="mt-2 ">&emsp;&emsp;{tbStock.description} </div>
            </div>
          </div>

          <div className="absolute w-full z-2 bg-white" style={{ bottom: "0" }}>
            <div className="liff-inline" />
            <div style={{ width: "95%", margin: "auto" }}>
              <div className="mt-2">
                <div
                  className="flex "
                  style={{ color: "gray", alignItems: "center" }}
                >
                  <div className=" text-sm mr-2" style={{ color: "#ddd" }}>
                    จำนวน
                  </div>
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
                    <i
                      className=" flex fas fa-minus"
                      style={{ justifyContent: "center" }}
                    ></i>
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

                  <div
                    className=" px-2 absolute"
                    style={{ right: "10px", color: "#ddd" }}
                  >
                    {productCount > 0
                      ? "มีสินค้าทั้งหมด " + tbStock.productCount + " ชิ้น"
                      : "สินค้าหมด"}
                  </div>
                </div>
              </div>
            </div>
            <div className="liff-inline" />
            <div
              className=" w-full flex"
              style={{ filter: productCount > 0 ? "" : "grayscale(1)" }}
            >
              <div style={{ width: "50%", padding: "10px" }}>
                <div
                  className="bg-green-mbk flex text-white text-center text-base font-bold bt-line"
                  onClick={() => {
                    if (productCount > 0) {
                      add_to_cart();
                    }
                  }}
                >
                  {"เพิ่มไปยังรถเข็น"}
                </div>
              </div>
              <div style={{ width: "50%", padding: "10px" }}>
                <div
                  className="bg-gold-mbk flex text-white text-center text-base  font-bold bt-line"
                  onClick={() => {
                    if (productCount > 0) {
                      if (sessionStorage.getItem("accessToken") == null) {
                        history.push(path.register);
                      } else {
                        btbuy();
                      }
                    }
                  }}
                >
                  {"ซื้อสินค้า"}
                </div>
              </div>
            </div>
          </div>
        </>
      ) : null}
    </>
  );
};
export default ShowProducts;
