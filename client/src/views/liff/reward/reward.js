import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import {
  getRedemptionconditionshd
} from "@services/liff.services";
import moment from "moment";
import Spinner from "components/Loadings/spinner/Spinner";
import MyPoint from "../myPointUC";
import ImageUC from "components/Image/index";
import { path } from "services/liff.services";
import EmptyOrder from "../emptyOrder";
// components

const Reward = () => {
  const history = useHistory();
  const [isLoading, setIsLoading] = useState(false);
  const [Redemptionconditionshd, setRedemptionconditionshd] = useState([]);
  const GetRedemptionconditionshd = async () => {
    setIsLoading(true);
    getRedemptionconditionshd(
      (res) => {
        if (res.data.status) {
          setRedemptionconditionshd(res.data.Redemptionconditionshd);
        }
      },
      () => { },
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
      {isLoading ? <Spinner customText={"Loading"} /> : null}
      {/* card */}
      <div style={{ marginTop: "-200px", position: "absolute", width: "100%" }}>
        <MyPoint />

        <div className="mt-2">
          <div style={{ width: "90%", margin: "auto" }}>
            <div className="flex h-10">
              <div className="bg-green-mbk" style={{ width: "10px" }}></div>
              <div className="text-ms" style={{ padding: "10px" }}>รางวัลที่สามารถแลกได้</div>
            </div>

            {Redemptionconditionshd.length > 0 ?
              <div className="w-full line-scroll" style={{ width: "90%", margin: "auto", height: "calc(100vh - 280px)" }}>
                {[...Redemptionconditionshd].map((e, i) => {
                  return (
                    <div className="w-full mb-2" key={i} onClick={() => {
                      history.push(path.inforeward.replace(":id", e.id))
                    }}>
                      <div className="w-ful" style={{ width: "200px", height: "100px", margin: "auto" }}>
                        <ImageUC
                          style={{ width: "200px", height: "100px", }}
                          find={1}
                          relatedid={e.redemptionId}
                          relatedtable={[(e.rewardType == 1 ? "tbRedemptionCoupon" : "tbRedemptionProduct")]}
                          alt="tbRedemptionProduct"
                          className=" animated-img"
                        />
                      </div>
                      <div className="mt-2 text-ms">
                        <div className="w-full font-bold mb-2 ">{e.redemptionName} </div>
                        <div className="w-full mb-2 text-liff-gray-mbk">{e.points + " คะแนน"} </div>
                        <div className="w-full mb-2 text-liff-gray-mbk">
                          {"ใช้ได้ถึง " + moment(e.endDate).locale("th").add("years", 543).format("DD MMM yyyy")}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
              :
              <EmptyOrder text={"ยังไม่มีรางวัลที่สามารถแลกได้"} />

            }
          </div>
        </div>
      </div>
    </>
  );
};
export default Reward;
