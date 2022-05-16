import React, { useState, useEffect } from "react";
import axios from "services/axios";
import { useHistory } from "react-router-dom";
import {
  path,
  checkRegister as apiCheckRegister,
  GetMemberpoints,
} from "@services/liff.services";
import { IsNullOrEmpty } from "@services/default.service";
import * as Session from "@services/Session.service";
import moment from "moment";

// components

const Point = () => {
  const history = useHistory();
  const [tbMember, settbMember] = useState({});
  const [Memberpoints, setMemberpoints] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const getMembers = async () => {
    axios
      .post("/members/checkRegister", { uid: Session.getLiff().uid })
      .then((res) => {
        console.log(res);
        if (res.data.code === 200) {
          settbMember(res.data.tbMember);
          getMemberpoints({ id: res.data.tbMember.id });
        } else {
        }
      });
  };

  const getMemberpoints = async (data) => {
    setIsLoading(true);
    GetMemberpoints(
      data,
      (res) => {
        if (res.data.code === 200) {
          setMemberpoints(res.data);
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
    getMemberpoints();
  }, []);
  return (
    <>
      {/* card */}
      <div style={{ marginTop: "-120px", position: "absolute", width: "100%" }}>
        <div className="line-text-brown">
          <div className=" text-lg text-center font-bold mt-4">คะแนนของฉัน</div>
          <div className="text-center mt-6">
            <div
              className="text-3xl font-bold"
              style={{
                backgroundColor: "#d0b027",
                height: "40px",
                width: "50%",
                margin: "auto",
                borderRadius: "20px",
                padding: "5px",
              }}
            >
              {tbMember.memberPoint === null ? 0 : tbMember.memberPoint}
            </div>
          </div>
          <div className=" text-sm font-bold text-center mt-4 ">
            {Memberpoints.memberpoints} คะแนน จะหมดอายุ{" "}
            {IsNullOrEmpty(Memberpoints.enddate)
              ? "-"
              : moment(Memberpoints.enddate.split("T")[0])
                  .locale("th")
                  .add(543, "year")
                  .format("DD/MM/yyyy")}
          </div>
        </div>

        <div className="mt-6">
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

        <div className="mt-4">
          <div style={{ width: "90%", margin: "auto" }}>
            <div className="flex h-10">
              <div className="bg-green-mbk" style={{ width: "10px" }}></div>
              <div style={{ padding: "10px" }}>ประวัติคะแนน</div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
};
export default Point;
