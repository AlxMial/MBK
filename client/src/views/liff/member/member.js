import React, { useState, useEffect } from "react";
import { Tabs } from "antd";
import MyAward from "./member.myAward";
import MyOrder from "./member.myOrder";
import { useHistory } from "react-router-dom";
import {
  path,
  getMember,
  getMemberpoints as getPoint,
} from "@services/liff.services";
import { IsNullOrEmpty, liff_dateToString } from "@services/default.service";
import Spinner from "components/Loadings/spinner/Spinner";
import * as Session from "@services/Session.service";
import ModelPolicy from "./modelpolicy";
import './index.scss';


// components

const Member = () => {
  const history = useHistory();
  const [isLoading, setIsLoading] = useState(false);
  const { TabPane } = Tabs;
  const tabsChange = () => { };
  const [tbMember, settbMember] = useState({});
  const [Memberpoints, setMemberpoints] = useState({});
  const [isOpenPolicy, setisOpenPolicy] = useState(false);

  const getMembers = async () => {
    setIsLoading(true);
    getMember(
      (res) => {
        if (res.data.code === 200) {
          settbMember(res.data.tbMember);
          getMemberpoints({ id: res.data.tbMember.id });
        }
      },
      () => { },
      () => {
        setIsLoading(false);
      }
    );
  };
  const getMemberpoints = async (data) => {
    setIsLoading(true);
    getPoint(
      (res) => {
        if (res.data.code === 200) {
          setMemberpoints(res.data);
        }
      },
      () => { },
      () => {
        setIsLoading(false);
      }
    );
  };
  useEffect(() => {
    getMembers();
    getMemberpoints();
  }, []);
  return (
    <>
      {/* card */}
      {isLoading ? <Spinner customText={"Loading"} /> : null}
      <div className="noselect absolute w-full" style={{ marginTop: "-99px" }}>
        <div
          className=" flex margin-a shadow-2xl"
          style={{
            width: "90%",
            padding: "20px",
            height: "180px",
            borderRadius: "15px",
            backgroundColor: "#007A40",
            border: "2px solid white",
            backgroundImage: `url(${IsNullOrEmpty(tbMember)
              ? null
              : require("assets/img/mbk/Green.png").default
              // : require(tbMember.memberType === "1"
              //     ? "assets/img/mbk/Green.png"
              //     : tbMember.memberType === "2"
              //     ? "assets/img/mbk/Silver.png"
              //     : "assets/img/mbk/Gold.png").default
              })`,
            // backgroundSize: "cover",
            // objectFit: "cover",
          }}
        >
          <div className="relative liff-member">
            <div className="flex">
              <div style={{ width: "30%" }}>
                <img
                  src={
                    Session.getLiff().pictureUrl
                      ? Session.getLiff().pictureUrl
                      : require("assets/img/mbk/user-no-profile.png").default
                  }
                  alt="..."
                  className="w-15 h-15 rounded-full border-2 border-blueGray-50 shadow"
                ></img>
              </div>
              <div style={{ paddingLeft: "10px" }}>
                <div
                  className="mt-2 font-bold text-green-mbk text-xs"
                  style={{
                    // fontSize: "0.7rem",
                    minWidth: "120px",
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
                    padding: "2px 10px",
                    textAlign: "center",
                  }}
                >
                  {tbMember.memberType === "1"
                    ? "GREEN MEMBER"
                    : tbMember.memberType === "2"
                      ? "SLIVER MEMBER"
                      : "GOLD MEMBER"}
                </div>
                <div className="text-white font-bold text-xs mt-2">
                  {tbMember.firstName + " " + tbMember.lastName}
                </div>
                <div className="flex">
                  <div>
                    {/* <i
                      className="fas fa-solid fa-user"
                      style={{ color: "#faae3e" }}
                    ></i> */}
                  </div>
                  <div className="px-2 text-white font-bold text-xs ">
                    {/* {tbMember.isMemberType === "1" ? "Retail" : "Wholesale"} */}
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute bottom-0 text-white font-bold text-xs ">
              {/* {"รหัสสมาชิก : " + tbMember.memberCard + " "+ width  + " "+ height } */}
              {"รหัสสมาชิก : " + tbMember.memberCard}
            </div>
          </div>
          <div className="relative" style={{ width: "50%", height: "100%" }}>
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
                    className="w-6 h-6 rounded-full border-2 border-blueGray-50 shadow"
                  ></img>
                  <span className="text-white font-bold text-xl pl-2 margin-auto-t-b">
                    {tbMember.memberPoint === null ? 0 : tbMember.memberPoint}
                  </span>
                </div>
              </div>
              <div className="text-right mt-2 "></div>
              <div className="text-right mt-2">
                <span className=" text-2xs text-white ">
                  {/*Memberpoints.memberpoints*/0 + " คะแนน  "}
                </span>
              </div>
              <div className="text-right ">
                <span className=" text-2xs text-white ">
                  {
                    "จะหมดอายุ : " +
                    liff_dateToString(Memberpoints.enddate, "DD/MM/yyyy")
                    // (IsNullOrEmpty(Memberpoints.enddate)
                    //   ? "-"
                    //   : moment(Memberpoints.enddate.split("T")[0])
                    //       .locale("th")
                    //       .format("DD/MM/yyyy"))
                  }
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-2">
          <div
            className="bg-green-mbk flex text-white font-bold text-xs relative margin-a shadow-2xl"
            style={{
              width: "90%",
              padding: "10px",
              height: "40px",
              marginTop: "-2px",
              borderRadius: "10px",
            }}
            onClick={() => {
              history.push(path.getreward);
            }}
          >
            <div className="px-2">
              <i className="fas fa-solid fa-pen "></i>
            </div>
            <div className="">{"กรอกโค้ดเพื่อสะสมคะแนน"}</div>
            <div className="px-4 absolute right-0">
              <i className="fas fa-solid fa-angle-right "></i>
            </div>
          </div>
        </div>
        <div
          className="mt-2"
          style={{ height: "10px", backgroundColor: "#ebebeb" }}
        ></div>
        <Tabs
          className="Tabs-line noselect m-0"
          defaultActiveKey="1"
          onChange={tabsChange}
        >
          <TabPane tab="รางวัลของฉัน" key="1" className="font-bold" style={{ fontSize: '14px' }}>
            <MyAward />
          </TabPane>
          <TabPane tab="คำสั่งชื้อของฉัน" key="2" className="font-bold" style={{ fontSize: '14px' }}>
            <MyOrder />
          </TabPane>
        </Tabs>
        <div
          className="flex"
          style={{
            height: "50px",
            backgroundColor: "#047a40",
            fontSize: "10px",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div>
            <div style={{ color: "#FFF", textAlign: "center" }}>
              ©2022 Mahboonkrong Rice, All Rights Reserved.
            </div>
            <div
              className="flex"
              style={{
                color: "#FFF",
                textAlign: "center",
                justifyContent: "center",
              }}
            >
              {/* <div className="text-underline" onClick={() => {
                setIsLoading(true);
                window.location.href = 'https://www.prg.co.th/th/privacy_policy'
              }} >นโยบายความเป็นส่วนตัว</div> */}

              <a
                className="text-underline"
                style={{ color: "white" }}
                href="https://www.prg.co.th/th/privacy_policy"
                target="_blank"
              >
                นโยบายความเป็นส่วนตัว
              </a>
              <div className="px-2">•</div>
              <div
                className="text-underline"
                onClick={() => {
                  setisOpenPolicy(true);
                }}
              >
                ข้อกำหนดและเงื่อนไข
              </div>
            </div>
          </div>
        </div>
      </div>

      <ModelPolicy
        isOpen={isOpenPolicy}
        closemodel={() => {
          setisOpenPolicy(false);
        }}
      />
    </>
  );
};
export default Member;
