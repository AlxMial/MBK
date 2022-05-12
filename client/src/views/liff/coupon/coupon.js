import React, { useState, useEffect } from "react";
import axios from "services/axios";
import { Tabs } from "antd";
import Canbeused from "./coupon.canbeused";
import Expire from "./coupon.expire";
import { useHistory } from "react-router-dom";
import { path } from "../../../layouts/Liff";
import { IsNullOrEmpty } from "@services/default.service";
import * as Session from "@services/Session.service";
import moment from "moment";
// components

const Member = () => {
  const history = useHistory();
  const { TabPane } = Tabs;
  const tabsChange = () => {};
  const [tbMember, settbMember] = useState({});
  const getMembers = async () => {
    axios
      .post("/members/checkRegister", { uid: Session.getLiff().uid })
      .then((res) => {
        console.log(res);
        if (res.data.code === 200) {
          settbMember(res.data.tbMember);
        } else {
        }
      });
  };
  useEffect(() => {
    getMembers();
  }, []);
  return (
    <>
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
