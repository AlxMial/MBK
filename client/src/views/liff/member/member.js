import React, { useState, useEffect } from "react";
import { Tabs } from "antd";
import MyAward from "./member.myAward";
import MyOrder from "./member.myOrder";
import { useHistory } from "react-router-dom";
import {
  path,
  checkRegister as apiCheckRegister,
} from "@services/liff.services";
import { IsNullOrEmpty } from "@services/default.service";
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
    apiCheckRegister(
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
      {/* card */}
      {isLoading ? <Spinner customText={"Loading"} /> : null}
      <div className="noselect absolute w-full" style={{ marginTop: "-50px" }}>
        <div
          className=" flex margin-a"
          style={{
            width: "90%",
            padding: "20px",
            height: "180px",
            borderRadius: "10px",
            backgroundImage: `url(${
              IsNullOrEmpty(tbMember)
                ? null
                : require(tbMember.memberType === "1"
                    ? "assets/img/mbk/Green.png"
                    : tbMember.memberType === "2"
                    ? "assets/img/mbk/Silver.png"
                    : "assets/img/mbk/Gold.png").default
            })`,
            backgroundSize: "cover",
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
                    backgroundColor:
                      tbMember.memberType === "1"
                        ? "#cbe8ba"
                        : tbMember.memberType === "2"
                        ? "#ebebeb"
                        : "#f3eac1",
                    color:
                      tbMember.memberType === "1"
                        ? "#047738"
                        : tbMember.memberType === "2"
                        ? "#929292"
                        : "#d0af2c",
                    borderRadius: "20px",
                    paddingLeft: "10px",
                    paddingRight: "10px",
                  }}
                >
                  {tbMember.memberType === "1"
                    ? "Green MEMBER"
                    : tbMember.memberType === "2"
                    ? "Sliver MEMBER"
                    : "Gold MEMBER"}
                </div>
                <div className="text-white font-bold text-xs mt-2">
                  {tbMember.firstName + " " + tbMember.lastName}
                </div>
                <div className="flex">
                  <div>
                    <i
                      className="fas fa-solid fa-user"
                      style={{ color: "#faae3e" }}
                    ></i>
                  </div>
                  <div className="px-2 text-white font-bold text-xs ">
                    {tbMember.isMemberType === "1" ? "Retail" : "Wholesale"}
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute bottom-0 text-white font-bold text-xs ">
              {"Member Card : " + tbMember.memberCard}
            </div>
          </div>
          <div className="relative" style={{ width: "30%", height: "100%" }}>
            <div
              className="absolute right-0"
              onClick={() => {
                // updateprofile
                history.push(path.updateprofile);
              }}
            >
              <i className="fas fa-solid fa-pen text-white"></i>
            </div>
            <div className="absolute right-0 bottom-0">
              <div>
                <div className="flex" style={{ justifyContent: "right" }}>
                  <img
                    src={require("assets/img/mbk/Coint1.png").default}
                    alt="..."
                    className="w-5 h-5 rounded-full border-2 border-blueGray-50 shadow"
                  ></img>
                  <span className="text-white font-bold text-lg px-2 ">
                    {tbMember.memberPoint === null ? 0 : tbMember.memberPoint}
                  </span>
                </div>
              </div>
              <div className="text-right mt-2 "></div>
              <div className="text-right mt-2">
                <span className=" text-2xs text-white ">{"0 คะแนน  "}</span>
              </div>
              <div className="text-right ">
                <span className=" text-2xs text-white ">
                  {"จะหมดอายุ : " +
                    (IsNullOrEmpty(tbMember.memberPointExpire)
                      ? "-"
                      : moment(tbMember.memberPointExpire.split("T")[0])
                          .locale("th")
                          .add(543, "year")
                          .format("DD/MM/yyyy"))}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-2">
          <div
            className="bg-green-mbk flex text-white font-bold text-xs relative margin-a"
            style={{
              width: "90%",
              padding: "10px",
              height: "40px",
              borderRadius: "10px",
            }}
            onClick={() => {
              console.log("GetReward");
              history.push(path.getreward);
            }}
          >
            <div className="px-2">
              <i className="fas fa-solid fa-pen "></i>
            </div>
            <div className="">{"กรอกโค้ดเพื่อสะสมคะแนน"}</div>
            <div className="px-2 absolute right-0">
              <i className="fas fa-solid fa-angle-right "></i>
            </div>
          </div>
        </div>
        <div
          className="mt-2"
          style={{ height: "20px", backgroundColor: "#ebebeb" }}
        ></div>

        <Tabs
          className="Tabs-line noselect"
          defaultActiveKey="1"
          onChange={tabsChange}
        >
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
