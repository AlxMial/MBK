import React, { useState, useEffect } from "react";
// import { Tabs } from "antd";
import Canbeused from "./coupon.canbeused";
import Expire from "./coupon.expire";
import { useHistory } from "react-router-dom";
import {
  getMyCoupon
} from "@services/liff.services";

import Spinner from "components/Loadings/spinner/Spinner";
// components

const Product = () => {
  const history = useHistory();
  const [isLoading, setIsLoading] = useState(false);
  const [Tabs, setTabs] = useState(1);

  // const { TabPane } = Tabs;
  // const tabsChange = () => { };
  const [MyCoupon, setMyCoupon] = useState({ isdata: false, MyCoupon: [] });
  const GetMyCoupon = async () => {
    setIsLoading(true);
    getMyCoupon(
      (res) => {
        if (res.data.status) {
          setMyCoupon({ isdata: true, MyCoupon: res.data.coupon });
        }
      },
      () => { },
      () => {
        setIsLoading(false);
      }
    );
  };
  useEffect(() => {
    GetMyCoupon();
  }, []);
  return (
    <>
      {isLoading ? <Spinner customText={"Loading"} /> : null}
      {/* card */}
      <div style={{ marginTop: "-50px", position: "absolute", width: "100%" }}>
        <div className="line-text-brown noselect">
          <div className=" text-xl text-center mt-4">ของสมนาคุณของฉัน</div>
        </div>
      </div>
      <div>
        <div className="flex w-full" style={{ marginTop: "55px", height: "50px", fontSize: "18px" }}>
          <div className="flex" style={{
            width: "50%", textAlign: "center", justifyContent: "center",
            alignItems: "center",
            borderBottom: "5px solid " + (Tabs == 1 ? "#007a40" : "transparent")
          }} onClick={() => {
            setTabs(1)
          }}>ของสมนา</div>

        </div>
        <div className="line-scroll" style={{
          width: "90%", margin: "auto", height: "calc(100vh - 300px)",
          // overflow: "scroll"
        }}>
          {MyCoupon.isdata ?
            Tabs == 1 ?
              <Canbeused data={MyCoupon.MyCoupon} /> :
              <Expire data={MyCoupon.MyCoupon} />
            : null}
        </div>
      </div>
    </>
  );
};
export default Product;
