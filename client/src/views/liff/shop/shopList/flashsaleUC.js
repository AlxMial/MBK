import React, { useState, useEffect, useRef } from "react";
import { useHistory } from "react-router-dom";
import ImageUC from "components/Image/index";
import { path } from "services/liff.services";
import * as fn from "services/default.service";

const FlashsaleUC = ({ data, isShowLogo = true }) => {
  const history = useHistory();
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
  const _min_width = window.innerWidth >= 768 ? '185px' : "calc(50vw - 1.125rem)";
  const _width = window.innerWidth >= 768 ? '185px' : "calc(50vw - 1.125rem)";
  return (
    <div className={(isShowLogo ? 'mt-2' : '')}>
      <div
        className={(isShowLogo ? 'shadow rounded-lg' : '')}
        style={{
          // border: "1px solid #FFF",
          // borderRadius: "10px",
          width: "100%",
        }}
      >
        <div className={"px-2 py-2 " + (isShowLogo ? 'mt-2' : '')}>
          {/* {isShowLogo && <div>
            <img
              src={require("assets/img/mbk/flash_sale.png").default}
              alt="flash_sale"
              className=""
              style={{ width: "100px" }}
            ></img>
          </div>
          } */}
          <div
            className={"flex line-scroll " + (isShowLogo ? 'mt-2' : '')}
            style={{
              overflowX: "auto",
              width: "100%",
              // maxWidth: "340px",
            }}
          >
            {[...data].map((e, i) => {
              if (e.isFlashSale) {
                return (
                  <div
                    key={i}
                    className="relative"
                    style={{
                      width: _width,
                      minWidth: _min_width,
                      padding: "35px 10px 0 10px",
                      maxWidth: "200px"
                    }}
                    onClick={() => {
                      history.push(path.showProducts.replace(":id", e.id));
                    }}
                  >
                    <div className="relative" style={{ height: "150px" }}>
                      <div
                        className="absolute text-white font-bold flex items-center justify-center bg-gold-mbk"
                        style={{
                          // backgroundColor: "rgb(213 183 65 / 90%)",
                          // backgroundColor: "#d0af21",
                          width: "100%",
                          top: "-35px",
                          height: "30px",
                          borderRadius: "5px 15px",
                          // padding: "5px",
                          textAlign: "center",
                          fontSize: "18px",
                          zIndex: "1",
                          lineHeight: "initial"
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
                            width: "70px",
                            height: "70px",
                            top: "-20px",
                            left: "-10px",
                          }}
                          src={require("assets/img/shop-main/hot-logo.png").default}
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
                          color: e.saleDiscount > 0 ? "#ddd" : "#000",
                          textDecoration:
                            e.saleDiscount > 0 ? "line-through" : "none",
                        }}
                      >
                        {"฿ " + fn.formatMoney(e.price)}
                      </div>
                      {e.saleDiscount > 0 ? (
                        <div
                          style={{
                            color: "red",
                            paddingLeft: "10px",
                          }}
                        >
                          {"฿ " + fn.formatMoney(e.price - e.saleDiscount)}
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
  );
};

export default FlashsaleUC;
