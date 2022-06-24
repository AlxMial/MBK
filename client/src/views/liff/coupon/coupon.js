import React, { useState, useEffect } from "react";
import { Tabs } from "antd";
import Canbeused from "./coupon.canbeused";
import Expire from "./coupon.expire";
import { useHistory } from "react-router-dom";
import {
  getMyCoupon
} from "@services/liff.services";

import Spinner from "components/Loadings/spinner/Spinner";
// components

const Coupon = () => {
  const history = useHistory();
  const [isLoading, setIsLoading] = useState(false);
  const { TabPane } = Tabs;
  const tabsChange = () => { };
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
          <div className=" text-xl text-center mt-4">คูปองของฉัน</div>
        </div>
        <div style={{ marginTop: "20px" }}>
          <Tabs
            className="Tabs-line noselect"
            defaultActiveKey="2"
            onChange={tabsChange}
          >
            <TabPane tab="คูปองที่สามารถใช้ได้" key="1">
              {MyCoupon.isdata ?
                <Canbeused data={MyCoupon.MyCoupon} />
                : null}
            </TabPane>
            <TabPane tab="คูปองที่หมดอายุ" key="2">
              <Expire data={MyCoupon.MyCoupon} />
            </TabPane>
          </Tabs>
        </div>
      </div>
    </>
  );
};
export default Coupon;
