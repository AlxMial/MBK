import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import Spinner from "components/Loadings/spinner/Spinner";
import { path } from "services/liff.services";
import { getOrderHD } from "@services/liff.services";
import * as Storage from "@services/Storage.service";
import DetailOrder from "./detailOrder";
import EmptyOrder from "../emptyOrder";
const Tobepaid = () => {
  const history = useHistory();
  const [isLoading, setIsLoading] = useState(false);
  const [OrderHD, setOrderHD] = useState([]);
  const GetOrderHD = () => {
    setIsLoading(true);
    getOrderHD(
      {
        PaymentStatus: 1,
        TransportStatus: 1,
        isCancel: false,
        isReturn: false,
      },
      (res) => {
        if (res.status) {
          setOrderHD(res.data.OrderHD);
        }
      },
      () => { },
      () => {
        setIsLoading(false);
      }
    );
  };

  const makeorderbyid = (id) => {
    history.push(path.makeorderbyid.replace(":id", id));
    Storage.setusecoupon(null);
  };
  useEffect(() => {
    GetOrderHD();
  }, []);

  return (
    <>
      {isLoading ? <Spinner customText={"Loading"} /> : null}
      <div
        className="line-scroll h-full"
        style={{
          width: "95%",
          margin: "auto",
        }}
      >
        <div
          className="flex  mt-2"
          style={{ color: "var(--mq-txt-color, rgb(255, 168, 52))" }}
        >
          <i
            className="fas fa-exclamation-circle"
            style={{ width: "22px", height: "22px" }}
          ></i>
          <div className=" px-2 text-xs ">
            <p style={{ marginBottom: "0" }}>
              หลังจากกดสั่งสินค้าหากไม่ได้ชำระเงินภายใน 48 ชั่วโมง
              สินค้าจะถูกยกเลิกทันที
            </p>
          </div>
        </div>

        {OrderHD.length > 0 ? (
          <DetailOrder
            OrderHD={OrderHD}
            onClick={(e) => {
              !e.isPaySlip
                ? makeorderbyid(e.id)
                : history.push(path.orderpaymentdone.replace(":id", e.id));
            }}
          />
        ) : (
          <div className="flex justify-center items-center h-full">
            <div style={{ height: "50px" }}>
              <EmptyOrder text={"ยังไม่มีคำสั่งซื้อที่ต้องชำระ"} />
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Tobepaid;
