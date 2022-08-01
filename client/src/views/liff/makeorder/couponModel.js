import React, { useState, useEffect } from "react";
import Spinner from "components/Loadings/spinner/Spinner";
import InputMask from "react-input-mask";
import axios from "services/axios";
import * as Storage from "@services/Storage.service";
import FilesService from "../../../services/files";
import moment from "moment";
// components

const CouponModel = ({ setopenCoupon, setusecoupon, id }) => {
  const [tbcouponcodes, settbcouponcodes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const fetchgettbcouponcodes = async () => {
    setIsLoading(true)
    await axios.get("redemptions/gettbcouponcodes").then(async (response) => {
      if (response.status) {
        let data = response.data.tbredemptioncoupons;
        console.log(data)
        for (var i = 0; i < data.length; i++) {
          const base64 = await FilesService.buffer64UTF8(data[i].image.data);
          data[i].image = base64;
        }
        settbcouponcodes(data);
      }
    }).finally(() => {
      setIsLoading(false)
    });
  };
  useEffect(() => {
    fetchgettbcouponcodes();
  }, []);
  return (
    <>
      {isLoading ? <Spinner customText={"Loading"} /> : null}
      <div className="bg-green-mbk">
        <div
          style={{ height: "40px" }}
          className=" noselect text-lg text-white font-bold text-center "
        >
          {"ส่วนลด"}
        </div>
      </div>

      <div
        className="mt-2 line-scroll relative"
        style={{
          height: "calc(100% - 200px)",
          width: "95%",
          marginLeft: "auto",
          marginRight: "auto",
        }}
      >
        {/* <div className="flex mt-2" style={{ width: "90%", margin: "auto" }}>
          <div className="noselect  w-full margin-auto-t-b">
            <InputMask
              className={
                " text-center line-input border-0 px-2 py-2 placeholder-blueGray-300 text-gray-mbk bg-white  text-sm  w-full "
              }
              maxLength={22}
              value={""}
              name={"code"}
              type={"text"}
              onChange={(e) => { }}
              placeholder={"XXXX-XXXX-XXXX"}
              maskChar=" "
            />
          </div>
        </div> */}
        {/* <div className="mt-2">
          <div className="px-2 " style={{ width: "50%", margin: "auto" }}>
            <div className="w-full px-2">
              <div
                className="flex bg-lemon-mbk text-white text-center text-lg  font-bold "
                style={{
                  margin: "auto",
                  height: "45px",
                  borderRadius: "10px",
                  padding: "5px",
                  alignItems: "center",
                  justifyContent: "center",
                }}

              >
                {"ใช้คูปอง"}
              </div>
            </div>
          </div>
        </div> */}

        {tbcouponcodes.length > 0
          ? [...tbcouponcodes].map((e, i) => {
            return (
              <div key={i}>
                <div className="flex mt-2">
                  <div
                    className="px-2 py-2"
                    style={{ width: "120px", height: "80px" }}
                  >
                    <img
                      src={e.image}
                      alt="icon_hot"
                      className="w-32"
                    ></img>
                  </div>
                  <div
                    className="px-2 pt-2 relative flex flex-col justify-between"
                    style={{ width: "calc(100% - 120px)" }}
                  >
                    <div className="text-sm text-bold">{e.couponName}</div>
                    <div
                      className="flex  w-full justify-between"
                    >
                      <div
                        className="flex"
                        style={{
                          width: "110px",
                          color: "var(--mq-txt-color, rgb(122, 122, 122))",
                          fontSize: "12px",
                          alignItems: "end",
                        }}
                      >
                        {!e.isNotExpired
                          ? "ใช้ได้ถึง " +
                          moment(e.expiredDate)
                            .locale("th")
                            .add(543, "years")
                            .format("DD MMM yyyy")
                          : "ไม่หมดอายุ"}
                      </div>
                      <div
                        className="flex bg-green-mbk text-white text-center text-xs font-bold items-center justify-center"
                        style={{
                          borderRadius: "20px",
                          padding: "2px 10px",
                        }}
                        onClick={() => {
                          setusecoupon(e);
                          setopenCoupon(false);
                          if (id === "cart") {
                            Storage.addconpon_cart(e);
                          }
                        }}
                      >
                        ใช้ส่วนลด
                      </div>
                    </div>
                  </div>
                </div>
                <div className="liff-inline" />
              </div>
            );
          })
          : null}
      </div>
      <div className="absolute w-full flex" style={{ bottom: "0px" }}>
        <div className="w-full" style={{ padding: "10px" }}>
          <div
            className="flex bg-green-mbk text-white text-center text-lg  font-bold "
            style={{
              margin: "auto",
              height: "40px",
              borderRadius: "10px",
              padding: "5px",
              alignItems: "center",
              justifyContent: "center",
            }}
            onClick={() => {
              setopenCoupon(false);
            }}
          >
            {"กลับไปที่ชำระเงิน"}
          </div>
        </div>
      </div>
    </>
  );
};
export default CouponModel;
