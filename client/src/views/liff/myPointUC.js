import React, { useState, useEffect } from "react";
import {
  getMember,
  getMemberpoints as getPoint,
} from "@services/liff.services";
// components

const MyPointUC = () => {
  const [tbMember, settbMember] = useState({});
  const [Memberpoints, setMemberpoints] = useState({});

  const [modeldata, setmodeldata] = useState({
    open: false,
    title: "",
    msg: "",
  }); // error ต่าง
  const [isError, setisError] = useState(false);
  const setDataError = () => {
    setisError(true);
    setmodeldata({
      open: true,
      title: "เกิดข้อผิดพลาด",
      msg: "กรุณาลองใหม่อีกครั้ง",
      actionCallback: getMembers,
    });
  };

  const getMembers = () => {
    getMember((res) => {
      if (res.status) {
        if (res.data.status) {
          settbMember(res.data.tbMember);
          getMemberpoints({ id: res.data.tbMember.id });
        } else {
          setDataError();
        }
      } else {
        setDataError();
      }
    });
  };

  const getMemberpoints = async (data) => {
    getPoint(
      (res) => {
        if (res.status) {
          if (res.data.status) {
            setMemberpoints(res.data);
          }
        } else {
          setDataError();
        }
      },
      () => {
        setDataError();
      }
    );
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
              backgroundColor: "#FFF",
              height: "45px",
              width: "50%",
              margin: "auto",
              borderRadius: "20px",
              color: "#007a40",
            }}
          >
            <span>
              {tbMember.memberPoint === null ? 0 : tbMember.memberPoint}
            </span>
          </div>
        </div>
        <div className=" text-sm font-bold text-center mt-4 ">
          {
            /*Memberpoints.memberpoints*/ tbMember.memberPoint +
              " คะแนน หมดอายุ 31/12/2567" // +
            // (IsNullOrEmpty(Memberpoints.enddate)
            // ? "-"
            // : moment(Memberpoints.enddate.split("T")[0])
            //   .locale("th")
            //   .add(543, "year")
            //   .format("DD/MM/yyyy"))
          }
        </div>
      </div>
    </>
  );
};

export default MyPointUC;
