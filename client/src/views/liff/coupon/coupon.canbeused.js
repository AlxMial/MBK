import React from "react";
import moment from "moment";
import ImageUC from "components/Image/index";
import { path } from "services/liff.services";
import { useHistory } from "react-router-dom";
// components

const Canbeused = ({ data }) => {
  const history = useHistory();
  return (
    <>
      <div className="mt-2 " style={{ padding: "10px", height: "100%" }}>
        <div className="flex relative" style={{ height: "100%" }}>
          {data.length > 0 ?
            <div className="w-full mt-2 mb-2 text-green-mbk font-bold text-xs" style={{ height: "calc(100% - 250px)" }}>
              {[...data].map((e, i) => {
                return (
                  <div key={i} className="w-full  mb-2" >
                    <div className="w-full mb-2" >
                      <div style={{ width: "auto", maxWidth: "150px", margin: "auto" }}>
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
                      </div>
                    </div>
                    <div className="w-full font-bold flex mb-2" style={{ fontSize: "14px", color: "#000000" }} onClick={() => {
                      history.push(path.infocoupon.replace(":id", e.CouponCodeId))
                    }}>
                      <div className="flex" style={{ width: "calc(100% - 30px)", alignItems: "center" }}>{e.couponName}</div>
                      <div style={{ width: "30px", textAlign: "right" }}>
                        <i className="flex fas fa-angle-right" style={{ alignItems: "center", fontSize: "25px" }}></i>
                      </div>
                    </div>
                    <div className="w-full mb-2" style={{ fontSize: "12px", color: "#ddd" }}>
                      {e.points + " คะแนน"}
                    </div>
                    <div className="w-full" style={{ fontSize: "12px", color: "#ddd" }}>
                      {"ใช้ได้ถึง " + (e.expiredDate === null ? "-" : moment(e.expiredDate).locale("th").add(543, "year").format("DD MMM YYYY"))}
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
