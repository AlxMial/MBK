import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import { path } from "services/liff.services";
import * as Session from "@services/Session.service";
import * as fn from "services/default.service";
import { sendEmailSuccess } from "services/liff.services";
import moment from "moment";
// components
import { getPaymentsucceed } from "@services/liff.services";

const Paymentsucceed = () => {
  const history = useHistory();
  const { id } = useParams();
  const [OrderHD, setOrderHD] = useState(null); //ทั้งหมด
  const fetchDataOreder = () => {
    getPaymentsucceed({ id: id, uid: Session.getLiff().uid }, (res) => {
      if (res.status) {
        sendEmailSuccess(
          {
            // frommail: "noreply@undefined.co.th",
            // password: "Has88149*",
            frommail: "no-reply@prg.co.th",
            password: "Tus92278",
            tomail: res.data.OrderHD.email,
            orderNumber: res.data.OrderHD.orderNumber,
            memberName: res.data.OrderHD.memberName,
            orderPrice: res.data.OrderHD.netTotal,
            orderDate: moment(res.data.OrderHD.orderDate).format("DD/MM/YYYY"),
          },
          (res) => {
            console.log(res);
          }
        );
        // res.data.status = false;
        setOrderHD(res.data.OrderHD);
      } else {
      }
    });
  };
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
        {OrderHD && (
          <div
            className="text-lg relative bg-white"
            style={{ height: "calc(100vh - 140px)" }}
          >
            <div className="w-full pt-10">
              <div
                className="w-full flex mb-2"
                style={{ justifyContent: "center" }}
              >
                {/* <i class="fas fa-times-circle"></i> */}
                {/* <div className="icon mr-4">
                  <i
                    className={"text-lg fas fa-check-circle" }
                  ></i>
                </div> */}
                <div className="text-status mr-4">คุณได้ชำระเงินจำนวน</div>
                <div className="pay-amount font-bold">
                  {"฿ " + fn.formatMoney(OrderHD.netTotal)}
                </div>
              </div>
              <div className="w-full flex mt-5 text-sm justify-center flex-col">
                <div className="w-full text-center">
                  สามารถดูรายละเอียดคำสั่งซื้อ
                </div>
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
                  {"ไปหน้าร้านค้า"}
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
          </div>
        )}
        {OrderHD === null ? (
          <>
            <div
              className="text-lg relative bg-white"
              style={{ height: "calc(100vh - 140px)" }}
            >
              <div className="w-full pt-10">
                <div
                  className="w-full flex mb-2"
                  style={{ justifyContent: "center" }}
                >
                  {/* <i class="fas fa-times-circle"></i> */}
                  {/* <div className={"icon mr-4" + (OrderHD === null ? ' ' : ' hidden')} >
                    <i className={"text-lg fas fa-times-circle"}></i>
                  </div> */}
                  <div className="text-status mr-4">
                    คุณได้ทำการยกเลิกการชำระเงิน
                  </div>
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
                    {"ไปหน้าร้านค้า"}
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
            </div>
          </>
        ) : (
          <></>
        )}
      </div>
    </>
  );
};
export default Paymentsucceed;
