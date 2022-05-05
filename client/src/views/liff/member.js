import React, { useState } from "react";
import { Tabs } from "antd";
import MyAward from "./member.myAward";
import MyOrder from "./member.myOrder";
import { useHistory } from "react-router-dom";

// components

const Member = () => {
  const history = useHistory();
  const { TabPane } = Tabs;
  const tabsChange = () => {};
  const [point, setpoint] = useState(50);
  const [Expire, setExpire] = useState("01/05/2565");
  const [MemberCard, setMemberCard] = useState("111-111-111");
  const [member, setmember] = useState("Green MEMBER");
  const [memberName, setmemberName] = useState("แสนดี มีนานะชัย");
  const [membertype, setmembertype] = useState("Retail");

  return (
    <>
      {/* card */}
      <div style={{ marginTop: "-50px", position: "absolute", width: "100%" }}>
        <div
          className="bg-green-mbk flex"
          style={{
            width: "90%",
            padding: "10px",
            margin: "auto",
            height: "140px",
            borderRadius: "10px",
          }}
        >
          <div className="relative" style={{ width: "70%", height: "100%" }}>
            <div className="flex">
              <div style={{ width: "30%" }}>
                <img
                  src={require("assets/img/team-1-800x800.jpg").default}
                  alt="..."
                  className="w-15 h-15 rounded-full border-2 border-blueGray-50 shadow"
                ></img>
              </div>
              <div style={{ paddingLeft: "10px" }}>
                <div
                  className="mt-2 font-bold text-green-mbk"
                  style={{
                    backgroundColor: "#cbe8ba",
                    borderRadius: "20px",
                    paddingLeft: "10px",
                    paddingRight: "10px",
                  }}
                >
                  {member}
                </div>
                <div className="text-white font-bold text-xs mt-2">
                  {memberName}
                </div>
                <div className="flex">
                  <div>
                    <i
                      class="fas fa-solid fa-user"
                      style={{ color: "#084223" }}
                    ></i>
                  </div>
                  <div className="px-2 text-white font-bold text-xs ">
                    {membertype}
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute bottom-0 text-white font-bold text-xs ">
              {"Member Card : " + MemberCard}
            </div>
          </div>
          <div className="relative" style={{ width: "30%", height: "100%" }}>
            <div className="absolute right-0">
              <i class="fas fa-solid fa-pen text-white"></i>
            </div>
            <div className="absolute right-0 bottom-0">
              <div>
                <div>img point</div>
              </div>
              <div className="text-right">
                <span className="text-white font-bold text-lg ">{point}</span>
              </div>
              <div className="text-right">
                <span className=" text-ss text-white ">
                  {"Expire : " + Expire}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-2">
          <div
            className="bg-green-mbk flex text-white font-bold text-xs relative"
            style={{
              width: "90%",
              padding: "10px",
              margin: "auto",
              height: "40px",
              borderRadius: "10px",
            }}
            onClick={() => {
              console.log("GetReward");
              history.push("/line/getreward")
            }}
          >
            <div className="px-2">
              <i class="fas fa-solid fa-pen "></i>
            </div>
            <div className="">กรอกโค้ดเพื่อสะสมคะแนน</div>
            <div className="px-2 absolute right-0">
              <i class="fas fa-solid fa-angle-right "></i>
            </div>
          </div>
        </div>
        <div
          className="mt-2"
          style={{ height: "20px", backgroundColor: "#ebebeb" }}
        ></div>

        <Tabs className="Tabs-line" defaultActiveKey="1" onChange={tabsChange}>
          <TabPane tab="รางวัลของฉัน" key="1">
            <MyAward />
          </TabPane>
          <TabPane tab="คำสั่งชื้อของฉัน" key="2">
            <MyOrder />
          </TabPane>
        </Tabs>
      </div>
    </>
  );
};
export default Member;
