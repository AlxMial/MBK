import React from "react";
import moment from "moment";
import ImageUC from "components/Image/index";
import { path } from "services/liff.services";
import { useHistory } from "react-router-dom";
// components

const Canbeused = ({ data }) => {
  // console.log('data', data)
  const history = useHistory();
  return (
    <>
      <div className="mt-2 " style={{ padding: "10px", height: "100%" }}>
        <div className="flex relative" style={{ height: "100%" }}>
          {data.length > 0 ?
            <div className="w-full mt-2 mb-2 font-bold text-xs">
              {[...data].filter((e) => {
                return e.isCancel === false && e.isUsedCoupon === false && (e.expiredDate && new Date(e.expiredDate) > new Date() || !e.expiredDate)
              }).map((e, i) => {
                return (
                  <div key={i} className=" mb-2 inline-block" style={{ width: "50%" }} >
                    <div className="w-full mb-2" >
                      <div style={{ width: "auto", maxWidth: "80%", margin: "auto" }}>
                        <ImageUC
                          style={{
                            width: "100%",
                            height: "auto",
                            minHeight: "80px",
                            minWidth: "80px",
                          }}
                          find={1}
                          relatedid={e.id}
                          relatedtable={["tbRedemptionCoupon"]}
                          alt="tbRedemptionCoupon"
                          className=" animated-img"
                        ></ImageUC>
                      </div>
                    </div>
                    <div className="w-full font-bold flex mx-auto items-center  justify-between" style={{ width: "80%", color: "#000000", height: "35px", fontSize: "11px", }} onClick={() => {
                      history.push(path.infocoupon.replace(":id", e.CouponCodeId))
                    }}>
                      <div className="flex" style={{ alignItems: "center" }}>{e.couponName}</div>
                      <div >

                        <i className="fas fa-chevron-right" style={{ alignItems: "center" }}></i>
                      </div>
                    </div>
                    <div className="w-full mx-auto font-normal text-liff-gray-mbk" style={{ width: "80%", fontSize: "11px", }}>
                      {e.points + " คะแนน"}
                    </div>
                    <div className="w-full  mx-auto font-normal text-liff-gray-mbk" style={{ width: "80%", fontSize: "11px", }}>
                      {e.expiredDate !== null ? "ใช้ได้ถึง " + moment(e.expiredDate).locale("th").add(543, "years").format("DD MMM yyyy") : "ไม่หมดอายุ"}
                    </div>
                    <div className="liff-inline mb-2 mx-auto" style={{ width: "80%" }}></div>
                  </div>

                )
              })}
            </div>
            : <div className="w-full flex items-center" style={{
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
export default Canbeused;
