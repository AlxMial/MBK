import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import {
    getMyCoupon
} from "@services/liff.services";
import { path } from "services/liff.services";
import Spinner from "components/Loadings/spinner/Spinner";
// components

const InfoCoupon = () => {
    const history = useHistory();
    const [isLoading, setIsLoading] = useState(false);
    const [isSelect, setisSelect] = useState(1);
    const [MyCoupon, setMyCoupon] = useState({ isdata: false, MyCoupon: [] });
    const GetMyCoupon = async () => {
        setIsLoading(true);
        getMyCoupon(
            (res) => {
                if (res.data.status) {
                    setMyCoupon({ isdata: true, MyCoupon: res.data.coupon });
                }
            },
            () => { },
            () => {
                setIsLoading(false);
            }
        );
    };
    useEffect(() => {
        GetMyCoupon();
    }, []);
    return (
        <>
            {isLoading ? <Spinner customText={"Loading"} /> : null}
            {/* card */}
            <div style={{ height: "calc(50% - 100px)" }}>
                <div className="w-full absolute" style={{ border: "1px solid", height: "100%" }}>
                    <div className="mb-4" style={{ height: "100px", border: "1px solid", backgroundColor: "#efefef" }}>
                        กรุณาแสดงรหัสนี้ให้แก่ร้านค้า เพื่อใช้สิทธิพิเศษของคุณ
                    </div>
                    <div className="mb-4" style={{ height: "100px", border: "1px solid" }}>
                        detail
                    </div>
                    <div className="w-full flex mb-4" style={{}}>
                        <div className={isSelect == 1 ? "font-bold" : ""} style={{ width: "50%", textAlign: "center", textDecoration: isSelect == 1 ? "underline" : "" }}
                            onClick={() => {
                                setisSelect(1)
                            }}>คิวอาร์โค้ด</div>
                        <div className={isSelect == 2 ? "font-bold" : ""} style={{ width: "50%", textAlign: "center", textDecoration: isSelect == 2 ? "underline" : "" }}
                            onClick={() => {
                                setisSelect(2)
                            }}>บาร์โค้ด</div>
                    </div>

                </div>



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
                                history.goBack()
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
