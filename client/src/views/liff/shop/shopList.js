import React, { useState, useEffect, useRef } from "react";
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

const Cancel = () => {
  const history = useHistory();
  const { addToast } = useToasts();
  const [isLoading, setIsLoading] = useState(false);
  const [ImgBanner, setImgBanner] = useState([]);

  const [category, setcategory] = useState("1");
  const categoryoptions = [
    { value: "0", label: "สินค้าตามหมวดหมู" },
    { value: "1", label: "ข้าวหอมมะลิ" },
    { value: "2", label: "ข้าวจ้าว" },
    { value: "3", label: "ข้าวไรเบอร์รี่" },
  ];

  const [cartNumberBadge, setcartNumberBadge] = useState(
    fn.getCartNumberBadge()
  );
  const [tbStock, settbStock] = useState([]);

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

  //#region รูป Banner
  const fetchDataImgBanner = async () => {
    await axios.get("stock/getImgBanner").then((response) => {
      console.log(response);
      if (response.data.ImgBanner) {
        let ImgBanner = response.data.ImgBanner;
        bufferToBase64(ImgBanner);
      } else {
        setImgBanner([]);
      }
    });
  };

  const bufferToBase64 = async (ImgBanner) => {
    let dataImg = [];
    for (var i = 0; i < ImgBanner.length; i++) {
      console.log("id" + ImgBanner[i].id);
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
      } else {
        settbStock([]);
        // error
      }
    });
  };
  //#endregion
  useEffect(() => {
    fetchDataImgBanner();
    fetchDatatbStock();
  }, []);

  return (
    <>
      {isLoading ? <Spinner customText={"Loading"} /> : null}
      <div>
        {ImgBanner.length > 0 ? <SlideShow img={ImgBanner} /> : null}
        <div
          className="flex relative flex"
          style={{ height: "35px", alignItems: "center" }}
        >
          <div className="px-2">สินค้าทั้งหมด</div>
          <div className="px-2">สิ้นค้าขายดี</div>
          <div className="px-2">
            <Select
              className="text-gray-mbk mt-1 text-sm w-full border-none"
              isSearchable={false}
              id={"category"}
              name={"category"}
              // placeholder={lbl}
              onChange={(e) => {
                setcategory(e.value);
              }}
              value={category}
              options={categoryoptions}
              styles={useStyle}
            />
          </div>
          <div
            className="px-2 absolute flex"
            style={{ right: "0" }}
            onClick={() => {
              history.push(path.showCart);
            }}
          >
            <i className="fas fa-cart-plus relative icon-cart"></i>
            {!fn.IsNullOrEmpty(cartNumberBadge) ? (
              <div className="cart-number-badge" style={{}}>
                {cartNumberBadge}{" "}
              </div>
            ) : null}
          </div>
        </div>
        <div className="liff-inline" />
        <div style={{ width: "90%", margin: "auto" }}>
          {/* flash_sale */}
          <div className="mt-2">
            <div
              className="shadow"
              style={{
                border: "1px solid #FFF",
                height: "180px",
                borderRadius: "10px",
                display: "inline-table",
                width: "100%",
              }}
            >
              <div className="mt-2 px-2 py-2">
                <div>
                  <img
                    src={require("assets/img/mbk/flash_sale.png").default}
                    alt="..."
                    className="w-32 border-2 border-blueGray-50"
                  ></img>
                </div>
                <div
                  className="flex mt-2"
                  style={{
                    overflowX: "auto",
                    width: "100%",
                    maxWidth: "340px",
                  }}
                >
                  {[...tbStock].map((e, i) => {
                    if (e.isFlashSale) {
                      return (
                        <div
                          key={i}
                          className="px-2 relative"
                          style={{ minWidth: "170px", paddingBottom: "25px" }}
                          onClick={() => {
                            history.push(
                              path.showProducts.replace(":id", e.id)
                            );
                          }}
                        >
                          <div className="relative" style={{}}>
                            <div
                              className="absolute text-white font-bold"
                              style={{
                                backgroundColor: "rgb(213 183 65 / 59%)",
                                width: "100%",
                                bottom: "0",
                                // left: "10%",
                                height: "30px",
                                borderRadius: "10px 0 10px 0",
                                padding: "5px",
                                textAlign: "center",
                                zIndex: "1",
                              }}
                            >
                              <Counter time={e.endtime} />
                            </div>

                            <ImageUC
                              style={{ margin: "auto", minHeight: "120px" }}
                              find={1}
                              relatedId={e.id}
                              relatedTable={["stock1"]}
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
                          </div>

                          <div className="px-2 py-2">{e.description}</div>
                          <div
                            className="flex absolute"
                            style={{ bottom: "0", left: "10px" }}
                          >
                            <div
                              style={{
                                color:
                                  e.discount > 0 ? "rgba(0,0,0,.54)" : "#000",
                                textDecoration:
                                  e.discount > 0 ? "line-through" : "none",
                              }}
                            >
                              {"฿" + fn.formatMoney(e.price)}
                            </div>
                            {e.discount > 0 ? (
                              <div
                                style={{ color: "red", paddingLeft: "10px" }}
                              >
                                {"฿" + fn.formatMoney(e.priceDiscount)}
                              </div>
                            ) : null}
                          </div>
                          <div
                            className="absolute"
                            style={{ bottom: "0", right: "10px" }}
                          >
                            <i className="fas fa-cart-plus"></i>
                          </div>

                          {!fn.IsNullOrEmpty(e.status) ? (
                            <div
                              className="absolute"
                              style={{ top: "0", right: "0" }}
                            >
                              {
                                <img
                                  style={{ margin: "auto", width: "2rem" }}
                                  src={
                                    e.status === "new"
                                      ? require("assets/img/mbk/icon_new.png")
                                          .default
                                      : require("assets/img/mbk/icon_hot.png")
                                          .default
                                  }
                                  alt="flash_sale"
                                  className="w-32 border-2 border-blueGray-50"
                                ></img>
                              }
                            </div>
                          ) : null}
                        </div>
                      );
                    }
                  })}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-2">
            <div
              className="line-row "
              style={{
                maxHeight: "400px",
                overflow: "scroll",
              }}
            >
              {[...tbStock].map((e, i) => {
                if (!e.isFlashSale) {
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
                            relatedId={e.id}
                            relatedTable={["stock1"]}
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
                        </div>
                        <div
                          className="px-2 py-2"
                          style={{
                            height: "40px",
                            lineHeight: "15px",
                            overflow: "auto",
                            marginBottom: "10px",
                          }}
                        >
                          {e.description}
                        </div>
                        <div
                          className="flex absolute"
                          style={{ bottom: "0", left: "10px" }}
                        >
                          <div
                            style={{
                              color:
                                e.discount > 0 ? "rgba(0,0,0,.54)" : "#000",
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
                          className="absolute"
                          style={{ bottom: "0", right: "10px" }}
                        >
                          <i className="fas fa-cart-plus"></i>
                        </div>
                        {!fn.IsNullOrEmpty(e.status) ? (
                          <div
                            className="absolute"
                            style={{ top: "0", right: "0" }}
                          >
                            {
                              <img
                                style={{ margin: "auto", width: "2rem" }}
                                src={
                                  e.status === "new"
                                    ? require("assets/img/mbk/icon_new.png")
                                        .default
                                    : require("assets/img/mbk/icon_hot.png")
                                        .default
                                }
                                alt="flash_sale"
                                className="w-32 border-2 border-blueGray-50"
                              ></img>
                            }
                          </div>
                        ) : null}
                      </div>
                    </div>
                  );
                }
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default Cancel;
