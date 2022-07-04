import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { path } from "services/liff.services";
import Spinner from "components/Loadings/spinner/Spinner";
import { getMyReward } from "@services/liff.services";
import ImageUC from "components/Image/index";
import moment from "moment";
import EmptyOrder from "../emptyOrder";
import useWindowDimensions from "services/useWindowDimensions";
// components

const MyAward = () => {
  const { width, height } = useWindowDimensions();
  const history = useHistory();
  const [isLoading, setIsLoading] = useState(false);

  const [couponItem, setcouponItem] = useState([]);
  const [productItem, setproductItem] = useState([]);

  const GetMyReward = () => {
    setIsLoading(true);
    getMyReward(
      (res) => {
        if (res.status) {
          console.log('res.data.product', res.data.coupon)
          setcouponItem(res.data.coupon);
          setproductItem(res.data.product);
        }
      },
      () => { },
      () => {
        setIsLoading(false);
      }
    );
  };
  useEffect(() => {

    GetMyReward();
  }, []);

  return (
    <>
      {isLoading ? <Spinner customText={"Loading"} /> : null}
      <div
        className="mt-2 line-scroll liff-footer"
        style={{ padding: "10px" }}
      >
        <div
          className="flex relative"
          style={{ height: "40px", fontSize: "13px" }}
        >
          <div className="text-green-mbk font-bold" style={{ width: "50%" }}>
            คูปองของฉัน
          </div>

          <div
            className="text-liff-gray-mbk text-xs"
            style={{ width: "50%", textAlign: "end" }}
            onClick={() => {
              history.push(path.coupon);
            }}
          >
            {"ทั้งหมด >"}
          </div>
        </div>

        {couponItem.length > 0 ? (
          couponItem.map((e, i) => {
            return (
              <div key={i}>
                <div className="w-full flex mb-2" onClick={() => {
                  history.push(path.infocoupon.replace(":id", e.couponId))
                }}>
                  <div
                    className="flex mr-4"
                    style={{ justifyContent: "center" }}
                  >
                    <div style={{ width: "120px", height: "70px" }}>
                      <ImageUC
                        find={1}
                        relatedid={e.id}
                        relatedtable={["tbRedemptionCoupon"]}
                        alt="flash_sale"
                        className=" border-2 border-blueGray-50 animated-img"
                        imgclassname=" w-full h-full object-cover"
                      ></ImageUC>
                    </div>
                  </div>
                  <div className="flex flex-col pt-2 justify-between" >
                    <div className="font-bold line-clamp-1 text-12">
                      {" "}
                      {e.couponName}
                    </div>
                    <div
                      className="text-liff-gray-mbk text-12"
                    >
                      {"ใช้ได้ถึง " +
                        moment(e.expiredDate)
                          .locale("th")
                          .add(543, "years")
                          .format("DD MMM YYYY")}
                    </div>
                  </div>
                </div>
                {i === 0 && couponItem.length > 1 ? <div className="liff-inline mb-2" /> : null}
              </div>
            );
          })
        ) : (
          <div style={{ height: "50px" }}>
            <EmptyOrder text={"ยังไม่มีคูปองที่ใช้งานได้"} />
          </div>
        )}
        <div className="liff-inline mb-2" />
        <div
          className="flex relative"
          style={{ height: "40px", fontSize: "12px" }}
        >
          <div className="text-green-mbk font-bold" style={{ width: "50%" }}>
            ของสมนาคุณของฉัน
          </div>
          <div
            className="text-liff-gray-mbk text-xs"
            style={{ width: "50%", textAlign: "end" }}
            onClick={() => {
              history.push(path.product);
            }}
          >
            {"ทั้งหมด >"}
          </div>
        </div>

        {productItem.length > 0 ? (
          productItem.map((e, i) => {
            return (
              <div key={i}>
                <div className="w-full flex" onClick={() => {
                  history.push(path.infoproduct.replace(":id", e.productId))
                }}>
                  <div
                    className="flex"
                    style={{ width: "30%", justifyContent: "center" }}
                  >
                    <div style={{ width: "80px", height: "80px" }}>
                      <ImageUC
                        find={1}
                        relatedid={e.id}
                        relatedtable={["tbRedemptionProduct"]}
                        alt="flash_sale"
                        className=" border-2 border-blueGray-50 animated-img"
                      ></ImageUC>
                    </div>
                  </div>
                  <div className="relative" style={{ width: "70%" }}>
                    <div className="font-bold line-clamp-1 text-12">
                      {" "}
                      {e.productName}
                    </div>
                    <div
                      className="absolute w-full text-liff-gray-mbk"
                      style={{ bottom: "0" }}
                    >
                      <div
                        className="flex relative w-full text-12"
                        style={{ color: e.status < 3 ? "#c7b15e" : "#007a40" }}
                      >
                        {e.status == 1 ? (
                          <i
                            className="flex fas fa-hourglass-end  px-2"
                            style={{ alignItems: "center" }}
                          ></i>
                        ) : e.status == 2 ? (
                          <i
                            className="flex fas fa-truck px-2"
                            style={{ alignItems: "center" }}
                          ></i>
                        ) : (
                          <i
                            className="flex fas fa-check-circle px-2"
                            style={{ alignItems: "center" }}
                          ></i>
                        )}

                        <div>
                          {e.status == 1
                            ? "เตรียมจัดส่ง"
                            : e.status == 2
                              ? "อยู่ระหว่างจัดส่ง"
                              : "ส่งแล้ว"}
                        </div>
                        {e.trackingNo != null ? (
                          <div className="absolute" style={{ right: "0" }}>
                            {e.trackingNo}
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </div>
                {i === 0 && productItem.length > 1 ? <div className="liff-inline mb-2" /> : null}
              </div>
            );
          })
        ) : (
          <div className="flex justify-center items-center mt-10">
            <div style={{ height: "50px" }}>
              <EmptyOrder text={"ยังไม่มีของสมนาคุณ"} />
            </div>
          </div>
        )}
      </div>
    </>
  );
};
export default MyAward;
