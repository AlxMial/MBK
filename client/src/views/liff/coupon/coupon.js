import React, { useState, useEffect } from "react";
import Canbeused from "./coupon.canbeused";
import Expire from "./coupon.expire";
import { getMyCoupon } from "@services/liff.services";
import { useDispatch } from "react-redux";
import { backPage } from "redux/actions/common";
import Spinner from "components/Loadings/spinner/Spinner";

const Coupon = () => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [Tabs, setTabs] = useState(1);

  const [MyCoupon, setMyCoupon] = useState({ isdata: false, MyCoupon: [] });
  const GetMyCoupon = async () => {
    setIsLoading(true);
    getMyCoupon(
      (res) => {
        if (res.data.status) {
          setMyCoupon({ isdata: true, MyCoupon: res.data.coupon });
        }
      },
      () => {},
      () => {
        setIsLoading(false);
      }
    );
  };
  useEffect(() => {
    dispatch(backPage(true));
    GetMyCoupon();
  }, []);
  return (
    <>
      {isLoading ? <Spinner customText={"Loading"} /> : null}
      <div className="bg-green-mbk">
        <div
          style={{ height: "40px" }}
          className=" noselect text-lg text-white font-bold text-center "
        >
          คูปองของฉัน
        </div>
      </div>
      <div>
        <div
          className="flex w-full"
          style={{ height: "50px", fontSize: "14px" }}
        >
          <div
            className={"flex" + (Tabs == 1 ? " font-bold" : "")}
            style={{
              width: "50%",
              textAlign: "center",
              justifyContent: "center",
              alignItems: "center",
              borderBottom:
                "5px solid " + (Tabs == 1 ? "#007a40" : "transparent"),
            }}
            onClick={() => {
              setTabs(1);
            }}
          >
            คูปองที่สามารถใช้ได้
          </div>
          <div
            className={"flex" + (Tabs == 2 ? " font-bold" : "")}
            style={{
              width: "50%",
              textAlign: "center",
              justifyContent: "center",
              alignItems: "center",
              borderBottom:
                "5px solid " + (Tabs == 2 ? "#007a40" : "transparent"),
            }}
            onClick={() => {
              setTabs(2);
            }}
          >
            คูปองที่หมดอายุ
          </div>
        </div>
        <div
          className="line-scroll"
          style={{
            width: "90%",
            margin: "auto",
            height: "calc(100vh - 190px)",
          }}
        >
          {MyCoupon.isdata ? (
            Tabs === 1 ? (
              <Canbeused data={MyCoupon.MyCoupon} />
            ) : (
              <Expire data={MyCoupon.MyCoupon} />
            )
          ) : null}
        </div>
      </div>
    </>
  );
};
export default Coupon;
