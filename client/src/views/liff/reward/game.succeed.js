import React from "react";
import { path } from "services/liff.services";
import { useHistory } from "react-router-dom";
import ImageUC from "components/Image/index";
// components

const GameSucceed = ({ data }) => {
    const history = useHistory();
    return (
        <>
            <div style={{ height: "100%", backgroundColor: "#007a40" }}>
                {data != null ?
                    <div className="w-full" style={{ height: "100%" }}>

                        <div className="w-full flex" style={{ justifyContent: "center", color: "#FFFFFF", fontSize: "50px" }}>
                            ยินดีด้วย
                        </div>
                        <div className="w-full flex" style={{ justifyContent: "center", color: "#FFFFFF", fontSize: "40px" }}>
                            ได้รับ
                        </div>
                        <div className="w-full flex" style={{
                            justifyContent: "center", margin: "auto", width: "200px", height: "200px"
                        }}>
                            <div style={{ width: "200px", height: "200px", margin: "auto" }}>
                                <ImageUC
                                    find={1}
                                    relatedid={data.id}
                                    relatedtable={[(data.type == "Coupon" ? "tbRedemptionCoupon" : "tbRedemptionProduct")]}
                                    alt="img"
                                    className=" animated-img"
                                ></ImageUC>
                            </div>
                        </div>

                        <div className="flex line-clamp-1" style={{
                            justifyContent: "center", color: "#FFFFFF", fontSize: "30px",
                            width: "90%",
                            margin: "auto"
                        }}>
                            {data.name}
                        </div>
                        <div style={{ height: "calc(100% - 600px)" }}>
                            <div className="px-8 py-2" style={{
                                width: "90%", margin: "auto",
                                borderRadius: "40px",
                                backgroundColor: "#FFFFFF",
                                boxShadow: "0px -2px 10px 0px #aba6a6",
                                height: "100%"
                            }}>

                                <div className="font-bold text-center mb-4" style={{ fontSize: "15px" }}>รายละเอียด</div>
                                <div className="mb-4" style={{ borderBottom: "1px solid #ddd" }}></div>
                                <div className="" style={{
                                    fontSize: "15px", 
                                    height: "calc(100% - 100px)", 
                                    wordBreak: "break-all",
                                    overflow: "scroll"
                                }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{data.description}</div>
                                {data.type != "Coupon" ?
                                    <div style={{ fontSize: "12px", wordBreak: "break-all", textAlign: "center", color: "var(--mq-txt-color, rgb(250, 174, 62))" }}>
                                        **รางวัลจะถูกจัดส่งตามที่อยู่ที่ระบุไว้ในโปรไฟล์
                                    </div> : null}
                            </div>
                        </div>
                    </div>
                    : null}
                <div className="w-full" style={{ position: "absolute", bottom: "10px" }}>

                    <div className="w-full flex mb-2" style={{ justifyContent: "center" }}>
                        <div className=" w-full" style={{
                            padding: "10px", margin: "auto",
                            width: "100%"
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
export default GameSucceed;
