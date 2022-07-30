import React, { useState } from "react";
import Spinner from "components/Loadings/spinner/Spinner";
import Select from "react-select";
import { returnOrder } from "@services/liff.services";
import Modal from "react-modal";
import FilesService from "services/files";
import ProfilePictureUC from "components/ProfilePictureUC";
import { useToasts } from "react-toast-notifications";
const ReturnModel = ({ returnModel, Callback }) => {
  const { addToast } = useToasts();
  const [isLoading, setIsLoading] = useState(false);
  const [remark, setremark] = useState(null);
  const [returnImage, setReturnImage] = useState(null);
  const handleChangeImage = async (e) => {
    const image = document.getElementById("returnImage");
    image.src = URL.createObjectURL(e.target.files[0]);
    const base64 = await FilesService.convertToBase64(e.target.files[0]);
    setReturnImage(base64);
    image.blur();
  };
  const [returnOrderDetail, setReturnOrderDetail] = useState("ไม่ได้รับสินค้า");
  const optionReturn = [
    { value: "ไม่ได้รับสินค้า", label: "ไม่ได้รับสินค้า" },
    { value: "ได้รับสินค้าไม่ครบ", label: "ได้รับสินค้าไม่ครบ" },
    {
      value: "ได้รับสินค้าที่ไม่ตรงตามที่สั่งซื้อ",
      label: "ได้รับสินค้าที่ไม่ตรงตามที่สั่งซื้อ",
    },
    {
      value: "ได้รับสินค้ามีตำหนิ ได้รับสินค้าที่เสียหาย",
      label: "ได้รับสินค้ามีตำหนิ ได้รับสินค้าที่เสียหาย",
    },
  ];

  const doSaveReturnOrder = () => {
    if (returnImage != null) {
      let data = {
        orderId: returnModel.orderId,
        returnDetail: returnOrderDetail,
        description: remark,
        returnImage: returnImage,
      };
      setIsLoading(true);
      returnOrder(
        data,
        (res) => {
          returnModel.Callback();
          clearData();
        },
        () => { },
        () => {
          setIsLoading(false);
        }
      );
    } else {
      addToast("กรุณาอัพโหลดรูป", { appearance: "warning", autoDismiss: true });
    }
  };
  const clearData = () => {
    setReturnOrderDetail("ไม่ได้รับสินค้า");
    setremark(null);
    setReturnImage(null);
  };

  return (
    <div>
      {isLoading ? <Spinner customText={"Loading"} /> : null}
      <Modal
        isOpen={returnModel.isOpen}
        className="Modal-line"
        style={{ borderRadius: "10px" }}
      >
        <div className="w-full flex flex-wrap" style={{ minHeight: "350px" }}>
          <div className="w-full flex-auto mt-2 h-full line-scroll">
            <div className="w-full flex-auto relative">
              <div className=" flex justify-between align-middle ">
                <div
                  className="w-full align-middle flex"
                  style={{
                    justifyContent: "center",
                  }}
                >
                  <div className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-base text-green-mbk font-bold whitespace-nowrap p-4">
                    <label>{"คืนสินค้า "}</label>
                  </div>
                </div>

                <div
                  className="  text-right align-middle absolute "
                  style={{
                    right: "0",
                  }}
                >
                  <div className=" border-t-0 px-6 align-middle border-l-0 border-r-0 text-sm text-red-500 font-bold whitespace-nowrap p-4">
                    <label
                      className="cursor-pointer"
                      onClick={() => {
                        clearData();

                        returnModel.onClose();
                      }}
                    >
                      <i
                        className="flex fas fa-times"
                        style={{ alignItems: "center" }}
                      ></i>
                    </label>
                  </div>
                </div>
              </div>
            </div>
            <div
              id="remark"
              className="px-2 mb-2 text-green-mbk font-bold flex"
            >
              <div className="flex">
                <div>อัพโหลดรูป </div>
                <div style={{ color: "red" }}>*</div>
              </div>
            </div>
            <div>
              <ProfilePictureUC
                className="pr-4"
                id={"returnImage"}
                hoverText="เลือกรูปสินค้า"
                src={returnImage}
                onChange={handleChangeImage}
              />
            </div>
            <div className="mb-2">
              <Select
                className="text-gray-mbk mt-1 text-sm w-full border-none  select-remark "
                isSearchable={false}
                value={optionReturn.filter(
                  (o) => o.value === returnOrderDetail
                )}
                options={optionReturn}
                onChange={(e) => {
                  setReturnOrderDetail(e.value);
                  setremark("");
                }}
              />
            </div>
            <div id="remark" className="px-2 mb-2 text-green-mbk font-bold">
              สาเหตุอื่นๆ โปรดระบุ
            </div>
            <div className="mb-2">
              <textarea
                className="w-full border-green-mbk"
                style={{
                  borderRadius: "20px",
                  padding: "15px",
                  height: "80px",
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
                height: "200px",
                overflow: "auto",
              }}
            >
              <div className="font-bold px-1">
                ข้อกำหนดและเงื่อนไข การขอคืนเงิน/คืนสินค้า/แจ้งเคลม
              </div>
              <div className="flex px-2">
                <div className="px-1">1.</div>
                <div> ผู้ซื้อสามารถคืนสินค้าได้ด้วยเหตุผลดังต่อไปนี้:</div>
              </div>
              <div className="px-3">
                <div className="flex ">
                  <div className="px-1">1.1</div>
                  <div> ไม่ได้รับสินค้า (เช่น พัสดุสูญหายระหว่างทาง)</div>
                </div>
                <div className="flex ">
                  <div className="px-1">1.2</div>
                  <div> ได้รับสินค้าไม่ครบ (เช่น สินค้าบางส่วนขาดหายไป)</div>
                </div>
                <div className="flex">
                  <div className="px-1">1.3</div>
                  <div>
                    ได้รับสินค้าที่ไม่ตรงตามที่สั่งซื้อ เช่น ขนาดผิด หรือ
                    ไม่ใช่สินค้าที่สั่งซื้อ เป็นต้น
                  </div>
                </div>
                <div className="flex">
                  <div className="px-1">1.4</div>
                  <div>
                    ได้รับสินค้ามีตำหนิ ได้รับสินค้าที่เสียหาย (เช่น มีรอยแตก)
                  </div>
                </div>
              </div>
              <div className="flex px-2">
                <div className="px-1">2.</div>
                <div> การส่งหลักฐาน แจ้งเคลม หรือ คืนสินค้า</div>
              </div>
              <div className="px-3">
                <div className="flex ">
                  <div className="px-1">2.1</div>
                  <div>
                    ผู้ซื้อต้องส่งหลักฐานภาพถ่ายหรือวิดีโอ หรือทั้งคู่ ที่
                    ชัดเจนโดยจะต้องสนับสนุนเหตุผลในขอคืนสินค้า/คืนเงินอย่างชัดเจน
                    ตัวอย่างเช่น : ภาพถ่ายหรือวิดีโอ หรือทั้งคู่
                    ที่แสดงถึงความผิดปกติของสินค้า(สำหรับสินค้าที่เสียหาย)
                  </div>
                </div>
                <div className="flex ">
                  <div className="px-1">2.2</div>
                  <div>
                    ภาพถ่ายหน้ากล่องพัสดุ และภาพถ่ายสินค้าภายในกล่องพัสดุ
                  </div>
                </div>
                <div className="flex">
                  <div className="px-1">2.3</div>
                  <div>
                    ต้องแจ้งภายใน 7 วัน นับตั้งแต่วันที่ขึ้นสถานะจัดส่งสำเร็จ
                  </div>
                </div>
              </div>

              <div className="flex px-2">
                <div className="px-1">3.</div>
                <div>
                  ระยะเวลา
                  และวิธีการรับเงินคืนระยะเวลาการคืนเงินจะขึ้นอยู่กับช่องทางการชำระเงินของลูกค้า
                  โดยมีรายละเอียดดังต่อไปนี้
                </div>
              </div>
              <div className="px-3">
                <div className="flex ">
                  <div className="px-1">3.1</div>
                  <div> ชำระผ่านบัตรเครดิตหรือการผ่อนชำระ 7-15 วันทำการ </div>
                </div>
                <div className="flex ">
                  <div className="px-1">2.2</div>
                  <div> ชำระผ่านบัตรเดบิต 15-45 วันทำการ</div>
                </div>
              </div>

              <div className="px-1">
                หากชำระเงินผ่าน ATM, โอนผ่านช่องทางธนาคาร เจ้าหน้าที่จะ
                ดำเนินการคืนเงินภายใน 48 ชั่วโมง หากมีข้อสงสัยกรุณาติดต่อ
                เจ้าหน้าที่
              </div>
            </div>
            <div className="p-1">
              <div
                className="flex outline-gold-mbk text-gold-mbk text-center text-lg font-bold bt-line "
                onClick={doSaveReturnOrder}
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

export default ReturnModel;
