import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import InputMask from "react-input-mask";
import axios from "services/axios";
import * as Storage from "@services/Storage.service";
import FilesService from "../../../services/files";
import moment from "moment";
// components

const CouponModel = ({ setopenCoupon, setusecoupon, id }) => {
  // let { id } = useParams();
  const history = useHistory();
  const [tbcouponcodes, settbcouponcodes] = useState([]);
  const fetchgettbcouponcodes = async () => {
    await axios.get("redemptions/gettbcouponcodes").then(async (response) => {
      if (response.status) {
        let data = response.data.tbredemptioncoupons;
        for (var i = 0; i < data.length; i++) {
          const base64 = await FilesService.buffer64UTF8(data[i].image.data);
          data[i].image = base64;
        }
        settbcouponcodes(data);
      }
    });
  };
  useEffect(() => {
    fetchgettbcouponcodes();
  }, []);
  return (
    <>
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
        <div className="flex mt-2" style={{ width: "90%", margin: "auto" }}>
          <div className="noselect  w-full margin-auto-t-b">
            <InputMask
              className={
                " text-center line-input border-0 px-2 py-2 placeholder-blueGray-300 text-gray-mbk bg-white  text-sm  w-full "
              }
              maxLength={22}
              value={""}
              name={"code"}
              type={"text"}
              onChange={(e) => {}}
              placeholder={"XXXX-XXXX-XXXX"}
              maskChar=" "
            />
          </div>
        </div>
        <div className="mt-2">
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
                // onClick={add_to_cart}
              >
                {"ใช้คูปอง"}
              </div>
            </div>
          </div>
        </div>

        {tbcouponcodes.length > 0
          ? [...tbcouponcodes].map((e, i) => {
              return (
                <div key={i}>
                  <div className="flex mt-2">
                    <div
                      className="px-2 py-2"
                      style={{ width: "120px", height: "120px" }}
                    >
                      <img
                        src={e.image}
                        alt="icon_hot"
                        className="w-32 border-2 border-blueGray-50"
                      ></img>
                    </div>
                    <div
                      className="px-2 py-5 relative"
                      style={{ width: "calc(100% - 120px)" }}
                    >
                      <div className="text-base text-bold">{e.couponName}</div>
                      <div
                        className="flex absolute w-full"
                        style={{ bottom: "0" }}
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
                            : ""}
                        </div>
                        <div
                          className="bg-green-mbk text-white text-center text-lg  font-bold"
                          style={{
                            margin: "auto",
                            width: "100px",
                            borderRadius: "20px",
                            padding: "10px",
                            alignItems: "center",
                            justifyContent: "center",
                            right: "0",
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