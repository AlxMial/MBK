import React, { useState, useEffect, useRef } from "react";
import { useHistory } from "react-router-dom";
import Spinner from "components/Loadings/spinner/Spinner";
import { path } from "services/liff.services";
import SlideShow from "./SlideShow";
import axios from "services/axios";
import * as fn from "services/default.service";
import FilesService from "../../../services/files";
import Select from "react-select";
import { styleSelectLine } from "assets/styles/theme/ReactSelect";
import * as Storage from "@services/Storage.service";
import * as Session from "@services/Session.service";
import { get_shopcart } from "@services/liff.services";
import ImageUC from "components/Image/index";
const useStyle = styleSelectLine();
// components

const ShopList = () => {
  const history = useHistory();
  const [isLoading, setIsLoading] = useState(false);
  const [ImgBanner, setImgBanner] = useState([]);
  const [IsImgBanner, setIsImgBanner] = useState(true);

  const [y, setY] = useState(0);

  const [category, setcategory] = useState(0);
  const [productCategory, setproductCategory] = useState([]);

  const [cartNumberBadge, setcartNumberBadge] = useState(null);
  const [tbStock, settbStock] = useState([]); //ทั้งหมด

  const [selectMenu, setselectmenu] = useState(1); //ทั้งหมด

  const [tbStockiewNominal, settbStockiewNominal] = useState([]); //แสดงตาม category
  const [tbStockiewFlashSale, settbStockiewFlashSale] = useState([]); //แสดงตาม category

  const [isLoadingData, setisLoadingData] = useState(false); //แสดงตาม category

  const pad = (n) => {
    return (n < 10 ? "0" : "") + n;
  };

  const setselectMenu = (e) => {
    setselectmenu(e);
    setcategoryview(category, e);
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
  const setcategoryview = (id, e) => {
    setcategory(id);
    setisLoadingData(true);
    setTimeout(() => {
      if (id === 0) {
        let tbStockiewNominal = [];
        let tbStockiewFlashSale = [];
        let dataTemp = tbStock;
        if (e == 2) {
          dataTemp = dataTemp.filter((e) => {
            if (e.isBestSeller) {
              return e;
            }
          });
        }

        dataTemp.filter((e) => {
          if (!e.isFlashSale) {
            tbStockiewNominal.push(e);
          } else {
            let startDateCampaign = new Date(
              new Date(e.startDateCampaign)
                .toISOString()
                .split("T")[0]
                .replace(/-/g, "/")
            );
            let endDateCampaign = new Date(
              new Date(e.endDateCampaign)
                .toISOString()
                .split("T")[0]
                .replace(/-/g, "/")
            );
            let today = new Date(
              new Date().toISOString().split("T")[0].replace(/-/g, "/")
            );
            if (today >= startDateCampaign && today <= endDateCampaign) {
              let startTimeCampaign = new Date(
                new Date().toISOString().split("T")[0].replace(/-/g, "/") +
                  " " +
                  e.startTimeCampaign
              );
              let endTimeCampaign = new Date(
                new Date().toISOString().split("T")[0].replace(/-/g, "/") +
                  " " +
                  e.endTimeCampaign
              );
              today = new Date();
              if (today >= startTimeCampaign && today <= endTimeCampaign) {
                tbStockiewFlashSale.push(e);
              } else {
                tbStockiewNominal.push(e);
              }
            } else {
              tbStockiewNominal.push(e);
            }
          }
        });
        settbStockiewNominal(tbStockiewNominal);
        settbStockiewFlashSale(tbStockiewFlashSale);
        setisLoadingData(false);
      } else {
        let dataTemp = tbStock;
        if (e == 2) {
          dataTemp = dataTemp.filter((e) => {
            if (e.isBestSeller) {
              return e;
            }
          });
        }

        let tbStockview = dataTemp.filter((e, i) => {
          if (e.productCategoryId === id) {
            return e;
          }
        });

        let tbStockiewNominal = [];
        let tbStockiewFlashSale = [];
        tbStockview.filter((e) => {
          if (!e.isFlashSale) {
            tbStockiewNominal.push(e);
          } else {
            let startDateCampaign = new Date(
              new Date(e.startDateCampaign)
                .toISOString()
                .split("T")[0]
                .replace(/-/g, "/")
            );
            let endDateCampaign = new Date(
              new Date(e.endDateCampaign)
                .toISOString()
                .split("T")[0]
                .replace(/-/g, "/")
            );
            let today = new Date(
              new Date().toISOString().split("T")[0].replace(/-/g, "/")
            );
            if (today >= startDateCampaign && today <= endDateCampaign) {
              let startTimeCampaign = new Date(
                new Date().toISOString().split("T")[0].replace(/-/g, "/") +
                  " " +
                  e.startTimeCampaign
              );
              let endTimeCampaign = new Date(
                new Date().toISOString().split("T")[0].replace(/-/g, "/") +
                  " " +
                  e.endTimeCampaign
              );
              today = new Date();
              if (today > startTimeCampaign && today < endTimeCampaign) {
                tbStockiewFlashSale.push(e);
              } else {
                tbStockiewNominal.push(e);
              }
            } else {
              tbStockiewNominal.push(e);
            }
          }
        });
        settbStockiewNominal(tbStockiewNominal);
        settbStockiewFlashSale(tbStockiewFlashSale);
        setisLoadingData(false);
      }
    }, 100);
  };
  //#region รูป Banner
  const fetchDataImgBanner = async () => {
    await axios.get("stock/getImgBanner").then((response) => {
      if (response.data.ImgBanner.length > 0) {
        let ImgBanner = response.data.ImgBanner;
        bufferToBase64(ImgBanner);
      } else {
        setIsImgBanner(false);
      }
    });
  };
  const fetchproductCategory = async () => {
    await axios.get("productCategory/getProductCategory").then((response) => {
      if (response.status) {
        let tbProductCategory = [{ value: 0, label: "สินค้าตามหมวดหมู่" }];
        response.data.tbProductCategory.map((e, i) => {
          tbProductCategory.push({ value: e.id, label: e.name });
        });
        setproductCategory(tbProductCategory);
      }
    });
  };

  const bufferToBase64 = async (ImgBanner) => {
    let dataImg = [];
    for (var i = 0; i < ImgBanner.length; i++) {
      const base64 = await FilesService.buffer64UTF8(ImgBanner[i].image.data);
      ImgBanner[i].image = base64;
      dataImg.push({
        url: base64,
        typeLink: ImgBanner[i].typeLink,
        stockId: ImgBanner[i].stockId,
        productCategoryId: ImgBanner[i].productCategoryId,
      });
    }
    setImgBanner(dataImg);
  };
  //#endregion รูป Banner

  //#region
  const fetchDatatbStock = async () => {
    setIsLoading(true);
    await axios
      .post("stock/getStock")
      .then((response) => {
        if (response.data.status) {
          let tbStock = response.data.tbStock;
          tbStock = tbStock.filter((e) => {
            if (e.productCount > 0) {
              return e;
            }
          });
          settbStock(tbStock);
          let tbStockiewNominal = [];
          let tbStockiewFlashSale = [];
          tbStock.filter((e) => {
            if (e.isFlashSale === false) {
              tbStockiewNominal.push(e);
            } else {
              if (fn.isFlashSale(e)) {
                tbStockiewFlashSale.push(e);
              } else {
                tbStockiewNominal.push(e);
              }
            }
          });
          settbStockiewNominal(tbStockiewNominal);
          settbStockiewFlashSale(tbStockiewFlashSale);
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };
  //#endregion

  const listenScrollEvent = (e) => {
    const scrollTop = e.currentTarget.scrollTop;
    setY(scrollTop);
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
  useEffect(() => {
    fetchDataImgBanner();
    fetchDatatbStock();
    fetchproductCategory();
    Get_shopcart();
  }, []);

  let isFlashsale = false;
  tbStockiewFlashSale.map((e, i) => {
    if (e.isFlashSale) {
      isFlashsale = true;
    }
  });
  return (
    <>
      {isLoading ? <Spinner customText={"Loading"} /> : null}
      <div className="h-full">
        <div
          style={{
            height: 150 - y + "px",
            margin: "auto",
            display: y > 120 ? "none" : "",
          }}
          className={"wfull animated-SlideShow "}
        >
          {ImgBanner.length > 0 && IsImgBanner ? (
            <SlideShow
              img={ImgBanner}
              duration={5000}
              setcategoryview={setcategoryview}
              selectMenu={selectMenu}
            />
          ) : !IsImgBanner ? (
            <div
              className="flex w-full text-green-mbk font-bold"
              style={{
                height: "100%",
                backgroundColor: "#ddd",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {"ไม่มีแบนเนอร์"}
            </div>
          ) : (
            <div className="animated-img"></div>
          )}
        </div>
        <div
          className="flex relative  mt-2"
          style={{ height: "40px", alignItems: "center" }}
        >
          <div
            className="px-2"
            style={{
              textDecoration: selectMenu == 1 ? "underline" : "",
              textUnderlineOffset: "5px",
            }}
            onClick={() => {
              setselectMenu(1);
            }}
          >
            สินค้าทั้งหมด
          </div>
          <div
            className="px-2"
            style={{
              textDecoration: selectMenu == 2 ? "underline" : "",
              textUnderlineOffset: "5px",
            }}
            onClick={() => {
              setselectMenu(2);
            }}
          >
            สินค้าขายดี
          </div>
          <div className="px-2" style={{ width: "150px" }}>
            {productCategory.length > 0 ? (
              <Select
                className="text-gray-mbk  text-sm w-full border-none"
                isSearchable={false}
                // style={{ margin: "0" }}
                id={"category"}
                name={"category"}
                // placeholder={lbl}
                onChange={(e) => {
                  setcategoryview(e.value, selectMenu);
                }}
                value={productCategory.filter(
                  (option) => option.value === category
                )}
                options={productCategory}
                styles={useStyle}
              />
            ) : null}
          </div>
          <div
            className="px-2 absolute flex"
            style={{ right: "0" }}
            onClick={() => {
              Storage.removeconpon_cart();
              history.push(path.showCart);
            }}
          >
            <i
              className="fas fa-shopping-cart relative icon-cart"
              style={{ color: "#ddd" }}
            ></i>
            {!fn.IsNullOrEmpty(cartNumberBadge) ? (
              cartNumberBadge > 0 ? (
                <div className="cart-number-badge">{cartNumberBadge}</div>
              ) : null
            ) : null}
          </div>
        </div>
        <div className="liff-inline" />
        {isLoadingData ? null : (
          <div
            id="scroll"
            className="product-scroll "
            style={{
              width: "90%",
              margin: "auto",
              height: "calc(100% - " + (y > 120 ? 58 : 210 - y) + "px)",
              overflow: "scroll",
            }}
            onScroll={listenScrollEvent}
          >
            {/* flash_sale */}
            {isFlashsale ? (
              <div className="mt-2">
                <div
                  className="shadow"
                  style={{
                    border: "1px solid #FFF",
                    borderRadius: "10px",
                    width: "100%",
                  }}
                >
                  <div className="mt-2 px-2 py-2">
                    <div>
                      <img
                        src={require("assets/img/mbk/flash_sale.png").default}
                        alt="flash_sale"
                        className="border-2 border-blueGray-50 "
                        style={{ width: "100px" }}
                      ></img>
                    </div>
                    <div
                      className="flex mt-2 line-scroll "
                      style={{
                        overflowX: "auto",
                        width: "100%",
                        maxWidth: "340px",
                      }}
                    >
                      {[...tbStockiewFlashSale].map((e, i) => {
                        if (e.isFlashSale) {
                          return (
                            <div
                              key={i}
                              className="relative"
                              style={{
                                minWidth: "calc(50vw - 9px - 5%)",
                                padding: "0px 10px",
                              }}
                              onClick={() => {
                                history.push(
                                  path.showProducts.replace(":id", e.id)
                                );
                              }}
                            >
                              <div
                                className="relative"
                                style={{ height: "150px" }}
                              >
                                <div
                                  className="absolute text-white font-bold"
                                  style={{
                                    backgroundColor: "rgb(213 183 65 / 90%)",
                                    width: "100%",
                                    bottom: "0",
                                    height: "30px",
                                    borderRadius: "20px 0 20px 0",
                                    padding: "5px",
                                    textAlign: "center",
                                    zIndex: "1",
                                  }}
                                >
                                  <Counter
                                    startTimeCampaign={e.startTimeCampaign}
                                    endTimeCampaign={e.endTimeCampaign}
                                  />
                                </div>

                                <ImageUC
                                  style={{
                                    margin: "auto",
                                    minHeight: "120px",
                                    height: "100%",
                                  }}
                                  find={1}
                                  relatedid={e.id}
                                  relatedtable={["stock1"]}
                                  alt="flash_sale"
                                  className="w-32 border-2 border-blueGray-50"
                                ></ImageUC>

                                {e.isBestSeller ? (
                                  <img
                                    style={{
                                      width: "40px",
                                      height: "40px",
                                      top: "0",
                                      right: "0",
                                    }}
                                    src={
                                      require("assets/img/mbk/icon_hot.png")
                                        .default
                                    }
                                    alt="icon_hot"
                                    className="w-32 absolute"
                                  ></img>
                                ) : null}
                              </div>

                              <div className="px-2 py-2">
                                <div
                                  className="line-clamp-2"
                                  style={{
                                    fontSize: "11px",
                                    height: "35px",
                                  }}
                                >
                                  {e.productName}
                                </div>
                              </div>
                              <div
                                className="flex relative"
                                style={{
                                  bottom: "0",
                                  left: "10px",
                                  fontSize: "10px",
                                }}
                              >
                                <div
                                  style={{
                                    color: e.discount > 0 ? "#ddd" : "#000",
                                    textDecoration:
                                      e.discount > 0 ? "line-through" : "none",
                                  }}
                                >
                                  {"฿ " + fn.formatMoney(e.price)}
                                </div>
                                {e.discount > 0 ? (
                                  <div
                                    style={{
                                      color: "red",
                                      paddingLeft: "10px",
                                    }}
                                  >
                                    {"฿ " + fn.formatMoney(e.saleDiscount)}
                                  </div>
                                ) : null}
                                <div
                                  className="absolute"
                                  style={{
                                    bottom: "0",
                                    right: "10px",
                                    color: "gray",
                                  }}
                                >
                                  <i
                                    className="fas fa-shopping-cart"
                                    style={{ color: "#ddd", fontSize: "10px" }}
                                  ></i>
                                </div>
                              </div>
                            </div>
                          );
                        }
                      })}
                    </div>
                  </div>
                </div>
              </div>
            ) : null}
            <div className="mt-2 mb-2">
              <div className="line-row mb-2 ">
                {[...tbStockiewNominal].map((e, i) => {
                  return (
                    <div
                      key={i}
                      className="line-column mt-2 mb-2"
                      // style={{filter :"g" e.productCount <1}}
                      onClick={() => {
                        history.push(path.showProducts.replace(":id", e.id));
                      }}
                    >
                      <div className="line-card relative">
                        <div className="relative">
                          <ImageUC
                            style={{
                              margin: "auto",
                              minHeight: "120px",
                              maxHeight: "120px",
                            }}
                            find={1}
                            relatedid={e.id}
                            relatedtable={["stock1"]}
                            alt="flash_sale"
                            className="w-32 border-2 border-blueGray-50 animated-img"
                          ></ImageUC>

                          {e.discount > 0 ? (
                            <div
                              className="absolute"
                              style={{
                                bottom: "0",
                                left: "0px",
                                backgroundColor: "red",
                                borderRadius: "5px",
                              }}
                            >
                              <div className="text-xs text-white px-2">
                                {"SALE -" + fn.formatMoney(e.percent) + "%"}
                              </div>
                            </div>
                          ) : null}

                          {e.isBestSeller ? (
                            <img
                              style={{
                                width: "40px",
                                height: "40px",
                                top: "0",
                                right: "0",
                              }}
                              src={
                                require("assets/img/mbk/icon_hot.png").default
                              }
                              alt="icon_hot"
                              className="w-32 absolute"
                            ></img>
                          ) : null}
                        </div>
                        <div
                          className="px-1 py-2 line-scroll line-clamp-2"
                          style={{
                            height: "40px",
                            lineHeight: "15px",
                            overflow: "auto",
                            marginBottom: "10px",
                            fontSize: "11px",
                          }}
                        >
                          {e.productName}
                        </div>
                        <div
                          className="flex mb-1 "
                          style={{
                            bottom: "0",
                            left: "10px",
                            fontSize: "10px",
                          }}
                        >
                          <div
                            style={{
                              color: e.discount > 0 ? "#ddd" : "#000",
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
                        <div
                          className="absolute"
                          style={{ bottom: "0", right: "10px", color: "gray" }}
                        >
                          <i
                            className="fas fa-shopping-cart"
                            style={{ color: "#ddd", fontSize: "10px" }}
                          ></i>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
export default ShopList;
