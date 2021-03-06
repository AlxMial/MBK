import React from "react";
import * as fn from "@services/default.service";
import ImageUC from "components/Image/index";
const DetailModel = ({ data, freebies, _static }) => {
  return (
    <div
      className="mt-2 line-scroll"
      style={{
        width: "95%",
        marginLeft: "auto",
        marginRight: "auto",
      }}
    >
      {[...data].map((e, i) => {
        return (
          <div key={i}>
            <div className="flex mt-2" style={{ height: "90px " }}>
              <div style={{ width: "30%" }}>
                <ImageUC
                  style={{ margin: "auto", height: "90px" }}
                  find={1}
                  relatedid={e.id}
                  relatedtable={["stock1"]}
                  alt="flash_sale"
                  className="w-32 border-2 border-blueGray-50 animated-img"
                ></ImageUC>
              </div>
              <div className="px-2" style={{ width: "70%" }}>
                <div className="flex" style={{ height: "60%" }}>
                  <div className="w-full text-sm">{e.productName}</div>
                </div>
                <div className="font-bold">
                  {e.isFree ? (
                    <div className="flex font-bold relative text-sm">
                      <div
                        style={{
                          color: "red",
                        }}
                      >
                        {"Free"}
                      </div>
                    </div>
                  ) : (
                    <div className="flex relative text-sm">
                      <div
                        style={{
                          color: fn.isFlashSale(e)
                            ? "#ddd"
                            : e.discount > 0
                            ? "#ddd"
                            : "#000",
                          textDecoration:
                            e.discount > 0 ? "line-through" : "none",
                        }}
                      >
                        {"฿ " + fn.formatMoney(e.price)}
                      </div>
                      {fn.isFlashSale(e) ? (
                        <div style={{ color: "red", paddingLeft: "10px" }}>
                          {"฿ " +
                            fn.formatMoney(
                              _static == true ? e.discount : e.priceDiscount
                            )}
                        </div>
                      ) : e.discount > 0 ? (
                        <div style={{ color: "red", paddingLeft: "10px" }}>
                          {"฿ " +
                            fn.formatMoney(
                              _static == true ? e.discount : e.priceDiscount
                            )}
                        </div>
                      ) : null}
                    </div>
                  )}
                </div>
                <div className="w-full text-sm">
                  {"จำนวน : " + (e.quantity || e.amount)}
                </div>
              </div>
            </div>
            <div className="liff-inline" />
          </div>
        );
      })}
      {freebies != null
        ? [...freebies].map((e, i) => {
            return (
              <div key={i}>
                <div className="flex mt-2" style={{ height: "90px " }}>
                  <div style={{ width: "30%" }}>
                    <ImageUC
                      style={{ margin: "auto", height: "90px" }}
                      find={1}
                      relatedid={e.id}
                      relatedtable={["stock1"]}
                      alt="flash_sale"
                      className="w-32 border-2 border-blueGray-50 animated-img"
                    ></ImageUC>
                  </div>
                  <div className="px-2" style={{ width: "70%" }}>
                    <div className="flex" style={{ height: "60%" }}>
                      <div className="w-full  text-sm">{e.campaignName}</div>
                    </div>
                    <div>
                      <div className="flex font-bold relative text-sm">
                        <div
                          style={{
                            color: "red",
                          }}
                        >
                          {"Free"}
                        </div>
                      </div>
                    </div>
                    <div className="w-full text-sm">{"จำนวน : " + 1 + " "}</div>
                  </div>
                </div>
                <div className="liff-inline" />
              </div>
            );
          })
        : null}
    </div>
  );
};

export default DetailModel;
