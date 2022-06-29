import React from "react";
import { useHistory } from "react-router-dom";
import * as fn from "@services/default.service";
import ImageUC from "components/Image/index";
const DetailModel = ({ data }) => {
  return (
    <div
      className="mt-2 line-scroll"
      style={{
        maxHeight: "calc(100% - 420px)",
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
                  <div className="w-full font-bold text-xs">
                    {e.productName}
                  </div>
                </div>
                <div className="font-bold" style={{ height: "15%" }}>
                  <div className="flex relative text-xs">
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
                </div>
                <div className="w-full text-xs">
                  {"จำนวน : " + (e.quantity || e.amount)}
                </div>
              </div>
            </div>
            <div className="liff-inline" />
          </div>
        );
      })}
    </div>
  );
};

export default DetailModel;
