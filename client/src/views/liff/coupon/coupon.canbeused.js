import React from "react";
import moment from "moment";
import ImageUC from "components/Image/index";
// components

const Canbeused = ({ data }) => {
  return (
    <>
      <div className="mt-2 " style={{ padding: "10px" }}>
        <div className="flex relative">
          {data.length > 0 ?
            <div className="mt-2 mb-2 text-green-mbk font-bold text-xs" style={{ width: "90%", margin: "auto", height: "calc(100% - 250px)" }}>
              {[...data].map((e, i) => {
                return (
                  <div key={i} className="w-full  mb-2" >
                    <div className="w-full mb-2" >
                      <div style={{ width: "auto", maxWidth: "150px", margin: "auto" }}>
                        <ImageUC
                          find={1}
                          relatedid={e.id}
                          relatedtable={["tbRedemptionCoupon"]}
                          alt="tbRedemptionCoupon"
                          className=" border-2 border-blueGray-50 animated-img"
                        ></ImageUC>
                      </div>
                    </div>
                    <div className="w-full font-bold flex mb-2" style={{ fontSize: "14px", color: "#000000" }}>
                      <div className="flex" style={{ width: "calc(100% - 30px)", alignItems: "center" }}>{e.couponName}</div>
                      <div style={{ width: "30px", textAlign: "right" }}>
                        <i class="flex fas fa-angle-right" style={{ alignItems: "center", fontSize: "25px" }}></i>
                      </div>
                    </div>
                    <div className="w-full mb-2" style={{ fontSize: "12px", color: "#ddd" }}>
                      {e.points + " คะแนน"}
                    </div>
                    <div className="w-full" style={{ fontSize: "12px", color: "#ddd" }}>
                      {"ใช้ได้ถึง " + moment(e.expiredDate).locale("th").add(543, "year").format("DD MMM YYYY")}
                    </div>

                  </div>

                )
              })}
            </div>
            : <div className="w-full flex" style={{
              height: "50px",
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
export default Canbeused;
