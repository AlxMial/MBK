import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import { getCouponByID } from "@services/liff.services";
import { path } from "services/liff.services";
import Spinner from "components/Loadings/spinner/Spinner";
import QRCode from "react-qr-code";
import Barcode from "react-barcode";
import ImageUC from "components/Image/index";
// import { CopyToClipboard } from "react-copy-to-clipboard";
// components

const InfoCoupon = () => {
  const history = useHistory();
  let { id } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [isSelect, setisSelect] = useState(1);
  const [MyCoupon, setMyCoupon] = useState(null);
  const GetCouponByID = async () => {
    setIsLoading(true);
    getCouponByID(
      { Id: id },
      (res) => {
        if (res.data.status) {
          setMyCoupon(res.data.coupon);
        }
      },
      () => {},
      () => {
        setIsLoading(false);
      }
    );
  };
  useEffect(() => {
    GetCouponByID();
  }, []);
  return (
    <>
      {isLoading ? <Spinner customText={"Loading"} /> : null}
      {/* card */}
      <div style={{ height: "calc(50% - 100px)" }}>
        {MyCoupon != null ? (
          <div className="w-full absolute" style={{ height: "100%" }}>
            <div className="bg-green-mbk text-base">
              <div
                style={{
                  height: "10vh",
                  width: "70%",
                  margin: "auto",
                  lineHeight: "1.5",
                }}
                className=" noselect text-lg text-white font-bold text-center "
              >
                กรุณาแสดงรหัสนี้ให้แก่ร้านค้า
                <br /> เพื่อใช้สิทธิพิเศษของคุณ
              </div>
            </div>
            <div className="mb-4 mt-6" style={{ height: "100px" }}>
              {/* {MyCoupon} */}
              <div className="w-full flex px-2">
                <div style={{ width: "30%" }}>
                  <div style={{ width: "80px", height: "80%" }}>
                    <ImageUC
                      find={1}
                      relatedid={MyCoupon.redemptionCouponId}
                      relatedtable={["tbRedemptionCoupon"]}
                      alt="tbRedemptionCoupon"
                      className=" animated-img"
                    ></ImageUC>
                  </div>
                </div>
                <div className=" px-2 relative" style={{ width: "70%" }}>
                  <div className="w-full  font-bold line-clamp-2 text-base">
                    {" "}
                    {MyCoupon.couponName}{" "}
                  </div>
                  <div className="w-full absolute" style={{ bottom: "0" }}>
                    {"ใช้ " + MyCoupon.points + " คะแนน"}{" "}
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full flex mb-4">
              <div
                className={isSelect == 1 ? "font-bold" : ""}
                style={{
                  width: "50%",
                  textAlign: "center",
                  textDecoration: isSelect == 1 ? "underline" : "",
                }}
                onClick={() => {
                  setisSelect(1);
                }}
              >
                คิวอาร์โค้ด
              </div>
              <div
                className={isSelect == 2 ? "font-bold" : ""}
                style={{
                  width: "50%",
                  textAlign: "center",
                  textDecoration: isSelect == 2 ? "underline" : "",
                }}
                onClick={() => {
                  setisSelect(2);
                }}
              >
                บาร์โค้ด
              </div>
            </div>
            {isSelect == 1 ? (
              <div className="w-full  mb-4">
                <div
                  className="w-full flex  mb-2"
                  style={{ margin: "auto", justifyContent: "center" }}
                >
                  <QRCode size={100} value={MyCoupon.codeCoupon} />
                </div>
                <div className="mt-2 text-center">{MyCoupon.codeCoupon}</div>
              </div>
            ) : (
              <div className="w-full  mb-4">
                <div
                  className="w-full flex  mb-2"
                  style={{
                    margin: "auto",
                    justifyContent: "center",
                    width: "80%",
                  }}
                >
                  <Barcode
                    value={MyCoupon.codeCoupon}
                    displayValue={false}
                    width={2}
                    height={100}
                  />
                </div>
                <div
                  className="mt-2 text-center"
                  style={{
                    width: "70%",
                    justifyContent: "center",
                    margin: "auto",
                    wordBreak: "break-word",
                  }}
                >
                  {MyCoupon.codeCoupon}
                </div>
              </div>
            )}
          </div>
        ) : null}

        <div className="absolute w-full flex" style={{ bottom: "10px" }}>
          <div
            className=" w-full"
            style={{
              padding: "10px",
              margin: "auto",
              width: "50%",
            }}
          >
            <div
              className="flex bg-green-mbk text-white text-center text-lg  font-bold "
              style={{
                margin: "auto",
                height: "45px",
                borderRadius: "10px",
                padding: "5px",
                alignItems: "center",
                justifyContent: "center",
              }}
              onClick={() => {
                history.push(path.coupon);
              }}
            >
              {"ปิด"}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default InfoCoupon;
