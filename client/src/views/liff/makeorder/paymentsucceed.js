import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import * as Session from "@services/Session.service";

// components
import {
  getPaymentsucceed,
} from "@services/liff.services";

const Paymentsucceed = () => {
  const { id } = useParams();
  const [OrderHD, setOrderHD] = useState(null); //ทั้งหมด
  const fetchDataOreder = () => {
    getPaymentsucceed({ id: id,uid: Session.getLiff().uid }, (res) => {
      if (res.data.status) {
        setOrderHD(res.data)
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
              {"paymentStatus : " + (OrderHD.status) ? 'ชำระเงินสำเร็จ' : 'ชำระเงินไม่สำเร็จ' }
            </div>
          </>
          : null}
      </div>
    </>
  );
};
export default Paymentsucceed;
