import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import Spinner from "components/Loadings/spinner/Spinner";
import { path } from "services/liff.services";
import { getOrderHD } from "@services/liff.services";
import * as Storage from "@services/Storage.service";
import DetailOrder from "./detailOrder";
const Tobepaid = () => {
  const history = useHistory();
  const [isLoading, setIsLoading] = useState(false);
  const [OrderHD, setOrderHD] = useState([]);
  const GetOrderHD = () => {
    setIsLoading(true);
    getOrderHD(
      {
        PaymentStatus: "Wating",
        TransportStatus: "Prepare",
        isCancel: false,
        isReturn: false,
      },
      (res) => {
        if (res.status) {
          setOrderHD(res.data.OrderHD);
        }
      },
      () => {},
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
        className="line-scroll"
        style={{
          width: "95%",
          margin: "auto",
          height: "100%",
          overflow: "scroll",
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
          <div
            className="flex mb-2 text-liff-gray-mbk"
            style={{
              height: "100%",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <div>
              <i
                className="flex fas fa-box-open mb-2"
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "28px",
                }}
              ></i>
              <div> ยังไม่คำสั่งซื้อที่ต้องชำระ </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Tobepaid;
