import React from "react";
import moment from "moment";
import ImageUC from "components/Image/index";
// components

const Expire = ({ data }) => {
  return (
    <>
      <div className="mt-2 h-full" style={{ padding: "10px" }}>
        <div className="flex relative h-full">
          {data.length > 0 ?
            <div className="mt-2 mb-2 text-green-mbk font-bold text-xs" style={{
              width: "90%", margin: "auto"
              , height: "calc(100% - 250px)"
            }}>
              {[...data].filter((e) => { return  new Date(e.expiredDate) < new Date() || e.isUsedCoupon === true }).map((e, i) => {
                return (
                  <div key={i} className="w-full  mb-2" >
                    <div className="w-full" style={{
                      filter: "grayscale(1)",
                      opacity: "0.5"
                    }}>
                      <div className="w-full">
                        <div className="relative" style={{ width: "auto", maxWidth: "150px", margin: "auto" }}>
                          <ImageUC
                            style={{
                              width: "150px",
                              height: "100px"
                            }}
                            find={1}
                            relatedid={e.id}
                            relatedtable={["tbRedemptionCoupon"]}
                            alt="tbRedemptionCoupon"
                            className=" animated-img"
                          ></ImageUC>

                          <div className="absolute px-2" style={{
                            top: "10px",
                            backgroundColor: "#000",
                            width: "100px",
                            height: "25px",
                            color: "#FFFFFF"
                          }}>{e.isUsedCoupon ? "ถูกใช้ไปแล้ว" : "หมดอายุ"}</div>
                        </div>
                      </div>
                      <div className="w-full font-bold flex mb-2" style={{ fontSize: "14px", color: "#000000" }}>
                        <div className="flex" style={{ width: "calc(100% - 30px)", alignItems: "center" }}>{e.couponName}</div>
                        <div style={{ width: "30px", textAlign: "right" }}>
                          <i className="flex fas fa-angle-right" style={{ alignItems: "center", fontSize: "25px" }}></i>
                        </div>
                      </div>
                      <div className="w-full" style={{ fontSize: "12px", color: "#ddd", }}>
                        {e.points + " คะแนน"}
                      </div>
                      <div className="w-full" style={{ fontSize: "12px", color: "#ddd" }}>
                        {"ใช้ได้ถึง " + moment(e.expiredDate).locale("th").add(543, "year").format("DD MMM YYYY")}
                      </div>
                    </div>

                  </div>

                )
              })}
            </div>
            : <div className="w-full flex items-center h-full" style={{
              // height: "50px",
              justifyContent: "center",
              justifyItems: "center",
              color: "#ddd"
            }} >
              ยังไม่มีคูปองที่สามารถใช้ได้
            </div>}
        </div>
      </div>
    </>
  );
};
export default Expire;
