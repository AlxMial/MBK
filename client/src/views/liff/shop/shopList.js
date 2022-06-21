import React, { useState, useEffect, useRef, useCallback } from "react";
import { useHistory } from "react-router-dom";
import Spinner from "components/Loadings/spinner/Spinner";
import { useToasts } from "react-toast-notifications";
import { path } from "services/liff.services";
import SlideShow from "./SlideShow";
import axios from "services/axios";
import * as fn from "services/default.service";
import FilesService from "../../../services/files";
import Select from "react-select";
import { styleSelectLine } from "assets/styles/theme/ReactSelect";

import ImageUC from "components/Image/index";
const useStyle = styleSelectLine();
// components

const ShopList = () => {
  const history = useHistory();
  const { addToast } = useToasts();
  const [isLoading, setIsLoading] = useState(false);
  const [ImgBanner, setImgBanner] = useState([]);
  const [y, setY] = useState(0);

  const [category, setcategory] = useState(0);
  const [productCategory, setproductCategory] = useState([]);

  const [cartNumberBadge, setcartNumberBadge] = useState(
    fn.getCartNumberBadge()
  );
  const [tbStock, settbStock] = useState([]);//ทั้งหมด 


  const [tbStockiewNominal, settbStockiewNominal] = useState([]);//แสดงตาม category
  const [tbStockiewFlashSale, settbStockiewFlashSale] = useState([]);//แสดงตาม category

  const pad = (n) => {
    return (n < 10 ? "0" : "") + n;
  };

  const Counter = ({ time }) => {
    const [count, setCount] = useState("");

    useInterval(() => {
      const current_date = new Date().getTime();
      let seconds_left = (new Date(time).getTime() - current_date) / 1000;

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
  const setcategoryview = (id, data) => {
    setcategory(id)
    if (id === 0) {
      let tbStockiewNominal = []
      let tbStockiewFlashSale = []
      tbStock.filter(e => {
        if (!e.isFlashSale) {
          tbStockiewNominal.push(e)
        }
        else {
          let startDateCampaign = new Date(new Date(e.startDateCampaign).toISOString().split("T")[0])
          let endDateCampaign = new Date(new Date(e.endDateCampaign).toISOString().split("T")[0])
          let today = new Date(new Date().toISOString().split("T")[0])
          if (today >= startDateCampaign && today <= endDateCampaign) {
            let startTimeCampaign = new Date(new Date().toISOString().split("T")[0] + " " + e.startTimeCampaign)
            let endTimeCampaign = new Date(new Date().toISOString().split("T")[0] + " " + e.endTimeCampaign)
            today = new Date()
            if (today > startTimeCampaign && today < endTimeCampaign) {
              tbStockiewFlashSale.push(e)
            } else {
              tbStockiewNominal.push(e)
            }
          } else {
            tbStockiewNominal.push(e)
          }
        }
      })
      settbStockiewNominal(tbStockiewNominal)
      settbStockiewFlashSale(tbStockiewFlashSale)
    } else {
      let tbStockview = tbStock.filter((e, i) => {
        if (e.productCategoryId === id) {
          return e
        }
      })

      let tbStockiewNominal = []
      let tbStockiewFlashSale = []
      tbStockview.filter(e => {
        if (!e.isFlashSale) {
          tbStockiewNominal.push(e)
        }
        else {
          let startDateCampaign = new Date(new Date(e.startDateCampaign).toISOString().split("T")[0])
          let endDateCampaign = new Date(new Date(e.endDateCampaign).toISOString().split("T")[0])
          let today = new Date(new Date().toISOString().split("T")[0])
          if (today >= startDateCampaign && today <= endDateCampaign) {
            let startTimeCampaign = new Date(new Date().toISOString().split("T")[0] + " " + e.startTimeCampaign)
            let endTimeCampaign = new Date(new Date().toISOString().split("T")[0] + " " + e.endTimeCampaign)
            today = new Date()
            if (today > startTimeCampaign && today < endTimeCampaign) {
              tbStockiewFlashSale.push(e)
            } else {
              tbStockiewNominal.push(e)
            }
          } else {
            tbStockiewNominal.push(e)
          }
        }
      })
      settbStockiewNominal(tbStockiewNominal)
      settbStockiewFlashSale(tbStockiewFlashSale)
    }

  }
  //#region รูป Banner
  const fetchDataImgBanner = async () => {
    await axios.get("stock/getImgBanner").then((response) => {
      // console.log(response);
      if (response.data.ImgBanner) {
        let ImgBanner = response.data.ImgBanner;
        bufferToBase64(ImgBanner);
      } else {
        setImgBanner([]);
      }
    });
  };
  const fetchproductCategory = async () => {
    await axios.get("productCategory/getProductCategory").then((response) => {
      // console.log(response);
      if (response.status) {
        let tbProductCategory = [{ value: 0, label: "สินค้าตามหมวดหมู" }]
        response.data.tbProductCategory.map((e, i) => {
          tbProductCategory.push({ value: e.id, label: e.categoryName })
        })
        // console.log(tbProductCategory)
        setproductCategory(tbProductCategory)
      }
    });
  };

  const bufferToBase64 = async (ImgBanner) => {
    let dataImg = [];
    for (var i = 0; i < ImgBanner.length; i++) {
      // console.log("id" + ImgBanner[i].id);
      const base64 = await FilesService.buffer64UTF8(ImgBanner[i].image.data);
      ImgBanner[i].image = base64;
      dataImg.push({ url: base64 });
    }
    setImgBanner(dataImg);

  };
  //#endregion รูป Banner

  //#region
  const fetchDatatbStock = async () => {
    await axios.post("stock/getStock").then((response) => {
      if (response.data.status) {
        let tbStock = response.data.tbStock;
        settbStock(tbStock);
        let tbStockiewNominal = []
        let tbStockiewFlashSale = []
        tbStock.filter(e => {
          if (!e.isFlashSale) {
            tbStockiewNominal.push(e)
          }
          else {
            let startDateCampaign = new Date(new Date(e.startDateCampaign).toISOString().split("T")[0])
            let endDateCampaign = new Date(new Date(e.endDateCampaign).toISOString().split("T")[0])
            let today = new Date(new Date().toISOString().split("T")[0])
            if (today >= startDateCampaign && today <= endDateCampaign) {
              let startTimeCampaign = new Date(new Date().toISOString().split("T")[0] + " " + e.startTimeCampaign)
              let endTimeCampaign = new Date(new Date().toISOString().split("T")[0] + " " + e.endTimeCampaign)
              today = new Date()
              if (today > startTimeCampaign && today < endTimeCampaign) {
                tbStockiewFlashSale.push(e)
              } else {
                tbStockiewNominal.push(e)
              }
            } else {
              tbStockiewNominal.push(e)
            }
          }
        })
        settbStockiewNominal(tbStockiewNominal)
        settbStockiewFlashSale(tbStockiewFlashSale)
      }
    });
  };
  //#endregion

  const listenScrollEvent = (e) => {
    const scrollTop = e.currentTarget.scrollTop
    setY(scrollTop)
  }

  useEffect(() => {
    fetchDataImgBanner();
    fetchDatatbStock();
    fetchproductCategory()



  }, []);


  let isFlashsale = false
  tbStockiewFlashSale.map((e, i) => {
    if (e.isFlashSale) {
      isFlashsale = true
    }
  })
  return (
    <>
      {isLoading ? <Spinner customText={"Loading"} /> : null}
      <div style={{ height: "100%" }}>
        <div style={{
          width: "100%",
          height: ((125 - y) + "px"),
          margin: "auto",
        }}
          className={"animated-SlideShow "}
        >
          {ImgBanner.length > 0 ? <SlideShow img={ImgBanner} duration={5000} /> : null}
        </div>
        <div
          className="flex relative flex"
          style={{ height: "40px", alignItems: "center" }}
        >
          <div className="px-2">สินค้าทั้งหมด</div>
          <div className="px-2">สิ้นค้าขายดี</div>
          <div className="px-2" style={{ width: "150px" }}>
            {productCategory.length > 0 ?
              <Select
                className="text-gray-mbk mt-1 text-sm w-full border-none"
                isSearchable={false}
                id={"category"}
                name={"category"}
                // placeholder={lbl}
                onChange={(e) => {
                  setcategoryview(e.value);
                }}
                value={productCategory.filter(option =>
                  option.value
                  === category)}
                options={productCategory}
                styles={useStyle}
              />
              : null}
          </div>
          <div
            className="px-2 absolute flex"
            style={{ right: "0" }}
            onClick={() => {
              history.push(path.showCart);
            }}
          >
            <i className="fas fa-shopping-cart relative icon-cart" style={{ color: "#ddd" }}></i>
            {!fn.IsNullOrEmpty(cartNumberBadge) ? (
              <div className="cart-number-badge" style={{}}>
                {cartNumberBadge}
              </div>
            ) : null}
          </div>
        </div>
        <div className="liff-inline" />
        <div id="scroll" className="product-scroll" style={{
          width: "90%", margin: "auto", height: "calc(100% - " + (y > 120 ? (165 - 120) : (165 - y)) + "px)", overflow: "scroll",
        }} onScroll={listenScrollEvent}>
          {/* flash_sale */}
          {isFlashsale ?
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
                            className="px-2 relative"
                            style={{ minWidth: "170px", width: "200px" }}
                            onClick={() => {
                              history.push(
                                path.showProducts.replace(":id", e.id)
                              );
                            }}
                          >
                            <div className="relative" style={{ height: "150px" }}>
                              <div
                                className="absolute text-white font-bold"
                                style={{
                                  backgroundColor: "rgb(213 183 65 / 59%)",
                                  width: "100%",
                                  bottom: "0",
                                  height: "30px",
                                  borderRadius: "10px 0 10px 0",
                                  padding: "5px",
                                  textAlign: "center",
                                  zIndex: "1",
                                }}
                              >
                                <Counter time={new Date(e.endDateCampaign).toISOString().split("T")[0] + " " + e.endTimeCampaign} />
                              </div>

                              <ImageUC
                                style={{ margin: "auto", minHeight: "120px" }}
                                find={1}
                                relatedid={e.id}
                                relatedtable={["stock1"]}
                                alt="flash_sale"
                                className="w-32 border-2 border-blueGray-50"
                              ></ImageUC>

                              {e.IsBestSeller ?
                                <img
                                  style={{
                                    width: "25px", height: "25px", top: "0",
                                    right: "0"
                                  }}
                                  src={require("assets/img/mbk/icon_hot.png").default
                                  }
                                  alt="icon_hot"
                                  className="w-32 border-2 border-blueGray-50 absolute"
                                ></img>
                                : null}
                            </div>

                            <div className="px-2 py-2">
                              <div className="line-clamp-2" style={{
                                fontSize: "11px",
                                height: "35px"
                              }}>
                                {e.productName}
                              </div>
                            </div>
                            <div
                              className="flex relative"
                              style={{ bottom: "0", left: "10px", fontSize: "10px" }}
                            >
                              <div
                                style={{
                                  color:
                                    e.discount > 0 ? "#ddd" : "#000",
                                  textDecoration:
                                    e.discount > 0 ? "line-through" : "none",
                                }}
                              >
                                {"฿ " + fn.formatMoney(e.price)}
                              </div>
                              {e.discount > 0 ? (
                                <div
                                  style={{ color: "red", paddingLeft: "10px" }}
                                >

                                  {"฿ " + fn.formatMoney(e.priceDiscount)}
                                </div>
                              ) : null}
                              <div
                                className="absolute"
                                style={{ bottom: "0", right: "10px", color: "gray" }}
                              >
                                <i className="fas fa-shopping-cart" style={{ color: "#ddd", fontSize: "10px" }}></i>
                              </div>
                            </div>



                          </div>
                        );
                      }
                    })}
                  </div>
                </div>
              </div>
            </div> : null
          }
          < div className="mt-2">
            <div
              className="line-row "
            >
              {[...tbStockiewNominal].map((e, i) => {
                return (
                  <div
                    key={i}
                    className="line-column mt-2"
                    onClick={() => {
                      history.push(path.showProducts.replace(":id", e.id));
                    }}
                  >
                    <div className="line-card relative">
                      <div className="relative" style={{}}>
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
                          className="w-32 border-2 border-blueGray-50"
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
                            <div className=" text-white px-2">
                              {"SALE -" + fn.formatMoney(e.percent) + "%"}
                            </div>
                          </div>
                        ) : null}

                        {e.IsBestSeller ?
                          <img
                            style={{
                              width: "25px", height: "25px", top: "0",
                              right: "0"
                            }}
                            src={require("assets/img/mbk/icon_hot.png").default
                            }
                            alt="icon_hot"
                            className="w-32 border-2 border-blueGray-50 absolute"
                          ></img>
                          : null}
                      </div>
                      <div
                        className="px-1 py-2 line-scroll line-clamp-2"
                        style={{
                          height: "40px",
                          lineHeight: "15px",
                          overflow: "auto",
                          marginBottom: "10px",
                          fontSize: "11px"
                        }}
                      >
                        {e.productName}
                      </div>
                      <div
                        className="flex mb-1 "
                        style={{ bottom: "0", left: "10px", fontSize: "10px" }}
                      >
                        <div
                          style={{
                            color:
                              e.discount > 0 ? "#ddd" : "#000",
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
                        <i className="fas fa-shopping-cart" style={{ color: "#ddd", fontSize: "10px" }}></i>
                      </div>

                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default ShopList;
