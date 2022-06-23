import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import Spinner from "components/Loadings/spinner/Spinner";
import { path } from "services/liff.services";
import * as fn from "@services/default.service";
import ImageUC from "components/Image/index";
import {
    getOrderHD
} from "@services/liff.services";

const Cancel = () => {
    const history = useHistory();
    const [isLoading, setIsLoading] = useState(false);
    const [OrderHD, setOrderHD] = useState([]);
    const GetOrderHD = () => {
        setIsLoading(true)
        getOrderHD({ PaymentStatus: "Wating", isCancel: true, TransportStatus: "Prepare", isReturn: false }, (res) => {
            if (res.status) {
                setOrderHD(res.data.OrderHD)
            }
        }, () => { }, () => { setIsLoading(false) })
    }

    useEffect(() => {
        GetOrderHD()
    }, []);


    return (
        <> {isLoading ? <Spinner customText={"Loading"} /> : null}
            <div className="line-scroll" style={{ width: "95%", margin: "auto", height: "100%", overflow: "scroll" }}>
                {OrderHD.length > 0 ?
                    <div className="w-full" >
                        {[...OrderHD].map((e, i) => {
                            return (
                                <div key={i}>
                                    <div className="w-full" >
                                        <div className="w-full flex mb-2 relative" style={{ fontSize: "12px" }}>
                                            <div className="font-bold">หมายเลขคำสั่งซื้อ : </div>
                                            <div >{e.orderNumber} </div>
                                            <div className="absolute flex" style={{
                                                right: "10px",
                                                width: "90px",
                                                backgroundColor: "#ebebeb",
                                                borderRadius: "10px",
                                                justifyContent: "center",
                                                color: "var(--mq-txt-color, rgb(20, 100, 246))"
                                            }}>{e.cancelStatus === "Wait" ? "รอดำเนินการ" : e.cancelStatus === "Refund" ? "คืนเงิน" : "ไม่คืนเงิน"} </div>
                                        </div>
                                        {[...e.dt].length > 0 ?
                                            [...e.dt].map((dt, j) => {
                                                return <div key={j} className="w-full flex mb-2" style={{ fontSize: "12px" }}>
                                                    <div style={{ width: "80px", height: "80px" }}>
                                                        <ImageUC
                                                            style={{
                                                                width: "80px", height: "80px"
                                                            }}
                                                            find={1}
                                                            relatedid={dt.id}
                                                            relatedtable={["stock1"]}
                                                            alt="flash_sale"
                                                            className=" border-2 border-blueGray-50 animated-img"
                                                        ></ImageUC>
                                                    </div>
                                                    <div className=" px-2 relative " style={{ width: "calc(100% - 80px)" }}>
                                                        <div className="font-bold line-clamp-1">{dt.productName}</div>

                                                        <div className="flex" style={{ fontSize: "14px" }}>
                                                            <div className="flex absolute" style={{ right: "0" }}>
                                                                <div style={{
                                                                    textDecoration:
                                                                        dt.discount > 0 ? "line-through" : "none",
                                                                    color: dt.discount > 0 ? "#ddd" : "#047738"

                                                                }}>{"฿ " + fn.formatMoney(dt.price)}</div>
                                                                {dt.discount > 0 ?
                                                                    <div className="px-2" style={{ color: "red" }}>{"฿ " + fn.formatMoney(dt.discount)}</div> : null}
                                                            </div>
                                                            <div className="" style={{ color: "#ddd" }}>{"x" + dt.amount}</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            })
                                            : null}

                                        <div className="w-full flex mb-2" style={{ fontSize: "12px", justifyContent: "end", color: "#ddd" }}>
                                            <div className="font-bold"
                                                onClick={() => {
                                                    history.push(path.orderpaymentdone.replace(":id", e.id))
                                                }}>
                                                {"ดูรายละเอียดคำสั่งซื้อ >"}
                                            </div>
                                        </div>


                                    </div>
                                    <div className="liff-inline mb-2" />
                                    <div className="flex relative">
                                        <div className="font-bold">{"ยอดรวมสินค้า ( " + e.amount + " ชิ้น)"}</div>
                                        <div className="font-bold absolute " style={{ right: "0", color: "#047738" }}>{"฿ " + fn.formatMoney(e.price)}</div>
                                    </div>
                                    <div className="liff-inline mb-2" />
                                </div>
                            )
                        })}
                    </div>
                    : null}
            </div>
        </>
    );
};

export default Cancel;
