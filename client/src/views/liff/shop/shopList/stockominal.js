import React, { useState, useEffect, useRef } from "react";
import { useHistory } from "react-router-dom";
import ImageUC from "components/Image/index";
import { path } from "services/liff.services";
import * as fn from "services/default.service";

const StockominalUC = ({ data }) => {
  const history = useHistory();

  return (
    <div className="mt-2 mb-2">
      <div className="line-row mb-2 ">
        {[...data].map((e, i) => {
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
                      // maxHeight: "120px",
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
                      <div className="text-xs text-white px-2"
                        style={{
                          borderRadius: "5px",
                          padding: "5px 10px",
                          fontSize: "10px",
                          background: "red",
                          justifyContent: "center",
                          // fontWeight: "bold",
                          lineHeight: "9px",
                          paddingTop: "6px"
                        }}>
                        {"SALE -" + parseInt(fn.formatMoney(e.percent)) + "%"}
                      </div>
                    </div>
                  ) : null}

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
                <div
                  className="py-2 line-scroll line-clamp-2"
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
                  className="flex mb-1"
                  style={{
                    bottom: "0",
                    // left: "10px",
                    fontSize: "10px",
                  }}
                >
                  <div
                    style={{
                      color: e.discount > 0 ? "#ddd" : "#000",
                      textDecoration: e.discount > 0 ? "line-through" : "none",
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
                  style={{ bottom: "0", right: "4px", color: "gray" }}
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
  );
};

export default StockominalUC;
