import React from "react";
import { path } from "services/liff.services";
import { useHistory } from "react-router-dom";
import ImageUC from "components/Image/index";
// components

const GameSucceed = ({ data }) => {
    const history = useHistory();
    return (
        <>
            <div style={{ height: "100%" }} className="bg-green-mbk">
                {data != null ?
                    <div className="w-full" style={{ height: "calc(100% - 100px)" }}>

                        <div className="w-full flex text-lg mb-2 text-white justify-center items-center">
                            ยินดีด้วย คุณได้รับ
                        </div>
                        {/* <div className="w-full flex text-lg" style={{ justifyContent: "center", color: "#FFFFFF" }}>
                            ได้รับ
                        </div> */}
                        <div className="w-full flex mx-auto mt-6 justify-center" style={{
                            height: "150px"
                        }}>
                            <div style={{ height: "150px", margin: "auto", minHeight: "80px", minWidth: "150px" }}>
                                <ImageUC
                                    find={1}
                                    relatedid={data.id}
                                    relatedtable={[(data.type == "Coupon" ? "tbRedemptionCoupon" : "tbRedemptionProduct")]}
                                    alt="img"
                                    className=" animated-img"
                                    imgclassname="h-full"
                                ></ImageUC>
                            </div>
                        </div>

                        <div className="flex line-clamp-1 text-lg mx-auto my-2 mt-4 text-white justify-center" style={{
                            width: "90%", lineHeight: "1.5",
                        }}>
                            {data.name}
                        </div>
                        <div style={{ height: "200px" }}>
                            <div className="px-8 py-2 shadow-lg" style={{
                                width: "90%", margin: "auto",
                                borderRadius: "40px",
                                backgroundColor: "#FFFFFF",
                                // boxShadow: "0px -2px 10px 0px #aba6a6",
                                height: "100%"
                            }}>

                                <div className="font-bold text-center mb-2">รายละเอียด</div>
                                <div className="" style={{ borderBottom: "1px solid #ddd" }}></div>
                                <div className="text-xs p-4 line-scroll" style={{
                                    height: "115px", wordBreak: "break-all"
                                }}>{data.description}</div>
                                {data.type != "Coupon" ?
                                    <div style={{ fontSize: "12px", wordBreak: "break-all", textAlign: "center", color: "var(--mq-txt-color, rgb(250, 174, 62))" }}>
                                        **รางวัลจะถูกจัดส่งตามที่อยู่ที่ระบุไว้ในโปรไฟล์
                                    </div> : null}
                            </div>
                        </div>
                    </div>
                    : null}
                <div className="w-full" style={{ position: "absolute", bottom: "20px" }}>

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
