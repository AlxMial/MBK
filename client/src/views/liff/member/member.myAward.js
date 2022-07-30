import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { path } from "services/liff.services";
import Spinner from "components/Loadings/spinner/Spinner";
import { getMyReward } from "@services/liff.services";
import ImageUC from "components/Image/index";
import moment from "moment";
import EmptyOrder from "../emptyOrder";
import Error from "../error";
// components

const MyAward = () => {
  const history = useHistory();
  const [isLoading, setIsLoading] = useState(false);
  const [couponItem, setcouponItem] = useState([]);
  const [productItem, setproductItem] = useState([]);

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
      actionCallback: GetMyReward,
    });
  };
  const GetMyReward = () => {
    setIsLoading(true);
    getMyReward(
      (res) => {
        if (res.status) {
          if (res.data.status) {
            setisError(false);
            // console.log('couponItem', res.data.coupon);
            setcouponItem(res.data.coupon);
            setproductItem(res.data.product);
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
    GetMyReward();
  }, []);

  return (
    <>
      <Error data={modeldata} setmodeldata={setmodeldata} />
      {isLoading ?? <Spinner customText={"Loading"} />}
      {isError ? (
        <div
          className="mt-2 line-scroll liff-footer"
          style={{ padding: "10px" }}
        ></div>
      ) : (
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
                  <div
                    className="w-full flex mb-2"
                    onClick={() => {
                      history.push(path.infocoupon.replace(":id", e.couponId));
                    }}
                  >
                    <div
                      className="flex mr-8 pl-2"
                      style={{ justifyContent: "center" }}
                    >
                      <div style={{ width: "140px", height: "80px" }}>
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
                    <div className="flex flex-col pt-2 justify-between">
                      <div className="font-bold line-clamp-2 text-12">
                        {" "}
                        {e.couponName}
                      </div>
                      <div className="text-liff-gray-mbk text-12">
                        {(!e.expiredDate ? "ไม่หมดอายุ" :
                          "ใช้ได้ถึง " +
                          moment(e.expiredDate)
                            .locale("th")
                            .add(543, "years")
                            .format("DD MMM YYYY"))}
                      </div>
                    </div>
                  </div>
                  {i === 0 && couponItem.length > 1 ? (
                    <div className="liff-inline mb-2" />
                  ) : null}
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
                  <div
                    className="w-full flex"
                    onClick={() => {
                      history.push(
                        path.infoproduct.replace(":id", e.productId)
                      );
                    }}
                  >
                    <div
                      className="flex mr-8 pl-2"
                      style={{ justifyContent: "center" }}
                    >
                      <div style={{ width: "140px", height: "80px" }}>
                        <ImageUC
                          find={1}
                          relatedid={e.id}
                          relatedtable={["tbRedemptionProduct"]}
                          alt="flash_sale"
                          className="  animated-img"
                          imgclassname={"flex"}
                        ></ImageUC>
                      </div>
                    </div>
                    <div
                      className="flex flex-col pt-2 justify-between relative"
                      style={{ width: "calc(100% - 140px - 2rem)" }}
                    >
                      <div className="font-bold line-clamp-2 text-12">
                        {e.productName}
                      </div>
                      <div
                        className="absolute w-full text-liff-gray-mbk"
                        style={{ bottom: "0" }}
                      >
                        <div
                          className="relative w-full text-12 "
                          style={{
                            color: e.status < 3 ? "#c7b15e" : "#007a40",
                          }}
                        >
                          <div className="sec-left flex">
                            {e.status == 1 ? (
                              <i
                                className="flex fas fa-hourglass-end  mr-2"
                                style={{ alignItems: "center" }}
                              ></i>
                            ) : e.status == 2 ? (
                              <i
                                className="flex fas fa-truck mr-2"
                                style={{ alignItems: "center" }}
                              ></i>
                            ) : (
                              <i
                                className="flex fas fa-check-circle mr-2"
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
                          </div>
                          {e.trackingNo != null ? (
                            <div className="sec-right flex items-center line-clamp-1">
                              <span className="mr-2"><i
                                className="fas fa-box-open"
                                style={{ alignItems: "center" }}
                              ></i></span>
                              {e.trackingNo}
                            </div>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  </div>
                  {i === 0 && productItem.length > 1 ? (
                    <div className="liff-inline mb-2" />
                  ) : null}
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
      )}
    </>
  );
};
export default MyAward;
