import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { path, getMemberPointsList } from "@services/liff.services";
import { liff_dateToString } from "@services/default.service";
import Spinner from "components/Loadings/spinner/Spinner";
import MyPoint from "./myPointUC";
import Error from "./error";
import { backPage } from "redux/actions/common";
import { useDispatch } from "react-redux";
// components

const Point = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [dataPoints, setDataPoints] = useState([]);
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
      actionCallback: GetMemberPointsList,
    });
  };

  const GetMemberPointsList = () => {
    setIsLoading(true);
    getMemberPointsList(
      (res) => {
        if (res.status) {
          if (res.data.status) {
            setDataPoints(res.data.tbMemberPoint);
          } else {
            setDataError();
          }
        } else {
          setDataError();
        }
      },
      () => {
        setDataError();
      },
      () => {
        setIsLoading(false);
      }
    );
  };
  useEffect(() => {
    GetMemberPointsList();
    dispatch(backPage(false));
  }, []);
  return (
    <>
      <Error data={modeldata} setmodeldata={setmodeldata} />
      {isLoading ? <Spinner customText={"Loading"} /> : null}
      {/* card */}
      <div className="h-full absolute" style={{ top: "90px", width: "100%" }}>
        <MyPoint />
        <div className="mt-8">
          <div
            className="bg-green-mbk flex text-white font-bold text-xs relative items-center"
            style={{
              width: "90%",
              padding: "10px",
              margin: "auto",
              height: "40px",
              borderRadius: "10px",
              lineHeight: "initial",
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

        <div className="mt-4">
          <div style={{ width: "90%", margin: "auto" }}>
            <div className="flex h-10">
              <div className="bg-green-mbk" style={{ width: "10px" }}></div>
              <div style={{ padding: "10px" }}>ประวัติคะแนน</div>
            </div>
          </div>
        </div>

        <div className="mt-4 h-full ">
          <div
            className="line-scroll"
            style={{
              width: "90%",
              padding: "0 10px",
              margin: "auto",
              height: "calc(100% - 365px)",
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
                        ? "กรอก Code จากสินค้า"
                        : e.campaignType == "2"
                          ? "ซื้อสินค้าออนไลน์"
                          : e.campaignType == "3"
                            ? "สมัครสมาชิก"
                            : "แลกรางวัล"}
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
                          : "") + e.point}
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
            <div className="w-full" style={{ height: '110px' }}></div>
          </div>
        </div>
      </div>
    </>
  );
};
export default Point;
