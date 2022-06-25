import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import {
    getCouponByID
} from "@services/liff.services";
import { path } from "services/liff.services";
import ImageUC from "components/Image/index";
import Spinner from "components/Loadings/spinner/Spinner";
// components

const InfoCoupon = () => {
    const history = useHistory();
    let { id } = useParams();
    const [isLoading, setIsLoading] = useState(false);
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
            () => { },
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
            <div style={{ height: "calc(50% - 100px)", backgroundColor: "#007a40" }}>
                {MyCoupon != null ?
                    <div className="w-full absolute" style={{ height: "100%" }}>
                        <div className="mb-4" style={{ height: "200px" }}>
                            <div style={{ width: "200px", height: "100px", margin: "auto" }}>
                                <ImageUC
                                    find={1}
                                    relatedid={MyCoupon.redemptionCouponId}
                                    relatedtable={["tbRedemptionCoupon"]}
                                    alt="tbRedemptionCoupon"
                                    className=" animated-img"
                                ></ImageUC>
                            </div>

                        </div>
                        <div className="px-8 py-2" style={{
                            width: "90%", margin: "auto",
                            borderRadius: "40px",
                            backgroundColor: "#FFFFFF",
                            boxShadow: "0px -2px 10px 0px #aba6a6"
                        }}>

                            <div className="font-bold mt-4  mb-4 text-center" style={{ fontSize: "25px" }}>{MyCoupon.couponName}</div>
                            <div className="mb-4" style={{ borderBottom: "1px solid #ddd" }}></div>
                            <div className="font-bold text-center mb-4" style={{ fontSize: "15px" }}>รายละเอียด</div>
                            <div className="mb-4" style={{ borderBottom: "1px solid #ddd" }}></div>
                            <div className="" style={{ fontSize: "15px", minHeight: "150px" }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{MyCoupon.description}</div>
                        </div>
                    </div> : null}

                <div className="absolute w-full flex" style={{ bottom: "10px" }}>
                    <div className=" w-full" style={{
                        padding: "10px", margin: "auto",
                        width: "50%"
                    }}>
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
                                history.push(path.usecouponUC.replace(":id", id))
                            }}
                        >
                            {"ใช้คูปอง"}
                        </div>
                    </div>

                </div>
            </div>

        </>
    );
};
export default InfoCoupon;
