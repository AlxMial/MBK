import React from "react";
import { path } from "services/liff.services";
import { useHistory } from "react-router-dom";

// components

const CouponSucceed = () => {
    const history = useHistory();
    return (
        <>
            <div style={{ height: "100%", backgroundColor: "#007a40" }}>
                <div className="w-full">
                    <div className="w-full flex mb-2" style={{ justifyContent: "center" }}>
                        <i className="fas fa-check-circle" style={{ color: "#FFFFFF", fontSize: "50px" }}></i>
                    </div>
                    <div className="w-full flex" style={{ justifyContent: "center", color: "#FFFFFF", fontSize: "50px" }}>
                        แลกสินค้าสำเร็จ
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
                                    height: "45px",
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
                                    height: "45px",
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