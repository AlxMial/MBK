import React, { useState, useEffect } from "react";
import { IsNullOrEmpty } from "@services/default.service";
import moment from "moment";
import {
  getMember,
  getMemberpoints as getPoint,
} from "@services/liff.services";
// components

const MyPointUC = () => {
  const [tbMember, settbMember] = useState({});
  const [Memberpoints, setMemberpoints] = useState({});
  const getMembers = () => {
    getMember((res) => {
      if (res.data.code === 200) {
        settbMember(res.data.tbMember);
        getMemberpoints({ id: res.data.tbMember.id });
      }
    });
  };

  const getMemberpoints = async (data) => {
    getPoint((res) => {
      if (res.data.code === 200) {
        setMemberpoints(res.data);
      }
    });
  };
  useEffect(() => {
    getMembers();
  }, []);
  return (
    <>
      <div className="line-text-brown">
        <div className=" text-lg text-center font-bold mt-4">คะแนนของฉัน</div>
        <div className="text-center mt-6">
          <div
            className="text-3xl font-bold shadow-lg"
            style={{
              backgroundColor: "#d0b027",
              height: "45px",
              width: "50%",
              margin: "auto",
              borderRadius: "20px",

            }}
          >
            {/* <span className="text-shadow">{tbMember.memberPoint === null ? 0 : tbMember.memberPoint}</span> */}
            <span className="text-shadow">{0}</span>
          </div>
        </div>
        <div className=" text-sm font-bold text-center mt-4 ">
          {Memberpoints.memberpoints +
            " คะแนน จะหมดอายุ " +
            (IsNullOrEmpty(Memberpoints.enddate)
              ? "-"
              : moment(Memberpoints.enddate.split("T")[0])
                .locale("th")
                .add(543, "year")
                .format("DD/MM/yyyy"))}
        </div>
      </div>
    </>
  );
};

export default MyPointUC;
