import React from "react";
import { useHistory } from "react-router-dom";
import ImageUC from "components/Image/index";
import { path } from "services/liff.services";
import * as fn from "services/default.service";

const BestSellerUC = ({ data }) => {
  const history = useHistory();
  return (
    <div className="">
      <div
        className="shadow"
        style={{
          // border: "1px solid #FFF",
          borderRadius: "15px",
          width: "100%",
        }}
      >
        <div className="px-2 py-2 ">
          <div
            className={"flex line-scroll "}
            style={{
              overflowX: "auto",
              width: "100%",
              maxWidth: "340px",
            }}
          >
            {[...data].map((e, i) => {
              return (
                <div
                  key={i}
                  className="relative"
                  style={{
                    width: "calc(50vw - 9px - 5%)",
                    minWidth: "calc(50vw - 9px - 5%)",
                    padding: "0px 10px",
                  }}
                  onClick={() => {
                    history.push(path.showProducts.replace(":id", e.id));
                  }}
                >
                  <div className="relative" style={{ height: "150px" }}>
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

            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BestSellerUC;
