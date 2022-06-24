import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import {
    getMyCoupon
} from "@services/liff.services";

import Spinner from "components/Loadings/spinner/Spinner";
// components

const InfoCoupon = () => {
    const history = useHistory();
    const [isLoading, setIsLoading] = useState(false);
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
            <div style={{ height: "calc(50% - 100px)", backgroundColor: "#007a40" }}>
                <div className="w-full absolute" style={{ border: "1px solid", height: "100%" }}>
                    <div className="mb-4" style={{ height: "200px", border: "1px solid" }}> รูป </div>
                    <div className="px-8 py-2" style={{
                        width: "90%", margin: "auto",
                        borderRadius: "40px",
                        backgroundColor: "#FFFFFF",
                        border: "1px solid",
                        boxShadow: "0px -2px 10px 0px #aba6a6"
                    }}>

                        <div className="font-bold mt-4  mb-4 text-center" style={{ fontSize: "25px" }}>โค้ดส่วนลดมูลค่า 100 บาท</div>
                        <div className="mb-4" style={{ borderBottom: "1px solid #ddd" }}></div>
                        <div className="font-bold text-center mb-4" style={{ fontSize: "15px" }}>รายละเอียด</div>
                        <div className="mb-4" style={{ borderBottom: "1px solid #ddd" }}></div>
                        <div className="" style={{ fontSize: "15px" }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;โคดส่วนลดนี้ สามารถใช้เป็นส่วนลดสินค้ามูลค่า 100 บาท ต่อ 1 รายการสั่งซื้อ</div>
                    </div>
                </div>
            </div>

        </>
    );
};
export default InfoCoupon;
