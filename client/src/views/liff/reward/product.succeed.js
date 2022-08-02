import React from "react";
import { path } from "services/liff.services";
import { useHistory } from "react-router-dom";

// components

const CouponSucceed = () => {
    const history = useHistory();
    return (
        <>
            <div style={{ height: "100%" }} className="bg-green-mbk">
                <div className="w-full relative h-full">
                    <div className="success-reward absolute"
                        style={{
                            transform: "translate(50%,-50%)",
                            right: '50%',
                            top: 'calc(50% - 90px)'
                        }}>
                        <div className="w-full flex mb-2" style={{ justifyContent: "center" }}>
                            <i className="fas fa-check-circle text-white" style={{ fontSize: "50px" }}></i>
                        </div>
                        <div className="w-full flex text-xl font-bold text-white mt-4" style={{ justifyContent: "center" }}>
                            แลกสินค้าสำเร็จ
                        </div>
                    </div>
                </div>

                <div className="w-full" style={{ position: "absolute", bottom: "10px" }}>
                    <div className="w-full flex mb-2" style={{ justifyContent: "center" }}>
                        <div className=" w-full" style={{
                            padding: "10px", margin: "auto",
                            width: "50%"
                        }}>
                            <div
                                className="flex text-green-mbk text-center text-lg  font-bold "
                                style={{
                                    margin: "auto",
                                    height: "40px",
                                    borderRadius: "20px",
                                    padding: "5px",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    backgroundColor: "#FFFFFF"
                                }}
                                onClick={() => {
                                    history.push(path.product)
                                }}
                            >
                                {"ดูสินค้าของฉัน"}
                            </div>
                        </div>
                    </div>
                    <div className="w-full flex mb-2" style={{ justifyContent: "center" }}>
                        <div className=" w-full" style={{
                            padding: "10px", margin: "auto",
                            width: "50%"
                        }}>
                            <div
                                className="flex bg-green-mbk text-white text-center text-lg  font-bold "
                                style={{
                                    margin: "auto",
                                    height: "40px",
                                    borderRadius: "20px",
                                    padding: "5px",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    border: "1px solid #FFFFFF"
                                }}
                                onClick={() => {
                                    history.push(path.reward)

                                }}
                            >
                                {"กลับไปแลกรางวัล"}
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </>
    );
};
export default CouponSucceed;
