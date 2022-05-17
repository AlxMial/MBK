import React, { useState, useEffect } from "react";
import axios from "services/axios";
import { useHistory } from "react-router-dom";
import {
  path,
  checkRegister as apiCheckRegister,
  GetMemberpoints,
} from "@services/liff.services";
import { IsNullOrEmpty } from "@services/default.service";
import moment from "moment";
import Spinner from "components/Loadings/spinner/Spinner";
// components

const Reward = () => {
  const history = useHistory();
  const [isLoading, setIsLoading] = useState(false);
  const [tbMember, settbMember] = useState({});
  const [Memberpoints, setMemberpoints] = useState({});
  const getMembers = async () => {
    setIsLoading(true);
    apiCheckRegister(
      (res) => {
        if (res.data.code === 200) {
          settbMember(res.data.tbMember);
          getMemberpoints({ id: res.data.tbMember.id });
        }
      },
      () => {},
      () => {
        setIsLoading(false);
      }
    );
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
      {isLoading ? <Spinner customText={"Loading"} /> : null}
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
        <div className="mt-10">
          <div style={{ width: "90%", margin: "auto" }}>
            <div className="flex h-10">
              <div className="bg-green-mbk" style={{ width: "10px" }}></div>
              <div style={{ padding: "10px" }}>รางวัลที่สามารถแลกได้</div>
            </div>
            <div>detail</div>
          </div>
        </div>
      </div>
    </>
  );
};
export default Reward;
