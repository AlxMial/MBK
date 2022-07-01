import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
// components
import {
  getPaymentsucceed,
} from "@services/liff.services";

const Paymentsucceed = () => {
  const { id } = useParams();
  const [OrderHD, setOrderHD] = useState(null); //ทั้งหมด
  const fetchDataOreder = () => {
    getPaymentsucceed({ id: id }, (res) => {
      if (res.data.status) {
        setOrderHD(res.data.OrderHD)
      }
    });
  }
  useEffect(() => {
    fetchDataOreder();

  }, []);


  return (
    <>
      <div className="bg-green-mbk">
        <div
          style={{ height: "40px" }}
          className=" noselect text-lg text-white font-bold text-center "
        >
          {"คำสั่งชื้อของฉัน"}
        </div>
        {OrderHD != null ?
          <>
            <div>
              {"orderNumber : " + OrderHD.orderNumber}
            </div>
            <div>
              {"paymentStatus : " + OrderHD.paymentStatus}
            </div>
          </>
          : null}
      </div>
    </>
  );
};
export default Paymentsucceed;
