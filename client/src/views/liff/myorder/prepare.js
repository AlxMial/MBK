import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import Spinner from "components/Loadings/spinner/Spinner";
import { path } from "services/liff.services";
import { getOrderHD } from "@services/liff.services";
import DetailOrder from "./detailOrder";
import EmptyOrder from "./emptyOrder";
const Prepare = () => {
  const history = useHistory();
  const [isLoading, setIsLoading] = useState(false);
  const [OrderHD, setOrderHD] = useState([]);
  const GetOrderHD = () => {
    setIsLoading(true);
    getOrderHD(
      { PaymentStatus: "Done", isCancel: false, TransportStatus: "Prepare" },
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
        {OrderHD.length > 0 ? (
          <DetailOrder
            OrderHD={OrderHD}
            onClick={(e) => {
              history.push(path.orderpaymentdone.replace(":id", e.id));
            }}
          />
        ) : (
          <EmptyOrder text={"ยังไม่คำสั่งซื้อที่กำลังเตรียมสินค้า"} />
        )}
      </div>
    </>
  );
};

export default Prepare;
