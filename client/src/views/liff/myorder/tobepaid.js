import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import Spinner from "components/Loadings/spinner/Spinner";
import { path } from "services/liff.services";
import * as fn from "@services/default.service";
import ImageUC from "components/Image/index";
import {
    getOrderHD
} from "@services/liff.services";

const Tobepaid = () => {
    const history = useHistory();
    const [isLoading, setIsLoading] = useState(false);
    const [OrderHD, setOrderHD] = useState([]);
    const GetOrderHD = () => {
        setIsLoading(true)
        getOrderHD({ PaymentStatus: "Wating", TransportStatus: "Prepare", isCancel: false, isReturn: false }, (res) => {
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
                <div className="flex  mt-2" style={{ color: "var(--mq-txt-color, rgb(255, 168, 52))" }}>
                    <i className="fas fa-exclamation-circle" style={{ width: "22px", height: "22px" }}></i>
                    <div className=" px-2 text-xs ">
                        <p style={{ marginBottom: "0" }}>หลังจากกดสั่งสินค้าหากไม่ได้ชำระเงินภายใน 48 ชั่วโมง</p>
                    </div>
                </div>
                {OrderHD.length > 0 ?
                    <div className="w-full" >
                        {[...OrderHD].map((e, i) => {
                            return (
                                <div key={i}>
                                    <div className="w-full">
                                        <div className="w-full flex mb-2" style={{ fontSize: "12px" }}>
                                            <div className="font-bold">หมายเลขคำสั่งซื้อ : </div>
                                            <div >{e.orderNumber} </div>
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
                                                            relatedid={dt.stock.id}
                                                            relatedtable={["stock1"]}
                                                            alt="flash_sale"
                                                            className=" border-2 border-blueGray-50  animated-img"
                                                        ></ImageUC>
                                                    </div>
                                                    <div className=" px-2 " style={{ width: "calc(100% - 80px)" }}>
                                                        <div className="font-bold line-clamp-1">{dt.stock.productName}</div>
                                                        <div style={{ color: "#ddd", fontSize: "10px" }}>{"x" + dt.amount}</div>
                                                        <div className="flex" style={{ justifyContent: "end", fontSize: "14px" }}>
                                                            <div style={{
                                                                textDecoration:
                                                                    dt.stock.discount > 0 ? "line-through" : "none",
                                                                color: dt.stock.discount > 0 ? "#ddd" : "#047738"
                                                            }}>{"฿ " + fn.formatMoney(dt.stock.price)}</div>
                                                            {dt.stock.discount > 0 ?
                                                                <div className="px-2" style={{ color: "red" }}>{"฿ " + fn.formatMoney(dt.stock.discountType === "THB" ? dt.stock.discount : (
                                                                    dt.stock.price - ((dt.stock.discount / 100) * dt.stock.price))
                                                                )}</div> : null}

                                                        </div>
                                                    </div>
                                                </div>
                                            })
                                            : null}

                                        <div className="w-full flex mb-2" style={{ fontSize: "12px", justifyContent: "end", color: "#ddd" }}>
                                            <div className="font-bold"
                                                onClick={() => {
                                                    history.push(path.makeorderbyid.replace(":id", e.id))
                                                }}>
                                                {"ดูรายละเอียดคำสั่งซื้อ >"}
                                            </div>
                                        </div>


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

export default Tobepaid;
