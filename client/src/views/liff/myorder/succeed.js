import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import Spinner from "components/Loadings/spinner/Spinner";
import { path } from "services/liff.services";
import * as fn from "@services/default.service";
import ImageUC from "components/Image/index";
import {
    getOrderHD
} from "@services/liff.services";

const Toreceive = () => {
    const history = useHistory();
    const [isLoading, setIsLoading] = useState(false);
    const [OrderHD, setOrderHD] = useState([]);
    const GetOrderHD = () => {
        setIsLoading(true)
        getOrderHD({ PaymentStatus: "Done", isCancel: false, TransportStatus: "Done", isReturn: false }, (res) => {
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
            <div className="line-scroll" style={{ width: "95%", margin: "auto", border: "1px solid", height: "100%", overflow: "scroll" }}>
                {OrderHD.length > 0 ?
                    <div className="w-full" >
                        {[...OrderHD].map((e, i) => {
                            return (
                                <>
                                    <div className="w-full" key={i}>
                                        <div className="w-full flex mb-2" style={{ fontSize: "12px" }}>
                                            <div className="font-bold">หมายเลขคำสั่งซื้อ : </div>
                                            <div >{e.orderNumber} </div>
                                        </div>
                                        {[...e.dt].length > 0 ?
                                            [...e.dt].map((dt, j) => {
                                                return <div key={j} className="w-full flex mb-2" style={{ fontSize: "12px" }}>
                                                    <div style={{ width: "80px", height: "80px", border: "1px solid " }}>
                                                        รูป
                                                    </div>
                                                    <div className=" px-2 " style={{ width: "calc(100% - 80px)" }}>
                                                        <div className="font-bold">{dt.stock.productName}</div>
                                                        <div style={{ color: "#ddd", fontSize: "10px" }}>{"x" + dt.amount}</div>
                                                        <div className="flex" style={{ justifyContent: "end" ,fontSize: "14px"}}>
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
                                            <div className="font-bold">{"ดูรายละเอียดคำสั่งซื้อ >"} </div>
                                        </div>

                                        <div className="w-full flex mb-2" style={{ fontSize: "12px", justifyContent: "end", color: "#ddd" }}>
                                            <div
                                                className="flex outline-gold-mbk text-gold-mbk text-center text-lg  font-bold "
                                                style={{
                                                    margin: "auto",
                                                    height: "45px",
                                                    borderRadius: "10px",
                                                    padding: "5px",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    width: "80%",
                                                    fontSize: "16px"
                                                }}
                                                onClick={() => {
                                                    // history.push(path.shopList)
                                                    console.log("คืนสินค้า")
                                                }}
                                            >
                                                <i className="fas fa-reply"></i>
                                                <div className="px-2">{"คืนสินค้า"}</div>
                                            </div>
                                        </div>


                                    </div>
                                    <div className="liff-inline mb-2" />
                                </>
                            )
                        })}
                    </div>
                    : null}
            </div>
        </>
    );
};

export default Toreceive;
