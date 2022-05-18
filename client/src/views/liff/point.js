import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { path, getMemberPointsList } from "@services/liff.services";
import { liff_dateToString } from "@services/default.service";
import Spinner from "components/Loadings/spinner/Spinner";
import MyPoint from "./myPointUC";
// components

const Point = () => {
  const history = useHistory();
  const [isLoading, setIsLoading] = useState(false);
  const [dataPoints, setDataPoints] = useState([]);
  const GetMemberPointsList = () => {
    setIsLoading(true);
    getMemberPointsList(
      (res) => {
        if (res.data.code === 200) {
          setDataPoints(res.data.tbMemberPoint);
        }
      },
      () => {},
      () => {
        setIsLoading(false);
      }
    );
  };
  useEffect(() => {
    GetMemberPointsList();
  }, []);
  return (
    <>
      {isLoading ? <Spinner customText={"Loading"} /> : null}
      {/* card */}
      <div className="absolute" style={{ marginTop: "-120px", width: "100%" }}>
        <MyPoint />
        <div className="mt-6">
          <div
            className="bg-green-mbk flex text-white font-bold text-xs relative "
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

        <div className="mt-4 ">
          <div
            style={{
              width: "90%",
              padding: "10px",
              margin: "auto",
              borderRadius: "10px",
              maxHeight: "330px",
              overflow: "scroll",
            }}
          >
            {[...dataPoints].map((e, i) => {
              let _coler = "123".includes(e.campaignType.toLowerCase())
                ? "#008000"
                : "red";

              return (
                <div key={i} className="mb-2">
                  <div className="flex relative">
                    <div style={{ width: "2.5rem" }}>
                      <img
                        src={require("assets/img/mbk/logo_bg_mkb.png").default}
                        alt="..."
                        className="w-10 h-10 rounded-full border-2 border-blueGray-50 shadow"
                      ></img>
                    </div>
                    <div
                      className=""
                      style={{ paddingLeft: "2rem", paddingTop: "10px" }}
                    >
                      {e.campaignType == "1"
                        ? "Code"
                        : e.campaignType == "2"
                        ? "Ecommerce"
                        : "Register"}
                    </div>
                    <div className="absolute" style={{ right: "0" }}>
                      <div
                        className="text-right font-bold"
                        style={{
                          color: _coler,
                        }}
                      >
                        {("123".includes(e.campaignType.toLowerCase())
                          ? "+"
                          : "-") + e.point}
                      </div>
                      <div className="text-2xs" style={{ color: "#aaa" }}>
                        {liff_dateToString(e.redeemDate, "DD MMM yyyy HH:mm")}
                      </div>
                    </div>
                  </div>
                  <div
                    className="mt-2"
                    style={{ width: "100%", borderBottom: "1px solid #eee" }}
                  ></div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};
export default Point;
