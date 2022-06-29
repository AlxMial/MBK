import React from "react";
import { useHistory } from "react-router-dom";
import Select from "react-select";
import moment from "moment";
import { getOrderHDById, cancelOrder } from "@services/liff.services";
import Modal from "react-modal";
import ModalHeader from "views/admin/ModalHeader";
const CancelModel = ({
  Cancelorder,
  isOpenmodel,
  setisOpenmodel,
  onChange,
  Cancelvalue,
  setremark,
}) => {
  //   const history = useHistory();
  const OpenmodelCancel = [
    {
      value: "ต้องการเปลี่ยนแปลงที่อยู่ในการจัดส่งสินค้า",
      label: "ต้องการเปลี่ยนแปลงที่อยู่ในการจัดส่งสินค้า",
    },
    {
      value: "ผู้ขายไม่ตอบสนองในการสอบถามข้อมูล",
      label: "ผู้ขายไม่ตอบสนองในการสอบถามข้อมูล",
    },
    { value: "สั่งสินค้าผิด", label: "สั่งสินค้าผิด" },
    { value: "เปลี่ยนใจ", label: "เปลี่ยนใจ" },
    { value: "อื่นๆ", label: "อื่นๆ" },
  ];
  return (
    <div>
      <Modal
        isOpen={isOpenmodel}
        className="Modal-line"
        style={{ borderRadius: "10px" }}
      >
        <div className="w-full flex flex-wrap">
          <div className="w-full flex-auto mt-2">
            <ModalHeader
              title="ยกเลิกสินค้า"
              handleModal={() => {
                setisOpenmodel(false);
              }}
            />
            <div className="mb-2">
              <Select
                className="text-gray-mbk mt-1 text-sm w-full border-none  select-remark "
                isSearchable={false}
                value={OpenmodelCancel.filter((o) => o.value === Cancelvalue)}
                options={OpenmodelCancel}
                onChange={onChange}
              />
            </div>
            <div className="px-2 mb-2 text-green-mbk font-bold">
              สาเหตุอื่นๆ โปรดระบุ
            </div>
            <div className="mb-2">
              <textarea
                className="w-full border-green-mbk"
                style={{
                  borderRadius: "20px",
                  padding: "15px",
                  height: "150px",
                }}
                name="CancelOtherRemark "
                onBlur={(e) => {
                  setremark(e.target.value);
                }}
              />
            </div>
            <div
              className="mb-2 text-green-mbk"
              style={{
                backgroundColor: "#f7f6f6",
                padding: "10px",
                borderRadius: "10px",
              }}
            >
              <div className="font-bold">
                ข้อกำหนดและเงื่อนไขในการยกเลิกคำสั่งซื้อ
              </div>
              <div className="flex">
                <div>1.</div>
                <div>
                  ผู้ซื้อสามารถยกเลิกคำสั่งซื้อได้ทันที ก่อนร้านค้านัดส่งสินค้า
                  มิฉะนั้นจะต้องขออนุมัติการยกเลิกจากผู้ขาย
                </div>
              </div>
              <div className="flex">
                <div>2.</div>
                <div>
                  เมื่อคำสั่งซื้อถูกยกเลิกสำเร็จ
                  ค่าสินค้าจะถูกดำเนินการคืนให้คุณตามข้อกำหนดของช่องทางที่คุณชำระเงิน
                </div>
              </div>
              <div className="flex">
                <div>3.</div>
                <div>
                  เมื่อสินค้าถูกนำส่งแล้ว คุณจะไม่สามารถยกเลิกคำสั่งซื้อได้
                </div>
              </div>
            </div>
            <div>
              <div
                className="flex outline-gold-mbk text-gold-mbk text-center text-lg  font-bold bt-line"
                onClick={Cancelorder}
              >
                {"ตกลง"}
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default CancelModel;
