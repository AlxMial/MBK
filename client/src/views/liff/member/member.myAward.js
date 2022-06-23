import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { path } from "services/liff.services";
import Spinner from "components/Loadings/spinner/Spinner";
import {
  getMyReward
} from "@services/liff.services";
import ImageUC from "components/Image/index";
import moment from "moment";
// components

const MyAward = () => {
  const history = useHistory();
  const [isLoading, setIsLoading] = useState(false);


  const [couponItem, setcouponItem] = useState([]);
  const [productItem, setproductItem] = useState([]);

  const GetMyReward = () => {
    setIsLoading(true)
    getMyReward((res) => {
      if (res.status) {
        setcouponItem(res.data.coupon)
        setproductItem(res.data.product)
      }
    }, () => { }, () => { setIsLoading(false) })
  }
  useEffect(() => {
    GetMyReward()
  }, []);

  return (
    <>
      {isLoading ? <Spinner customText={"Loading"} /> : null}
      <div className="mt-2 line-scroll" style={{ padding: "10px", height: "calc(100vh - 490px)" }}>
        <div className="flex relative" style={{ height: "40px", fontSize: "14px" }}>
          <div className="text-green-mbk font-bold" style={{ width: "50%" }}>
            คูปองของฉัน
          </div>

          <div style={{ width: "50%", textAlign: "end", color: "#ddd" }} onClick={() => {
            history.push(path.coupon)
          }}>{"ดูทั้งหมด >"}</div>
        </div>

        {couponItem != null ?
          couponItem.map((e, i) => {
            return (
              <div className="w-full flex mb-2">
                <div className="flex" style={{ width: "30%", justifyContent: "center" }}>
                  <div style={{ width: "80px", height: "80px" }}>
                    <ImageUC
                      find={1}
                      relatedid={e.id}
                      relatedtable={["stock1"]}
                      alt="flash_sale"
                      className=" border-2 border-blueGray-50 animated-img"
                    ></ImageUC>
                  </div>
                </div>
                <div className="relative" style={{ width: "70%" }}>
                  <div> {e.name}</div>
                  <div className="absolute" style={{ bottom: "0", color: "#ddd" }}> {"ใช้ได้ถึง " + moment(e.EndDate).locale("th").add("years", 543).format("DD MMM YYYY")}</div>
                </div>
              </div>
            )
          })
          : null}

        <div className="flex relative" style={{ height: "40px", fontSize: "14px" }}>
          <div className="text-green-mbk font-bold" style={{ width: "50%" }}>
            ของสัมนาคุณของฉัน
          </div>
          <div style={{ width: "50%", textAlign: "end", color: "#ddd" }} onClick={() => {
            history.push(path.myorder.replace(":id", "1"))
          }}>{"ดูทั้งหมด >"}</div>
        </div>

        {productItem != null ?
          productItem.map((e, i) => {
            return (
              <div className="w-full flex mb-2">
                <div className="flex" style={{ width: "30%", justifyContent: "center" }}>
                  <div style={{ width: "80px", height: "80px" }}>
                    <ImageUC
                      find={1}
                      relatedid={e.id}
                      relatedtable={["stock1"]}
                      alt="flash_sale"
                      className=" border-2 border-blueGray-50 animated-img"
                    ></ImageUC>
                  </div>
                </div>
                <div className="relative" style={{ width: "70%" }}>
                  <div> {e.name}</div>
                  <div className="absolute" style={{ bottom: "0", color: "#ddd" }}> {"ใช้ได้ถึง " + moment(e.EndDate).locale("th").add("years", 543).format("DD MMM YYYY")}</div>
                </div>
              </div>
            )
          })
          : null}

      </div>
    </>
  );
};
export default MyAward;

