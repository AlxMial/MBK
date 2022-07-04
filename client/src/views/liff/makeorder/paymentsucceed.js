import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import { path } from "services/liff.services";
import * as Session from "@services/Session.service";
import * as fn from "services/default.service";
import { sendEmailSuccess } from "services/liff.services";
// components
import {
  getPaymentsucceed,
} from "@services/liff.services";

const Paymentsucceed = () => {
  const history = useHistory();
  const { id } = useParams();
  const [OrderHD, setOrderHD] = useState(null); //ทั้งหมด
  const fetchDataOreder = () => {
    getPaymentsucceed({ id: id, uid: Session.getLiff().uid }, (res) => {
      // console.log('res', res);
      if (res.status) {
        sendEmailSuccess()
        // res.data.status = false;
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
          {"ข้อมูลการชำระเงิน"}
        </div>
        {OrderHD &&
          <div className="text-lg relative bg-white" style={{ height: 'calc(100vh - 140px)' }}>
            <div className="w-full pt-10">
              <div className="w-full flex mb-2" style={{ justifyContent: "center" }}>
                {/* <i class="fas fa-times-circle"></i> */}
                <div className="icon mr-4">
                  <i className={"text-lg " + (OrderHD.status ? "fas fa-check-circle" : "fas fa-times-circle")}></i>
                </div>
                <div className="text-status mr-4">
                  คุณได้ชำระเงินจำนวน
                </div>
                <div className="pay-amount font-bold">
                  {"฿ " + fn.formatMoney(OrderHD.netTotal)}
                </div>
              </div>
              <div className="w-full flex mt-5 text-sm justify-center flex-col">
                <div className="w-full text-center">สามารถดูรายละเอียดคำสั่งซื้อ</div>
                <div className="w-full text-center">ได้ทางอีเมลของท่าน</div>
              </div>
            </div>

            <div className="w-full mt-10">
              <div className="w-full flex mb-2 justify-center ">
                <div
                  className="flex text-green-mbk text-center text-sm font-bold bg-green-mbk text-white rounded px-4 mr-4"
                  style={{
                    height: "40px",
                    minWidth: "160px",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  onClick={() => {
                    history.push(path.shopList);
                  }}
                >
                  {"กลับไปที่ร้านค้า"}
                </div>
                <div
                  className="flex text-green-mbk text-center text-sm  font-bold bg-gold-mbk text-white rounded px-4"
                  style={{
                    height: "40px",
                    minWidth: "160px",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  onClick={() => {
                    history.push(path.myorder.replace(":id", "1"));
                  }}
                >
                  {"ไปหน้า คำสั่งซื้อของฉัน"}
                </div>
              </div>
            </div>
          </div>}

      </div>
    </>
  );
};
export default Paymentsucceed;
