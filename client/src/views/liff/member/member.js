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
import "./index.scss";
import { backPage } from "redux/actions/common";
import { useDispatch } from "react-redux";

// components

const Member = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const { TabPane } = Tabs;
  const tabsChange = (e) => {
    settabKey(e);
  };
  const [tabKey, settabKey] = useState(1);

  const [tbMember, settbMember] = useState({});
  const [Memberpoints, setMemberpoints] = useState({});
  const [isOpenPolicy, setisOpenPolicy] = useState(false);
  const [isError, setisError] = useState(false);
  const getMembers = async () => {
    setIsLoading(true);
    getMember(
      (res) => {
        if (res.status) {
          if (res.data.status) {
            settbMember(res.data.tbMember);
            getMemberpoints({ id: res.data.tbMember.id });
          } else {
            setisError(true);
          }
        } else {
          setisError(true);
        }
      },
      () => {
        setisError(true);
      },
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
    dispatch(backPage(false));
  }, []);

  return (
    <>
      {/* card */}
      {isLoading ? <Spinner customText={"Loading"} /> : null}
      <div className="noselect absolute w-full" style={{ top: "90px" }}>
        <div
          className=" flex margin-a shadow-2xl"
          style={{
            width: "90%",
            padding: "20px 15px",
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
          <div className="relative liff-member" style={{ maxWidth: "170px" }}>
            <div className="flex">
              <div style={{ width: "30%" }}>
                <img
                  src={
                    Session.getLiff().pictureUrl
                      ? Session.getLiff().pictureUrl
                      : require("assets/img/mbk/user-no-profile.png").default
                  }
                  alt="..."
                  className="w-15 h-15 mt-1  rounded-full border-2 border-blueGray-50 shadow"
                ></img>
              </div>
              <div style={{ paddingLeft: "10px" }}>
                <div
                  className="mt-2 font-bold text-green-mbk  relative flex items-center justify-center"
                  style={{
                    // fontSize: "0.7rem",
                    minWidth: "120px",
                    backgroundColor: isError
                      ? "#ffffff"
                      : tbMember.memberType === "1"
                        ? "#cbe8ba"
                        : tbMember.memberType === "2"
                          ? "#ebebeb"
                          : "#f3eac1",
                    color: isError
                      ? "#000000"
                      : tbMember.memberType === "1"
                        ? "#047738"
                        : tbMember.memberType === "2"
                          ? "#929292"
                          : "#d0af2c",
                    borderRadius: "20px",
                    // padding: "2px 10px",
                    height: "25px",
                    fontSize: "0.7rem",
                    lineHeight: 1,
                    // textAlign: "center",
                  }}
                >
                  <div className="member-label">
                    {isError
                      ? "-"
                      : tbMember.memberType === "1"
                        ? "GREEN MEMBER"
                        : tbMember.memberType === "2"
                          ? "SLIVER MEMBER"
                          : "GOLD MEMBER"}
                  </div>
                </div>
                <div className="text-white font-bold text-xs mt-2">
                  {isError ? "-" : tbMember.firstName + " " + tbMember.lastName}
                </div>
                <div
                  className="text-white font-bold text-xs mt-1"
                  style={{ position: "fixed" }}
                >
                  <span><i className="fas fa-phone-alt mr-1"></i></span> {isError ? "-" : "" + (tbMember.phone ? tbMember.phone.substring(0, tbMember.phone.length - 4) + 'XXXX' : '')}
                </div>
                <div className="flex">
                  <div></div>
                  <div className="px-2 text-white font-bold text-xs "></div>
                </div>
              </div>
            </div>
            <div
              className="absolute bottom-0 text-white font-bold text-xs "
              style={{ fontSize: "0.65rem" }}
            >
              {/* {"รหัสสมาชิก : " + tbMember.memberCard + " "+ width  + " "+ height } */}
              {"รหัสสมาชิก : " + (isError ? "-" : tbMember.memberCard)}
            </div>
          </div>
          <div
            className="relative"
            style={{ width: "calc(100% - 170px)", height: "100%" }}
          >
            <div
              className="absolute right-0"
              onClick={() => {
                // updateprofile
                if (!isError) {
                  history.push(path.updateprofile);
                }
              }}
            >
              <i className="fas fa-solid fa-pen text-white"></i>
            </div>
            <div className="absolute right-0 bottom-0">
              <div>
                <div className="flex justify-between">
                  <img
                    src={require("assets/img/mbk/Coint1.png").default}
                    alt="..."
                    className="w-6 h-6 rounded-full border-2 border-blueGray-50 shadow"
                  ></img>
                  <div className="text-white font-bold text-xl margin-auto-t-b">
                    {tbMember.memberPoint === null ? 0 : tbMember.memberPoint}
                  </div>
                </div>
              </div>
              <div className="text-right mt-2 "></div>
              <div className="text-right mt-2">
                <span className=" text-2xs text-white ">
                  {(isError ? "-" : tbMember.memberPoint) + " คะแนน  "}
                </span>
              </div>
              <div className="text-right ">
                <span className=" text-2xs text-white ">
                  {
                    "หมดอายุ : 31/12/2567" //+
                    // liff_dateToString(Memberpoints.enddate, "DD/MM/yyyy")
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
            className="bg-green-mbk flex items-center px-2 text-white font-bold text-xs relative margin-a shadow-2xl"
            style={{
              width: "90%",
              // padding: "10px",
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
          <TabPane tab="รางวัลของฉัน" key="1" className="tab-my-award">
            {tabKey == 1 ? <MyAward /> : null}
          </TabPane>
          <TabPane tab="คำสั่งชื้อของฉัน" key="2" className="tab-my-order">
            {tabKey == 2 ? <MyOrder /> : null}
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
