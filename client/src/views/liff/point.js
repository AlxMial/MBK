import React, { useState, useEffect } from "react";
import axios from "services/axios";
import { useHistory } from "react-router-dom";
import { path } from "../../layouts/Liff";
import { IsNullOrEmpty } from "../../services/default.service";
import * as Session from "../../services/Session.service";
import moment from "moment";
// components

const Member = () => {
  const history = useHistory();
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
      <div style={{ marginTop: "-150px", position: "absolute", width: "100%" }}>
        <div className="line-text-brown">
          <div className=" text-xl text-center mt-4">คะแนนของฉัน</div>
          <div className="text-center mt-6">
            <div
              className="text-4xl"
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
          <div className=" text-base text-center mt-4 ">
            250 คะแนน จะหมดอายุ 12/12/2565
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
              console.log("GetReward");
              history.push(path.getreward);
            }}
          >
            <div className="px-2">
              <i className="fas fa-solid fa-pen "></i>
            </div>
            <div className="">กรอกโค้ดเพื่อสะสมคะแนน</div>
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
            <div>detail</div>
          </div>
        </div>
      </div>
    </>
  );
};
export default Member;