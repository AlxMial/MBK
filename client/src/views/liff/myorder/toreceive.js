import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import Spinner from "components/Loadings/spinner/Spinner";
import { path } from "services/liff.services";
import { getOrderHD } from "@services/liff.services";
import DetailOrder from "./detailOrder";
import EmptyOrder from "../emptyOrder";

const Toreceive = () => {
  const history = useHistory();
  const [isLoading, setIsLoading] = useState(false);
  const [OrderHD, setOrderHD] = useState([]);
  const GetOrderHD = () => {
    setIsLoading(true);
    getOrderHD(
      {
        PaymentStatus: 3,
        isCancel: false,
        TransportStatus: 2,
        isReturn: false,
      },
      (res) => {
        if (res.status) {
          const _orderHD = res.data.OrderHD;
          if (_orderHD.length > 0) {
            _orderHD[0].isToReceive = true;
          }
          setOrderHD(res.data.OrderHD);
        }
      },
      () => { },
      () => {
        setIsLoading(false);
      }
    );
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
        {OrderHD && OrderHD.length > 0 ? (
          <DetailOrder
            OrderHD={OrderHD}
            onClick={(e) => {
              history.push(path.orderpaymentdone.replace(":id", e.id));
            }}
          />
        ) : (
          <div className="flex justify-center items-center h-full">
            <div style={{ height: "50px" }}>
              <EmptyOrder text={"ยังไม่มีคำสั่งซื้อที่ต้องได้รับ"} />
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Toreceive;
