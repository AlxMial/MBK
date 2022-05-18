import React, { useState, useEffect } from "react";
import axios from "services/axios";
import { Tabs } from "antd";
import Canbeused from "./coupon.canbeused";
import Expire from "./coupon.expire";
import { useHistory } from "react-router-dom";
import {
  getMember,
} from "@services/liff.services";
import { IsNullOrEmpty } from "@services/default.service";
import * as Session from "@services/Session.service";
import moment from "moment";
import Spinner from "components/Loadings/spinner/Spinner";
// components

const Member = () => {
  const history = useHistory();
  const [isLoading, setIsLoading] = useState(false);
  const { TabPane } = Tabs;
  const tabsChange = () => {};
  const [tbMember, settbMember] = useState({});
  const getMembers = async () => {
    setIsLoading(true);
    getMember(
      (res) => {
        if (res.data.code === 200) {
          settbMember(res.data.tbMember);
        }
      },
      () => {},
      () => {
        setIsLoading(false);
      }
    );
  };
  useEffect(() => {
    getMembers();
  }, []);
  return (
    <>
      {isLoading ? <Spinner customText={"Loading"} /> : null}
      {/* card */}
      <div style={{ marginTop: "-100px", position: "absolute", width: "100%" }}>
        <div className="line-text-brown noselect">
          <div className=" text-xl text-center mt-4">คูปองของฉัน</div>
        </div>
        <div style={{ marginTop: "70px" }}>
          <Tabs
            className="Tabs-line noselect"
            defaultActiveKey="1"
            onChange={tabsChange}
          >
            <TabPane tab="คูปองที่สามารถใช้ได้" key="1">
              <Canbeused />
            </TabPane>
            <TabPane tab="คูปองที่หมดอายุ" key="2">
              <Expire />
            </TabPane>
          </Tabs>
        </div>
      </div>
    </>
  );
};
export default Member;
