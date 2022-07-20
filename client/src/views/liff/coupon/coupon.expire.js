import React from "react";
import moment from "moment";
import ImageUC from "components/Image/index";
// components

const Expire = ({ data }) => {
  console.log(data)
  return (
    <>
      <div className="mt-2 h-full">
        <div className="flex relative h-full" style={{ padding: '10px' }}>
          {data.length > 0 ?
            <div className="my-2 mx-auto text-green-mbk font-bold text-xs h-full">
              {[...data].filter((e) => { return new Date(e.expiredDate) < new Date() || e.isUsedCoupon === true || e.isCancel === true }).map((e, i) => {
                return (
                  <div key={i} className=" mb-2 inline-block" style={{ width: "50%" }} >
                    <div className="w-full" style={{
                      filter: "grayscale(1)",
                      opacity: "0.5"
                    }}>
                      <div className="w-full">
                        <div className="relative" style={{ width: "80%", margin: "auto" }}>
                          <ImageUC
                            style={{
                              width: "100%",
                              height: "auto"
                            }}
                            find={1}
                            relatedid={e.id}
                            relatedtable={["tbRedemptionCoupon"]}
                            alt="tbRedemptionCoupon"
                            className=" animated-img"
                          ></ImageUC>

                          <div className="absolute px-2 flex items-center" style={{
                            top: "10px",
                            backgroundColor: "#000",
                            width: "100px",
                            height: "25px",
                            color: "#FFFFFF"
                          }}>{e.isUsedCoupon ? "ถูกใช้ไปแล้ว" : e.isCancel ? "ยกเลิก" : "หมดอายุ"}</div>
                        </div>
                      </div>
                      <div className="w-full font-bold flex  mx-auto  items-center justify-between" style={{ width: "80%", color: "#000000", height: "35px", fontSize: "11px", }}>
                        <div className="flex" style={{ alignItems: "center" }}>{e.couponName}</div>
                        <div >
                          <i className="fas fa-chevron-right" style={{ alignItems: "center" }}></i>
                        </div>
                      </div>
                      <div className="w-full mx-auto font-normal text-liff-gray-mbk" style={{ width: "80%", fontSize: "11px", }}>
                        {e.points + " คะแนน"}
                      </div>
                      <div className="w-full mx-auto font-normal text-liff-gray-mbk" style={{ width: "80%", fontSize: "11px", }}>
                        {"ใช้ได้ถึง " + moment(e.expiredDate).locale("th").add(543, "year").format("DD MMM YYYY")}
                      </div>
                      <div class="liff-inline mb-2 mx-auto" style={{ width: "80%" }}></div>
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
