import React from "react";
import { useHistory } from "react-router-dom";
import { path } from "services/liff.services";
const WaitingPayment = ({ price }) => {
  const history = useHistory();
  return (
    <div
      className="w-full  relative mt-2"
      style={{
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div className="w-full mb-2" style={{ width: "90%", margin: "auto" }}>
        <div
          className="w-full flex font-bold relative text-sm"
          style={{ justifyContent: "center" }}
        >
          <div className="flex">
            <i
              className="fas fa-exclamation-circle flex"
              style={{ alignItems: "center" }}
            ></i>
            <div className="w-full px-2">รอการชำระเงิน</div>
          </div>
        </div>
      </div>
      <div className="w-full " style={{ width: "90%", margin: "auto" }}>
        <div
          className="w-full flex font-bold relative mb-2 text-sm"
          style={{ justifyContent: "center" }}
        >
          <div className="flex">
            <div className="w-full">
              {"    กรุณาชำระเงินจำนวน " +
                price +
                " ภายใน 48 ชั่วโมง เพื่อไม่ให้คำสั่งซื้อถูกยกเลิก คุณสามารถตรวจสอบข้อูลเพิ่มเติมได้ที่หน้า คำสั่งซื้อของฉัน "}
            </div>
          </div>
        </div>
      </div>

      <div className="w-full" style={{ width: "90%", margin: "auto" }}>
        <div className="flex">
          <div className="px-2" style={{ width: "50%" }}>
            <div
              className="flex bg-green-mbk text-white text-center text-base  font-bold bt-line "
              onClick={() => {
                history.push(path.shopList);
              }}
            >
              {"กลับไปที่ร้านค้า"}
            </div>
          </div>
          <div className="px-2" style={{ width: "50%" }}>
            <div
              className="flex bg-gold-mbk  text-white text-center text-base  font-bold bt-line  "
              onClick={() => {
                history.push(path.myorder.replace(":id", "1"));
              }}
            >
              {"ไปหน้า คำสั่งซื้อของฉัน"}
            </div>
          </div>
        </div>
      </div>

      <div className="liff-inline" />
    </div>
  );
};

export default WaitingPayment;