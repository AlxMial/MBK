import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import { getCouponByID, useCouponByID } from "@services/liff.services";
import { path } from "services/liff.services";
import ImageUC from "components/Image/index";
import Spinner from "components/Loadings/spinner/Spinner";
import ConfirmDialogNew from "components/ConfirmDialog/ConfirmDialogNew";
import { useDispatch } from "react-redux";
import { backPage } from "redux/actions/common";
import moment from "moment";

// components
const InfoCoupon = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  let { id } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [MyCoupon, setMyCoupon] = useState(null);
  const [isOpenDialog, setIsOpenDialog] = useState(false);
  const GetCouponByID = async () => {
    setIsLoading(true);
    getCouponByID(
      { Id: id },
      (res) => {
        if (res.data.status) {
          setMyCoupon(res.data.coupon);
        }
      },
      () => { },
      () => {
        setIsLoading(false);
      }
    );
  };

  const onConfirmDialog = () => {
    UseCouponByID(() => {
      setIsOpenDialog(false);
      history.push(path.usecouponUC.replace(":id", id));
    });
  };
  const UseCouponByID = (callback) => {
    useCouponByID(
      { Id: id },
      (res) => {
        if (res.data.status) {
          callback();
        }
      },
      () => { },
      () => {
        //   setIsLoading(false);
      }
    );
  };
  useEffect(() => {
    dispatch(backPage(true));
    GetCouponByID();
  }, []);
  return (
    <>
      {isOpenDialog && (
        <ConfirmDialogNew
          className={" liff-Dialog "}
          showModal={isOpenDialog}
          message={"ต้องการใช้คูปอง ใช่หรือไม่"}
          hideModal={() => {
            setIsOpenDialog(false);
          }}
          confirmModal={() => {
            onConfirmDialog();
          }}
        />
      )}
      {isLoading ? <Spinner customText={"Loading"} /> : null}
      {/* card */}
      <div style={{ height: "calc(50% - 160px)", backgroundColor: "#007a40" }}>
        {MyCoupon != null ? (
          <div className="w-full h-full absolute">
            <div className="mb-6" style={{ height: "150px" }}>
              <div style={{ width: "220px", height: "150px", margin: "auto" }}>
                <ImageUC
                  find={1}
                  relatedid={MyCoupon.redemptionCouponId}
                  relatedtable={["tbRedemptionCoupon"]}
                  alt="tbRedemptionCoupon"
                  className=" animated-img"
                ></ImageUC>
              </div>
            </div>
            <div
              className="px-8 py-2 line-scroll shadow-lg"
              style={{
                width: "90%",
                margin: "auto",
                borderRadius: "40px",
                height: "40%",
                backgroundColor: "#FFFFFF",
                // boxShadow: "0px -2px 10px 0px #aba6a6",
              }}
            >
              <div className="font-bold mt-2  mb-4 text-center text-xl">
                {MyCoupon.couponName}
              </div>
              <div
                className="mb-4"
                style={{ borderBottom: "1px solid #ddd" }}
              ></div>
              <div
                className="font-bold text-center mb-4"
                style={{ fontSize: "15px" }}
              >
                รายละเอียด
              </div>
              <div
                className="mb-4"
                style={{ borderBottom: "1px solid #ddd" }}
              ></div>
              <div
                className=""
                style={{ fontSize: "15px", minHeight: "150px" }}
              >
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                {MyCoupon.description}
              </div>
            </div>
          </div>
        ) : null}
        {MyCoupon != null && MyCoupon.isCouponStart ? (
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
                className="flex bg-green-mbk text-white text-center text-lg  font-bold bt-line"
                // style={{
                //   filter: MyCoupon.couponType ? "" : "grayscale(1)",
                //   opacity: MyCoupon.couponType ? "" : "0.5",
                // }}
                onClick={() => {
                  if (MyCoupon.couponType) {
                    setIsOpenDialog(true);
                  } else {
                    history.push(path.shopList);
                  }
                }}
              >
                {"ใช้คูปอง"}
              </div>
            </div>
          </div>
        ) : null}

        {MyCoupon && !MyCoupon.isCouponStart &&
          <div className="absolute w-full flex text-xs justify-center" style={{ bottom: "30px" }}>
            {`สามารถใช้คูปองได้ตั้งแต่วันที่  ${moment(MyCoupon.startDate).locale("th").add(543, "year").format("DD MMM YYYY")}`}
          </div>
        }
      </div>
    </>
  );
};
export default InfoCoupon;
