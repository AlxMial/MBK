import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { getRedemptionconditionshd } from "@services/liff.services";
import moment from "moment";
import Spinner from "components/Loadings/spinner/Spinner";
import MyPoint from "../myPointUC";
import ImageUC from "components/Image/index";
import { path } from "services/liff.services";
import EmptyOrder from "../emptyOrder";
import Error from "../error";
// components

const Reward = () => {
  const history = useHistory();
  const [isLoading, setIsLoading] = useState(false);
  const [Redemptionconditionshd, setRedemptionconditionshd] = useState([]);

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
      actionCallback: GetRedemptionconditionshd,
    });
  };

  const GetRedemptionconditionshd = async () => {
    setIsLoading(true);
    getRedemptionconditionshd(
      (res) => {
        if (res.status) {
          if (res.data.status) {
            setRedemptionconditionshd(res.data.Redemptionconditionshd);
          } else {
            setDataError();
          }
        } else {
          setDataError();
        }
        // if (res.data.status) {
        //   setRedemptionconditionshd(res.data.Redemptionconditionshd);
        // }
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
    GetRedemptionconditionshd();
  }, []);
  return (
    <>
      <Error data={modeldata} setmodeldata={setmodeldata} />
      {isLoading ? <Spinner customText={"Loading"} /> : null}
      {/* card */}
      <div style={{ position: "absolute", top: "90px", width: "100%" }}>
        <MyPoint />

        <div className="mt-8">
          <div style={{ width: "90%", margin: "auto" }}>
            <div className="flex h-10">
              <div className="bg-green-mbk" style={{ width: "10px" }}></div>
              <div className="text-ms" style={{ padding: "10px" }}>
                รางวัลที่สามารถแลกได้
              </div>
            </div>

            {Redemptionconditionshd.length > 0 ? (
              <div
                className="w-full line-scroll"
                style={{
                  margin: "auto",
                  height: "calc(100vh - 310px)",
                }}
              >
                {[...Redemptionconditionshd].map((e, i) => {
                  return (
                    <div
                      className=" mb-2"
                      style={{ display: "inline-block", width: "50%" }}
                      key={i}
                      onClick={() => {
                        history.push(path.inforeward.replace(":id", e.id));
                      }}
                    >
                      <div
                        className="w-ful"
                        style={{
                          width: "auto",
                          maxWidth: "80%",
                          height: "auto",
                          margin: "auto",
                        }}
                      >
                        {e.redemptionType == 1 ? (
                          <ImageUC
                            // style={{ width: "200px", height: "100px", }}
                            find={1}
                            relatedid={e.redemptionId}
                            relatedtable={[
                              e.rewardType == 1
                                ? "tbRedemptionCoupon"
                                : "tbRedemptionProduct",
                            ]}
                            alt="tbRedemptionProduct"
                            className=" animated-img"
                            imgclassname=" w-full h-full"
                          />
                        ) : (
                          <img
                            id={"img-gane-" + e.id}
                            className={"object-cover w-full h-ful"}
                            style={{ borderRadius: "15px" }}
                            src={require("assets/img/mbk/gameInfo.jpg").default}
                            onError={({ currentTarget }) => {
                              currentTarget.onerror = null;
                              currentTarget.src =
                                require("assets/img/mbk/no-image.png").default;
                            }}
                          ></img>
                        )}
                      </div>
                      <div
                        className="mt-2 text-ms mx-auto"
                        style={{ maxWidth: "80%" }}
                      >
                        <div className="flex justify-between items-center">
                          <div className="font-bold ">{e.redemptionName} </div>
                          <i className="fas fa-chevron-right"></i>
                        </div>
                        <div className="w-full text-liff-gray-mbk">
                          {e.points + " คะแนน"}{" "}
                        </div>
                        <div className="w-full text-liff-gray-mbk">
                          {"ใช้ได้ถึง " +
                            moment(e.endDate)
                              .locale("th")
                              .add("years", 543)
                              .format("DD MMM yyyy")}
                        </div>
                        <div className="liff-inline mb-2" />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div
                className="w-full line-scroll"
                style={{
                  width: "90%",
                  margin: "auto",
                  height: "calc(100vh - 310px)",
                }}
              >
                <div className="flex justify-center items-center h-full">
                  <div style={{ height: "50px" }}>
                    <EmptyOrder text={"ยังไม่มีรางวัลที่สามารถแลกได้"} />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
export default Reward;
