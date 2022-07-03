import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { path } from "services/liff.services";
import * as fn from "@services/default.service";
import {
  getMyOrder
} from "@services/liff.services";
import Spinner from "components/Loadings/spinner/Spinner";
import ImageUC from "components/Image/index";
import EmptyOrder from "../emptyOrder";
// components

const MyOrder = () => {
  const history = useHistory();
  const [isLoading, setIsLoading] = useState(false);
  const [OrderHD, setOrderHD] = useState([]);
  const [sumValue, setsumValue] = useState({});
  const GetMyOrder = () => {
    setIsLoading(true)
    getMyOrder((res) => {
      console.log('res', res.data)
      if (res.status) {
        setOrderHD(res.data.OrderHD)
        setsumValue(
          { sumAmount: res.data.sumamount, sumPrice: res.data.sumprice }
        )
      }
    }, () => { }, () => { setIsLoading(false) })
  }
  useEffect(() => {
    GetMyOrder()
  }, []);
  return (
    <>
      {isLoading ? <Spinner customText={"Loading"} /> : null}
      <div className="mt-2  liff-footer line-scroll" style={{ padding: "0 10px" }}>
        <div className="flex relative" style={{ height: "40px", fontSize: "14px" }}>
          <div className="text-green-mbk font-bold" style={{ width: "50%" }}>
            คำสั่งชื้อของฉัน
          </div>
          <div className="text-liff-gray-mbk text-xs" style={{ width: "50%", textAlign: "end" }} onClick={() => {
            history.push(path.myorder.replace(":id", "1"))
          }}>{"ทั้งหมด >"}</div>
        </div>
        {OrderHD && OrderHD.length > 0 ?
          <div className="line-scroll" >

            {OrderHD.map((hd, index) => {
              return (
                <div key={index}>
                  <div className="flex" style={{ height: "30px" }}>
                    <div className="font-bold" style={{ width: "115px" }}>หมายเลขคำสั่งซื้อ : </div>
                    <div className="px-2 line-clamp-1" >{hd.orderNumber} </div>
                  </div>
                  {hd.dt.map((e, i) => {
                    return (
                      <div key={i} className="flex" style={{ height: "auto" }}>
                        <div className="flex" style={{ width: "26%", justifyContent: "center" }}>
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
                          <div className="font-bold line-clamp-1" >
                            {e.productName}
                          </div>
                          <div className="flex">
                            <div className="text-liff-gray-mbk" style={{ width: "26%" }}> {"x" + e.amount}</div>
                            <div style={{ width: "70%", justifyContent: "end" }} className="flex" >
                              <div className="" style={{
                                textDecoration:
                                  e.discount > 0 ? "line-through" : "none",
                                color: e.discount > 0 ? "#ddd" : "#047738"
                              }}> {"฿ " + fn.formatMoney(e.price)}</div>
                              {e.discount > 0 ?
                                <div className="" style={{ color: "red", marginLeft: "5px" }}> {"฿ " + fn.formatMoney(e.discount)}</div> : null}
                            </div>
                          </div>
                        </div>

                      </div>
                    )
                  })}
                </div>
              )
            })}

            <div className="w-full flex mb-2 text-liff-gray-mbk" style={{ fontSize: "12px", justifyContent: "end" }}>
              <div className="font-bold"
                onClick={() => {
                  history.push(OrderHD.paymentStatus == 1 ? path.makeorderbyid.replace(":id", OrderHD.id) : path.orderpaymentdone.replace(":id", OrderHD.id))
                }}>
                {"ดูรายละเอียดคำสั่งซื้อ >"}
              </div>
            </div>

            <div className="flex" >
              <div className="text-liff-gray-mbk" style={{ width: "50%" }}>{"รวม " + sumValue.sumAmount + " ชิ้น"}</div>
              <div className="font-bold" style={{ width: "50%", textAlign: "end", color: "#047738" }}>
                {"฿ " + fn.formatMoney(sumValue.sumPrice) + " บาท"} </div>
            </div>
          </div> :
          <EmptyOrder text={"ยังไม่คำสั่งชื้อ"} />
        }
      </div>
    </>
  );
};
export default MyOrder;
