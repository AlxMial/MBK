import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { path } from "services/liff.services";
import * as fn from "@services/default.service";
import {
  getMyOrder
} from "@services/liff.services";
import Spinner from "components/Loadings/spinner/Spinner";
import ImageUC from "components/Image/index";
// components

const MyOrder = () => {
  const history = useHistory();
  const [isLoading, setIsLoading] = useState(false);
  const [OrderHD, setOrderHD] = useState(null);
  const GetMyOrder = () => {
    setIsLoading(true)
    getMyOrder((res) => {
      if (res.status) {
        setOrderHD(res.data.OrderHD)
      }
    }, () => { }, () => { setIsLoading(false) })
  }


  useEffect(() => {
    GetMyOrder()
  }, []);
  return (
    <>
      {isLoading ? <Spinner customText={"Loading"} /> : null}
      <div className="mt-2 " style={{ padding: "10px", height: "calc(100vh - 490px)" }}>
        <div className="flex relative" style={{ height: "40px", fontSize: "14px" }}>
          <div className="text-green-mbk font-bold" style={{ width: "50%" }}>
            คำสั่งชื้อของฉัน
          </div>
          <div style={{ width: "50%", textAlign: "end", color: "#ddd" }} onClick={() => {
            history.push(path.myorder.replace(":id", "1"))
          }}>{"ดูทั้งหมด >"}</div>
        </div>
        {OrderHD != null ?
          <div style={{ height: "calc(100% - 40px)" }}>
            <div className="flex" style={{ height: "30px" }}>
              <div className="font-bold">หมายเลขคำสั่งซื้อ : </div>
              <div className="px-2">{OrderHD.orderNumber} </div>
            </div>

            {OrderHD.dt.map((e, i) => {
              return (
                <div key={i} className="flex" style={{ height: "auto" }}>
                  <div className="flex" style={{ width: "30%", justifyContent: "center" }}>
                    <div style={{ width: "80px", height: "80px" }}>
                      <ImageUC

                        find={1}
                        relatedid={e.id}
                        relatedtable={["stock1"]}
                        alt="flash_sale"
                        className=" border-2 border-blueGray-50 animated-img"
                      ></ImageUC>
                    </div>
                  </div>
                  <div style={{ width: "70%" }}>
                    <div className="font-bold">
                      {e.productName}
                    </div>
                    <div className="flex">
                      <div style={{ width: "30%", color: "#ddd" }}> {"x" + e.amount}</div>
                      <div style={{ width: "70%", justifyContent: "end" }} className="flex" >
                        <div className="" style={{
                          textDecoration:
                            e.discount > 0 ? "line-through" : "none",
                          color: e.discount > 0 ? "#ddd" : "#047738"
                        }}> {"฿ " + fn.formatMoney(e.price)}</div>
                        {e.discount > 0 ?
                          <div className="" style={{ color: "red", marginLeft: "5px" }}> {"฿ " + fn.formatMoney(e.discountType == "THB" ? e.price - e.discount : e.price - ((e.discount / 100) * e.price))}</div> : null}
                      </div>
                    </div>
                  </div>

                </div>
              )
            })}
            <div className="w-full flex mb-2" style={{ fontSize: "12px", justifyContent: "end", color: "#ddd" }}>
              <div className="font-bold"
                onClick={() => {
                  history.push(OrderHD.paymentStatus == "Wating" ? path.makeorderbyid.replace(":id", OrderHD.id) : path.orderpaymentdone.replace(":id", OrderHD.id))
                }}>
                {"ดูรายละเอียดคำสั่งซื้อ >"}
              </div>
            </div>

            <div className="flex" >
              <div style={{ width: "50%", color: "#ddd" }}>{"รวม " + OrderHD.sumamount + " ชิ้น"}</div>
              <div className="font-bold" style={{ width: "50%", textAlign: "end", color: "#047738" }}>{"฿ " + fn.formatMoney(OrderHD.sumprice) + " บาท"} </div>
            </div>
          </div> : null}
      </div>
    </>
  );
};
export default MyOrder;
